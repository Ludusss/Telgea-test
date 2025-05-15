# MVNO Integration Solution

Integration service for MVNO providers with Telgea's API normalizer. Built with TypeScript and follows Domain-Driven Design principles.

## Features

- Normalizes data from multiple MVNO sources (SOAP/REST)
- Aggregates usage and SMS charging data
- Type-safe implementation with comprehensive error handling
- Follows DDD principles for maintainable, scalable architecture

## Prerequisites

- Node.js >= 18.0.0
- npm

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

## Testing

Run the test suite:

```bash
npm test
```

## API Endpoints

### Get Usage Data
```http
GET /api/mvno/usage/:userId
```

### Get SMS Data
```http
GET /api/mvno/sms/:userId
```

### Get Aggregated Data
```http
GET /api/mvno/aggregated/:userId
```

## Project Structure

```
/src
  /api            # Express routes and controllers
  /application    # Application services and DTOs
  /domain         # Core business logic and entities
  /infrastructure # External integrations (SOAP/REST)
/tests            # Test files
```

## Architecture

- **Domain Layer**: Core business entities (User, UsageData, SmsCharge)
- **Application Layer**: Use cases and data transformation
- **Infrastructure Layer**: External API clients
- **API Layer**: REST API endpoints and controller

## Error Handling

- Comprehensive error handling throughout all layers
- Detailed error messages for debugging
- Error logging for monitoring

## Testing Strategy

- Unit tests for core business logic
