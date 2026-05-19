import express from 'express';
import cors from 'express'; // Wait, cors is a separate package
import authRoutes from './routes/auth.route';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
// We will use require('cors') locally if types are problematic, but let's assume it works.
const corsMiddleware = require('cors');
app.use(corsMiddleware());

// Routes
app.use('/api/auth', authRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
