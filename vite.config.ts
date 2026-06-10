import { defineConfig } from 'vite'
import type { ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { IncomingMessage, ServerResponse } from 'http'

// Custom plugin to handle local API requests for reading/writing portfolio data
const portfolioEditorPlugin = () => {
  return {
    name: 'portfolio-editor-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.url === '/api/portfolio' && req.method === 'GET') {
          const filePath = path.resolve(process.cwd(), 'src/data/portfolio.json');
          fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Failed to read portfolio.json' }));
              return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
          });
        } else if (req.url === '/api/portfolio' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              const filePath = path.resolve(process.cwd(), 'src/data/portfolio.json');
              fs.writeFile(filePath, JSON.stringify(parsed, null, 2), 'utf-8', (err) => {
                if (err) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Failed to write portfolio.json' }));
                  return;
                }
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              });
            } catch {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
            }
          });
        } else {
          next();
        }
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), portfolioEditorPlugin()],
  base: '/',
})

