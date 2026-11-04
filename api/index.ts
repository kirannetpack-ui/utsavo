/**
 * Vercel Serverless Function Entry Point
 * Handles /api/chat, /api/search, /api/maps, /api/transcribe, and /api/health
 */

import express from 'express';
import dotenv from 'dotenv';
import { apiRouter } from '../src/server/apiRouter';

dotenv.config();

const app = express();
app.use(express.json({ limit: '20mb' }));

// Handle requests whether matched as /api/* or rewritten
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
