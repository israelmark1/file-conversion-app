import { PubSub } from "@google-cloud/pubsub";
import { Server } from "ws";

const pubsub = new PubSub();
let wss; // WebSocket Server
let activeSocket: { readyState: any; OPEN: any; send: (arg0: string) => void; } | null = null; // Store the active WebSocket connection

export default function handler(req: Request, res: any) {
  if (!res.socket.server.wss) {
    wss = new Server({ server: res.socket.server });
    res.socket.server.wss = wss;

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

  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};

// Set up Pub/Sub subscription
const subscription = pubsub.subscription("your-subscription-name");

subscription.on("message", (message) => {
  console.log("Received Pub/Sub message:", message.data.toString());

  // Notify the active WebSocket client
  if (activeSocket && activeSocket.readyState === activeSocket.OPEN) {
    activeSocket.send(message.data.toString());
  }

  message.ack();
});
