import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { RouterContractClient } from '@orpc/contract';
import type { contract } from '@repo/api';

/** 后端 oRPC 服务源（含协议与端口），可通过环境变量覆盖 */
const ORIGIN = import.meta.env.VITE_API_ORIGIN ?? 'http://127.0.0.1:3000';

/** 后端 oRPC 服务地址路径（不含 origin），需与后端 handler 的 prefix 一致 */
const RPC_PATH = '/rpc';

/** 前端的类型安全 oRPC 客户端 */
export type ORPCClient = RouterContractClient<typeof contract>;

/**
 * 创建指向后端的 oRPC 客户端
 *
 * 集中管理客户端配置（origin、path、link），
 * 业务层只依赖返回的客户端实例，无需关心底层实现。
 */
export function createClient(options?: { origin?: string; baseURL?: `/${string}` }): ORPCClient {
  const { origin = ORIGIN, baseURL = RPC_PATH } = options ?? {};

  const link = new RPCLink({ origin, url: baseURL });
  return createORPCClient(link);
}

/** 默认的 oRPC 客户端实例 */
export const client = createClient();
