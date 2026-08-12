// ─────────────────────────────────────────────────────────────────────────────
//  src/app.ts
//  Express application factory.
//  Keeps configuration and middleware setup separate from the HTTP server,
//  making the app easily testable (import app without binding to a port).
// ─────────────────────────────────────────────────────────────────────────────

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';

// ── Routes ────────────────────────────────────────────────────────────────────
import quranRoutes   from './routes/quranRoutes';
import azkarRoutes   from './routes/azkarRoutes';
import prayerRoutes  from './routes/prayerRoutes';
import healthRoutes  from './routes/healthRoutes';

// ── Middlewares ───────────────────────────────────────────────────────────────
import { globalErrorHandler, notFoundHandler } from './middlewares/errorHandler';

// ─────────────────────────────────────────────────────────────────────────────

const app: Application = express();

// ── Security headers (Helmet) ─────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env['ALLOWED_ORIGINS'] ?? '*';
const corsOptions: cors.CorsOptions =
  allowedOrigins === '*'
    ? { origin: '*' }
    : {
        origin: allowedOrigins.split(',').map((o) => o.trim()),
        methods: ['GET', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      };

app.use(cors(corsOptions));

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/v1/quran',   quranRoutes);
app.use('/api/v1/azkar',   azkarRoutes);
app.use('/api/v1/prayers', prayerRoutes);
app.use('/health',         healthRoutes);

// ── 404 handler (must be after all valid routes) ──────────────────────────────
app.use(notFoundHandler);

// ── Global error handler (must be last — 4-argument signature) ────────────────
app.use(globalErrorHandler);

export default app;
