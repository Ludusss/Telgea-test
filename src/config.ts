/**
 * Application configuration
 */
export const config = {
  // Server config
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  // API URLs
  soapApiUrl:
    process.env.SOAP_API_URL || "https://mvno-provider.example.com/soap",
  restApiUrl:
    process.env.REST_API_URL || "https://mvno-provider.example.com/api/v1",

  // Authentication (would be stored in environment variables in a real app)
  apiKey: process.env.API_KEY || "test-api-key",

  // Logging
  logLevel: process.env.LOG_LEVEL || "info",

  // Timeouts
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || "30000", 10), // 30 seconds

  // Retries
  maxRetries: parseInt(process.env.MAX_RETRIES || "3", 10),
  retryDelay: parseInt(process.env.RETRY_DELAY || "1000", 10), // 1 second
};
