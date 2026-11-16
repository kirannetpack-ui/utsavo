/**
 * UTSAVO - Standalone Server & Dev Middleware
 * Mounts apiRouter at /api and Vite middleware in development
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './src/server/apiRouter';

import fs from 'fs';
import http from 'http';
import { attachLiveVoiceWebSocket } from './src/server/liveVoiceHandler';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Dev server in AI Studio must strictly run on port 3000
const port = 3000;

app.use(express.json({ limit: '20mb' }));

// Mount all API endpoints
app.use('/api', apiRouter);

// Standalone server lifecycle
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        ws: false,
      },
      appType: 'spa',
    });

    // Prevent @vite/client from opening an HMR WebSocket connection in reverse-proxy/disabled-HMR environments
    // while keeping transport.connect() marked as connected so plugin hot.send() calls resolve without SendBeforeConnectError
    app.get('/@vite/client', async (_req, res, next) => {
      try {
        const result = await vite.transformRequest('/@vite/client');
        if (!result) return next();
        const patchedCode = result.code
          .replace(
            'async connect(handlers) {',
            'async connect() { return;'
          )
          .replace('await wsTransport.disconnect();', 'return;')
          .replace('wsTransport.send(data);', 'return Promise.resolve();');
        res.status(200).set({ 'Content-Type': 'application/javascript' }).end(patchedCode);
      } catch (err) {
        next(err);
      }
    });

    app.use(vite.middlewares);

    // Fallback for HTML5 client-side routing (e.g. /invite/UTS-INV-8921)
    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const url = req.originalUrl;
        const indexPath = path.resolve(__dirname, 'index.html');
        if (fs.existsSync(indexPath)) {
          let template = fs.readFileSync(indexPath, 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } else {
          next();
        }
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  const httpServer = http.createServer(app);
  attachLiveVoiceWebSocket(httpServer);

  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`UTSAVO Server running on http://0.0.0.0:${port}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
