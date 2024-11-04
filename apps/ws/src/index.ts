import WebSocket, { WebSocketServer } from "ws";
import { z } from "zod";
import { prisma } from "@repo/db/prisma";

const wss = new WebSocketServer({ port: 3001 });

wss.on('error', console.error);

interface clientMessage {
  type: 'join' | 'move';
  payload: any;
}

const clientMessageSchema = z.object({
  type: z.enum(['join', 'move']),
  payload: z.any(),
});

let rooms = new Map<string, WebSocket[]>();

function handleMessage(message: string) {
  try {
    const obj = JSON.parse(message);

    switch (obj.type) {
      case 'join':
        break;
      case 'move':
        break;
      default:
        break;
    }
    clientMessageSchema.parse(obj);
    console.log(obj);
  } catch (e) {
    console.log(e);
  }
}

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    handleMessage(message.toString());
  });
});
