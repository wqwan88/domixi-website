import Database from "better-sqlite3";
import path from "path";

/* ── 数据库文件位置 ── */
const DB_PATH =
  process.env.MPESA_DB_PATH || path.join(process.cwd(), "data", "mpesa.db");

/* ── 单例 ── */
let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!_db) {
    const fs = require("fs");
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");
    migrate(_db);
  }
  return _db;
}

/* ── 迁移 ── */

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS mpesa_orders (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      checkout_request_id TEXT NOT NULL,
      merchant_request_id TEXT NOT NULL,
      phone             TEXT NOT NULL,
      amount            INTEGER NOT NULL,
      account_ref       TEXT NOT NULL,
      status            TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','success','failed','expired')),
      result_code       INTEGER,
      result_desc       TEXT,
      mpesa_receipt     TEXT,
      transaction_date  TEXT,
      raw_callback      TEXT,
      created_at        TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_mpesa_orders_checkout_id
      ON mpesa_orders(checkout_request_id);

    CREATE INDEX IF NOT EXISTS idx_mpesa_orders_account_ref
      ON mpesa_orders(account_ref);

    CREATE TABLE IF NOT EXISTS mpesa_callbacks_raw (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      checkout_request_id TEXT,
      raw_body          TEXT NOT NULL,
      received_at       TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // 增量迁移：老库补列（重复执行会报错，忽略即可）
  const addColumn = (ddl: string) => {
    try {
      db.exec(ddl);
    } catch {
      /* 列已存在 */
    }
  };
  // 充值归属的 New API 用户 ID（从控制台钱包页带入）
  addColumn("ALTER TABLE mpesa_orders ADD COLUMN user_id INTEGER");
  // 是否已写入 New API 余额（幂等标记，防止回调/query 双路径重复到账）
  addColumn("ALTER TABLE mpesa_orders ADD COLUMN credited INTEGER NOT NULL DEFAULT 0");
}

/* ── CRUD ── */

export interface MpesaOrderRow {
  id: number;
  checkout_request_id: string;
  merchant_request_id: string;
  phone: string;
  amount: number;
  account_ref: string;
  status: "pending" | "success" | "failed" | "expired";
  result_code: number | null;
  result_desc: string | null;
  mpesa_receipt: string | null;
  transaction_date: string | null;
  raw_callback: string | null;
  user_id: number | null;
  credited: number;
  created_at: string;
  updated_at: string;
}

export function createOrder(order: {
  checkout_request_id: string;
  merchant_request_id: string;
  phone: string;
  amount: number;
  account_ref: string;
  user_id?: number | null;
}): MpesaOrderRow {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO mpesa_orders (checkout_request_id, merchant_request_id, phone, amount, account_ref, user_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    order.checkout_request_id,
    order.merchant_request_id,
    order.phone,
    order.amount,
    order.account_ref,
    order.user_id ?? null
  );
  return getOrderByCheckoutId(order.checkout_request_id)!;
}

export function getOrderByCheckoutId(
  checkoutRequestId: string
): MpesaOrderRow | undefined {
  const db = getDb();
  return db
    .prepare("SELECT * FROM mpesa_orders WHERE checkout_request_id = ?")
    .get(checkoutRequestId) as MpesaOrderRow | undefined;
}

export function getOrderByAccountRef(ref: string): MpesaOrderRow | undefined {
  const db = getDb();
  return db
    .prepare("SELECT * FROM mpesa_orders WHERE account_ref = ?")
    .get(ref) as MpesaOrderRow | undefined;
}

export function updateOrderStatus(
  checkoutRequestId: string,
  updates: {
    status: "success" | "failed" | "expired";
    result_code: number | null;
    result_desc: string | null;
    mpesa_receipt: string | null;
    transaction_date: string | null;
    raw_callback: string | null;
  }
): void {
  const db = getDb();
  db.prepare(`
    UPDATE mpesa_orders
    SET status = ?,
        result_code = ?,
        result_desc = ?,
        mpesa_receipt = ?,
        transaction_date = ?,
        raw_callback = ?,
        updated_at = datetime('now')
    WHERE checkout_request_id = ?
  `).run(
    updates.status,
    updates.result_code,
    updates.result_desc,
    updates.mpesa_receipt,
    updates.transaction_date,
    updates.raw_callback,
    checkoutRequestId
  );
}

export function markOrderCredited(checkoutRequestId: string): void {
  const db = getDb();
  db.prepare(
    "UPDATE mpesa_orders SET credited = 1, updated_at = datetime('now') WHERE checkout_request_id = ?"
  ).run(checkoutRequestId);
}

export function saveRawCallback(
  checkoutRequestId: string | null,
  rawBody: string
): void {
  const db = getDb();
  db.prepare(
    "INSERT INTO mpesa_callbacks_raw (checkout_request_id, raw_body) VALUES (?, ?)"
  ).run(checkoutRequestId, rawBody);
}

export { getDb }; // 测试用