import type { Server } from 'node:http';

export interface WSApi {
  send(text: string): void;
  onmessage?: (text: string) => void;
}
export interface WS {
  on(event: 'connection', cb: (socket: WSApi) => void): void;
  broadcast(text: string): void;
}
export interface WSConfig {
  cors?: { origin: string | string[] };
}

export declare function createWS(app: { node: Server }, config?: WSConfig): WS;
export declare function acceptKey(key: string): string;
export declare function encodeFrame(text: string): Buffer;
export declare function decodeFrame(buf: Buffer): { opcode: number; payload: Buffer };
export declare const GUID: string;
