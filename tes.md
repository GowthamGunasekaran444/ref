4.4 Backend Architecture (FastAPI)

The backend is built with FastAPI, enabling high-performance APIs with clean modular separation. Each feature of the application is isolated into its own module, helping teams maintain and scale the backend without dependency conflicts.

Core Characteristics

FastAPI for asynchronous, high-performance API handling

Feature-based modules (feedback, interaction, risk predictor, session, user)

Clear separation of concerns through a four-layer architecture

Module Design (4-Layer Structure)

Controller – Defines API routes, receives requests, and returns responses

Schema – Validates request/response formats using Pydantic

Service – Contains business logic and orchestrates workflow

Repository – Executes SQL operations and stored procedure calls

System Integrations

Secure SQL Server communication via Client ID + Secret

SP-driven database operations for performance

MLflow endpoint interaction for prediction services

Application Entry Point

main.py mounts routers, configures middleware, and serves the UI build

Responsible for binding backend logic and frontend distribution

4.5 Frontend Architecture (React + Redux Toolkit)

The frontend is implemented using React with Redux Toolkit, ensuring predictable state management and simplified integration with Azure AD SSO. The structure is designed for clarity and scalability as new screens and modules are added.

Key Technologies

React (TypeScript) for component-based UI

Redux Toolkit for centralized, predictable state handling

MSAL for Azure AD Single Sign-On authentication

Folder Structure Overview

components – Reusable UI elements (cards, tables, layout controls)

pages – Full-screen modules such as Landing Page, Risk Predictor

hooks – Custom logic including CSV/PDF/Excel export utilities

reducer – Feature-based Redux slices (session, interaction, predictor)

router – Public/private routes with MSAL authentication checks

store – Root Redux store configuration

Design Principles

Reusable components promote UI consistency

Slices ensure isolated and maintainable state management

Secure routing prevents unauthorized UI access

4.4.1 Database Model Structure

The QGPT system uses SQL Server as its core relational database. All backend data models are managed through ORM structures stored under the db/model directory. The system is optimized using stored procedures for structured and secure data access.

Modeling Approach

ORM models mapped to database tables (sessions, interactions, users, feedback, risk data)

Consistent naming and structure aligned with backend modules

Supports traceability for ML prediction logs

Stored Procedure Utilization

Database logic encapsulated in SPs for reliability

Optimized query execution plans

Reduced SQL complexity within backend code

Secure Database Connectivity

Authentication via Service Principal (Client ID + Secret)

Configuration stored securely in Azure Web App settings

No plain-text credentials in code

Role in Prediction Pipeline

Stores MLflow prediction inputs & outputs for audit

Maintains historical logs and summary metrics
