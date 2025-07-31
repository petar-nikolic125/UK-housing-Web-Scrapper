import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from "../server/app";

let app: any = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!app) {
    app = await createApp();
  }
  
  // Handle the request with Express app
  app(req, res);
}