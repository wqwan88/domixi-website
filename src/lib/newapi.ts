/**
 * New API 控制台钱包写入层
 *
 * 支付成功后，直接在 New API 的 SQLite 库中：
 *   1. users.quota += quotaToAdd         （用户余额增加）
 *   2. top_ups 插入一条 success 流水      （控制台充值记录可见）
 *
 * 通过 NEW_API_DB_PATH 指定库文件路径（容器内挂载 new-api 数据目录后指向 one-api.db）。
 * 未配置 / 用户未关联时静默跳过，订单仍在 mpesa.db 标记成功。
 *
 * 换算：New API 中 quota_per_unit = 500000，即界面显示 $1 = 500000 quota。
 *   quotaToAdd = amountKes / KES_PER_USD * QUOTA_PER_UNIT
 */

import Database from "better-sqlite3";
import { env, envInt } from "@/lib/env";

const QUOTA_PER_UNIT = () => envInt("NEW_API_QUOTA_PER_UNIT", 500000);
const KES_PER_USD = () => Number(process.env.KES_PER_USD || "130");

export function kesToQuota(amountKes: number): number {
  return Math.max(1, Math.round((amountKes / KES_PER_USD()) * QUOTA_PER_UNIT()));
}

function openNewApi(): Database.Database | null {
  let path: string;
  try {
    path = env("NEW_API_DB_PATH");
  } catch {
    return null; // 未配置
  }
  try {
    const db = new Database(path);
    // 与 new-api (WAL) 共存：等待锁，避免 SQLITE_BUSY 直接失败
    db.pragma("busy_timeout = 5000");
    return db;
  } catch (e: any) {
    console.error(`[MPESA Credit] 无法打开 New API 库 ${path}:`, e?.message);
    return null;
  }
}

/* 校验用户存在且未删除 */
export function validateNewApiUser(userId: number): boolean {
  const db = openNewApi();
  if (!db) return false;
  try {
    const row = db
      .prepare("SELECT id FROM users WHERE id = ? AND deleted_at IS NULL")
      .get(userId);
    return !!row;
  } catch {
    return false;
  } finally {
    db.close();
  }
}

/**
 * 给用户充值：quota 增加 + top_ups 流水。
 * 同一 trade_no（订单号 DMX…）已存在 → 视为重复，跳过。
 * 返回是否实际写入了额度。
 */
export function creditNewApiUser(
  userId: number,
  amountKes: number,
  accountRef: string,
  mpesaReceipt: string | null
): boolean {
  const db = openNewApi();
  if (!db) {
    console.warn("[MPESA Credit] 未配置 NEW_API_DB_PATH，跳过钱包入账");
    return false;
  }

  try {
    // 幂等：同一订单号已入账过就不重复（top_ups.trade_no 有唯一索引）
    const dup = db
      .prepare("SELECT id FROM top_ups WHERE trade_no = ?")
      .get(accountRef);
    if (dup) {
      console.warn(`[MPESA Credit] 订单 ${accountRef} 已在 top_ups 存在，重复入账被拦截`);
      return false;
    }

    const user = db
      .prepare("SELECT id FROM users WHERE id = ? AND deleted_at IS NULL")
      .get(userId) as { id: number } | undefined;
    if (!user) {
      console.error(`[MPESA Credit] New API 用户 ${userId} 不存在，无法入账`);
      return false;
    }

    const quotaToAdd = kesToQuota(amountKes);
    const usdValue = quotaToAdd / QUOTA_PER_UNIT();
    const now = Math.floor(Date.now() / 1000);
    const note = mpesaReceipt ? `${accountRef}/${mpesaReceipt}` : accountRef;

    const tx = db.transaction(() => {
      db.prepare("UPDATE users SET quota = quota + ? WHERE id = ?").run(
        quotaToAdd,
        userId
      );
      db.prepare(
        `INSERT INTO top_ups
           (user_id, amount, money, trade_no, payment_method, payment_provider, create_time, complete_time, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(userId, quotaToAdd, usdValue, note, "mpesa", "mpesa", now, now, "success");
    });
    tx();

    console.log(
      `[MPESA Credit] ✅ 用户 ${userId} 入账 ${quotaToAdd} quota（≈$${usdValue.toFixed(4)}，KES ${amountKes}，订单 ${accountRef}）`
    );
    return true;
  } catch (e: any) {
    console.error(`[MPESA Credit] 入账失败（用户 ${userId}，订单 ${accountRef}）:`, e?.message);
    return false;
  } finally {
    db.close();
  }
}
