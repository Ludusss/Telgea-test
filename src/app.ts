import express from "express";
import cors from "cors";
import helmet from "helmet";
import "reflect-metadata"; // Required for InversifyJS
import routes from "./api/routes/mvno.routes";
import { config } from "./config";

// Create Express server
const app = express();

// Set up middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up routes
app.use("/api/mvno", routes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "production" ? undefined : err.message,
    });
  }
);

// Start server
if (process.env.NODE_ENV !== "test") {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

export default app;
