import express from "express";
import { registerRoutes } from "../server/routes.js";

const app = express();

// Register all routes without starting the server
registerRoutes(app);

// Export for Vercel
export default app;