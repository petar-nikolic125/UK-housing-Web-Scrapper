import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import "./auto-refresh"; // Initialize auto-refresh system

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ───────────────────────────────────────────────────────────────────────────────
// Request logger (only /api/*)
// ───────────────────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: unknown | undefined;

  const originalResJson = res.json.bind(res);
  res.json = function (bodyJson: unknown, ...args: unknown[]) {
    capturedJsonResponse = bodyJson;
    // @ts-ignore – spread overload isn’t worth the hassle here
    return originalResJson(bodyJson, ...args);
  } as typeof res.json;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
      log(logLine);
    }
  });

  next();
});

// ───────────────────────────────────────────────────────────────────────────────
// Demo auto‑refresh (scraper)
// ───────────────────────────────────────────────────────────────────────────────
(async () => {
  // Refresh every 2 min so the demo always has fresh data
  setInterval(async () => {
    try {
      const cities = [
        "Birmingham",
        "Manchester",
        "Leeds",
        "Liverpool",
        "Sheffield",
      ];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];

      const { storage } = await import("./storage");
      await (storage as any).refreshWithScrapedData?.(randomCity, 500000, 90);
      console.log(`Auto‑refreshed properties with new scraped data from ${randomCity}`);
    } catch (err) {
      console.error("Failed to auto‑refresh properties:", err);
    }
  }, 2 * 60 * 1000);

  // ─────────────────────────────────────────────────────────────────────────────
  // API routes
  // ─────────────────────────────────────────────────────────────────────────────
  const server = await registerRoutes(app);

  // Central error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status ?? err.statusCode ?? 500;
    const message = err.message ?? "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // Front‑end (Vite in dev, static in prod)
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Start server – bind explicitly to HOST; drop reusePort (caused ENOTSUP)
  // ─────────────────────────────────────────────────────────────────────────────
  const PORT = 5000; // Force port 5000 for Replit preview compatibility
  const HOST = "0.0.0.0"; // Force 0.0.0.0 for accessible port binding in Replit

  server.listen(PORT, HOST, () => {
    log(`🚀  API & client ready → http://${HOST}:${PORT}`);
  });
})();
