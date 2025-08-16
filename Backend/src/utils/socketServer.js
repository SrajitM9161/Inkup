// wsServer.js
import WebSocket from 'ws';

const wsConnections = new Map(); // Map userId -> ws

export const setupWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    const params = new URLSearchParams(req.url.replace('/?', ''));
    const userId = params.get('userId');
    if (!userId) {
      ws.close();
      return;
    }

    wsConnections.set(userId, ws);

    ws.on('close', () => {
      wsConnections.delete(userId);
    });
  });

  return { wss, wsConnections };
};

export default wsConnections;
