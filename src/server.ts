// ─────────────────────────────────────────────────────────────────────────────
//  src/server.ts
//  HTTP server bootstrap — loads env, starts the server, and handles
//  graceful shutdown on SIGTERM / SIGINT (required for Docker/Render/Vercel).
// ─────────────────────────────────────────────────────────────────────────────

import * as dotenv from 'dotenv';
dotenv.config(); // Must run before importing app (app reads process.env)

import http from 'http';
import app from './app';

// ── Config ────────────────────────────────────────────────────────────────────

const PORT = parseInt(process.env['PORT'] ?? '3000', 10);
const NODE_ENV = process.env['NODE_ENV'] ?? 'development';

// ── Server bootstrap ──────────────────────────────────────────────────────────

const server: http.Server = http.createServer(app);

server.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║         🕌  Islamic App API  🕌                ║');
  console.log('╠════════════════════════════════════════════════╣');
  console.log(`║  Environment : ${NODE_ENV.padEnd(30)}║`);
  console.log(`║  Port        : ${String(PORT).padEnd(30)}║`);
  console.log('╠════════════════════════════════════════════════╣');
  console.log('║  Endpoints:                                    ║');
  console.log('║  GET /health                                   ║');
  console.log('║  GET /api/v1/quran/surahs                      ║');
  console.log('║  GET /api/v1/quran/surahs/:id                  ║');
  console.log('║  GET /api/v1/azkar                             ║');
  console.log('║  GET /api/v1/azkar/category/:category          ║');
  console.log('║  GET /api/v1/prayers/timings                   ║');
  console.log('╚════════════════════════════════════════════════╝');
});

// ── Graceful shutdown ─────────────────────────────────────────────────────────

function gracefulShutdown(signal: string): void {
  console.log(`\n[Server] Received ${signal}. Shutting down gracefully…`);
  server.close((err?: Error) => {
    if (err) {
      console.error('[Server] Error during shutdown:', err.message);
      process.exit(1);
    }
    console.log('[Server] HTTP server closed. Goodbye 👋');
    process.exit(0);
  });

  // Force exit after 10 s if server hasn't closed cleanly
  setTimeout(() => {
    console.error('[Server] Forced shutdown after timeout.');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));

// ── Unhandled rejection / exception guards ────────────────────────────────────

process.on('unhandledRejection', (reason: unknown) => {
  console.error('[Server] Unhandled Promise Rejection:', reason);
  // Allow graceful shutdown to run
  process.exit(1);
});

process.on('uncaughtException', (err: Error) => {
  console.error('[Server] Uncaught Exception:', err.message);
  process.exit(1);
});
