# MVNO Integration Architecture Document

## Overview

This document outlines the architecture for integrating a new Mobile Virtual Network Operator (MVNO) partner with Telgea's internal API normalizer. The solution follows Domain-Driven Design (DDD) principles to create a maintainable, scalable, and extensible system that can adapt to future MVNO integrations.

## Architecture Approach

The architecture follows a clean, layered approach based on DDD:

**1. Domain Layer**

- Contains core business concepts, entities, and value objects
- Defines the ubiquitous language for telecom data and operations
- Implements domain services that encapsulate business rules

**2. Application Layer**

- Orchestrates use cases by coordinating domain objects and services
- Contains services that implement application-specific logic
- Manages data transformations between external and internal formats
- Handles commands and queries that represent user intentions

**3. Infrastructure Layer**

- Implements technical capabilities like API clients
- Contains adapters for external systems (SOAP/REST clients)
- Handles persistence concerns (if applicable)
- Manages cross-cutting concerns like logging and monitoring

**4. Interface Layer**

- Express.js API endpoints exposing integration capabilities
- Controllers handling HTTP requests/responses
- API documentation and validation

## Design Decisions

1. **Provider Agnostic Architecture**  
   The system is designed to accommodate multiple MVNO providers by implementing the adapter pattern. Each provider has its own adapter that converts from provider-specific formats to our internal format.

2. **Data Aggregation Strategy**  
   Since the MVNO provides data through multiple endpoints (SOAP for SMS, REST for usage data), we implement an aggregation service that combines these into the unified internal format.

3. **Error Handling and Resilience**  
   The implementation includes proper error handling with specific error types and a retry mechanism for transient failures in API calls.

4. **Type Safety**  
   Extensive use of TypeScript interfaces ensures type safety throughout the application, reducing runtime errors.

5. **Testing Strategy**  
   The architecture supports comprehensive testing at multiple levels:
   - Unit tests for domain logic
   - Integration tests for API clients
   - End-to-end tests for complete flows

## Key Components

**Converters**  
Specialized components that transform data between formats:

- SOAP to Internal Format Converter
- REST to Internal Format Converter
- Aggregated Internal Format Builder

**API Clients**  
Abstracted clients that handle communication details:

- SOAP Client for SMS charging data
- REST Client for usage data

**Domain Models**  
Well-defined entities and value objects representing core concepts:
