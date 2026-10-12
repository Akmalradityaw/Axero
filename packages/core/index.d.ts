import type { IncomingMessage, ServerResponse, Server } from 'node:http';

export interface Req extends IncomingMessage {
  params: Record<string, string>;
}
export interface Res extends ServerResponse {
  json(body: unknown): void;
}
export type Handler = (req: Req, res: Res) => void;

export interface App {
  node: Server;
  get(path: string, handler: Handler): void;
  post(path: string, handler: Handler): void;
  loadRoutes(dir: string): Promise<void>;
  listen(port?: number): Promise<void>;
}

export declare function createServer(): App;
