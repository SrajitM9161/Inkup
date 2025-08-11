import { WebSocketServer } from "ws";

let wss;
const clients = new Map();

export function initWebSocketServer(server) {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    try {
      const params = new URLSearchParams(req.url.split("?")[1] || "");
      const userId = params.get("userId");

      if (!userId) {
        ws.send(JSON.stringify({ error: "Missing userId" }));
        ws.close();
        return;
      }

      clients.set(userId, ws);
      console.log(`🔌 WebSocket connected: ${userId}`);

      // ✅ Optional: Send confirmation when connected
      ws.send(JSON.stringify({ type: "CONNECTED", userId }));

      ws.on("message", (message) => {
        try {
          const data = JSON.parse(message);
          console.log(`📩 Message from ${userId}:`, data);

          // You can handle incoming events here if needed
          if (data.type === "PING") {
            ws.send(JSON.stringify({ type: "PONG" }));
          }
        } catch (err) {
          console.error("❌ Invalid JSON from client:", message);
        }
      });

      ws.on("close", () => {
        clients.delete(userId);
        console.log(`❌ WebSocket disconnected: ${userId}`);
      });

      ws.on("error", (err) => {
        console.error(`⚠️ WebSocket error for ${userId}:`, err);
      });

    } catch (err) {
      console.error("❌ Error in connection handler:", err);
    }
  });
}

export function notifyUser(userId, eventData) {
  const client = clients.get(userId);
  if (client && client.readyState === client.OPEN) {
    client.send(JSON.stringify(eventData));
  }
}

export function broadcast(eventData) {
  for (const [, ws] of clients) {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(eventData));
    }
  }
}

export function getConnectedUsers() {
  return Array.from(clients.keys());
}
