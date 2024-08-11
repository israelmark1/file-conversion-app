import { PubSub } from "@google-cloud/pubsub";
import { Server } from "ws";
import { NextApiRequest, NextApiResponse } from "next";

const pubsub = new PubSub();
let wss: Server;
let activeSocket: import("ws") | null = null;

function initializeWebSocketServer(server: any) {
  wss = new Server({ server });

  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
    activeSocket = ws;

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      activeSocket = null;
    });
  });

  console.log("WebSocket server initialized");
}

function handleMessage(message: any) {
  try {
    console.log("Received Pub/Sub message:", message.data.toString());

    if (activeSocket && activeSocket.readyState === activeSocket.OPEN) {
      activeSocket.send(message.data.toString());
    }

    message.ack();
  } catch (error) {
    console.error("Error handling Pub/Sub message: ", error);
    message.nack();
  }
}

export default function handler(req: NextApiRequest, res: any) {
  if (!res.socket.server.wss) {
    initializeWebSocketServer(res.socket.server);
    res.socket.server.wss = wss;
  }

  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const subscription = pubsub.subscription("converted-files-sub");
subscription.on("message", handleMessage);
