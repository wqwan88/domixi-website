import { type Lang, getDict } from "./i18n";
import { brand } from "./brand";

/**
 * Build the OpenAPI document for a given site language.
 *
 * All human-readable strings live in the per-language `api` section of
 * `src/lib/translations/*`, so the Scalar interactive reference follows the
 * language the visitor is reading the site in.
 */
export function buildOpenApi(lang: Lang) {
  const t = getDict(lang).api;
  const serverBase = brand.gatewayUrl.replace(/\/v1\/?$/, "");

  return {
    openapi: "3.1.0",
    info: {
      title: "DOMIXI API",
      version: "1.0.0",
      description: t.infoDesc,
    },
    servers: [{ url: serverBase, description: t.serverDesc }],
    tags: [
      { name: "Chat", description: t.tags.chat },
      { name: "Claude", description: t.tags.claude },
      { name: "Embeddings", description: t.tags.embeddings },
      { name: "Images", description: t.tags.images },
      { name: "Models", description: t.tags.models },
    ],
    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "API Key",
          description: t.bearerDesc,
        },
      },
      schemas: {
        ChatMessage: {
          type: "object",
          required: ["role", "content"],
          properties: {
            role: { type: "string", enum: ["system", "user", "assistant"] },
            content: { type: "string" },
          },
        },
        ChatRequest: {
          type: "object",
          required: ["model", "messages"],
          properties: {
            model: { type: "string", example: "deepseek-v4" },
            messages: {
              type: "array",
              items: { $ref: "#/components/schemas/ChatMessage" },
            },
            temperature: { type: "number", minimum: 0, maximum: 2 },
            max_tokens: { type: "integer" },
            stream: { type: "boolean", default: false },
          },
        },
        ChatChoice: {
          type: "object",
          properties: {
            index: { type: "integer" },
            message: { $ref: "#/components/schemas/ChatMessage" },
            finish_reason: { type: "string" },
          },
        },
        Usage: {
          type: "object",
          properties: {
            prompt_tokens: { type: "integer" },
            completion_tokens: { type: "integer" },
            total_tokens: { type: "integer" },
          },
        },
        ChatResponse: {
          type: "object",
          properties: {
            id: { type: "string" },
            object: { type: "string", example: "chat.completion" },
            model: { type: "string" },
            choices: {
              type: "array",
              items: { $ref: "#/components/schemas/ChatChoice" },
            },
            usage: { $ref: "#/components/schemas/Usage" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "object",
              properties: {
                message: { type: "string" },
                type: { type: "string" },
                code: { type: "string" },
              },
            },
          },
        },
      },
    },
    paths: {
      "/v1/chat/completions": {
        post: {
          tags: ["Chat"],
          summary: t.ops.chat.summary,
          description: t.ops.chat.description,
          operationId: "createChatCompletion",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ChatRequest" },
                example: {
                  model: "deepseek-v4",
                  messages: [{ role: "user", content: t.exampleMessage }],
                },
              },
            },
          },
          responses: {
            "200": {
              description: t.resp.ok,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ChatResponse" },
                },
              },
            },
            "401": errorResponse(t.resp.unauthorized),
            "402": errorResponse(t.resp.insufficient),
            "429": errorResponse(t.resp.rateLimited),
          },
        },
      },
      "/v1/messages": {
        post: {
          tags: ["Claude"],
          summary: t.ops.claude.summary,
          description: t.ops.claude.description,
          operationId: "createClaudeMessage",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["model", "max_tokens", "messages"],
                  properties: {
                    model: { type: "string", example: "claude-sonnet-4-5" },
                    max_tokens: { type: "integer", example: 1024 },
                    messages: {
                      type: "array",
                      items: { $ref: "#/components/schemas/ChatMessage" },
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: t.resp.ok },
            "401": { description: t.resp.unauthorized },
          },
        },
      },
      "/v1/embeddings": {
        post: {
          tags: ["Embeddings"],
          summary: t.ops.embeddings.summary,
          operationId: "createEmbedding",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["model", "input"],
                  properties: {
                    model: { type: "string", example: "text-embedding-3-small" },
                    input: {
                      oneOf: [
                        { type: "string" },
                        { type: "array", items: { type: "string" } },
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: { "200": { description: t.resp.ok } },
        },
      },
      "/v1/images/generations": {
        post: {
          tags: ["Images"],
          summary: t.ops.images.summary,
          operationId: "createImage",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["model", "prompt"],
                  properties: {
                    model: { type: "string" },
                    prompt: { type: "string" },
                    n: { type: "integer", default: 1 },
                    size: { type: "string", example: "1024x1024" },
                  },
                },
              },
            },
          },
          responses: { "200": { description: t.resp.ok } },
        },
      },
      "/v1/rerank": {
        post: {
          tags: ["Chat"],
          summary: t.ops.rerank.summary,
          operationId: "rerank",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    model: { type: "string" },
                    query: { type: "string" },
                    documents: { type: "array", items: { type: "string" } },
                  },
                },
              },
            },
          },
          responses: { "200": { description: t.resp.ok } },
        },
      },
      "/v1/models": {
        get: {
          tags: ["Models"],
          summary: t.ops.models.summary,
          operationId: "listModels",
          responses: {
            "200": {
              description: t.resp.ok,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      object: { type: "string", example: "list" },
                      data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            object: { type: "string" },
                            owned_by: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}

function errorResponse(description: string) {
  return {
    description,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/Error" },
      },
    },
  };
}
