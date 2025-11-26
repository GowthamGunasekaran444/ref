4. QGPT Application Architecture & Deployment Overview
4.1 Azure Web App Services Deployment Model
The QGPT Web Application is hosted entirely on Azure Web App Services, where both the frontend (React UI) and backend (FastAPI) run within a single Web App instance per environment.
4.1.1 Combined UI + Backend Build Strategy
To host both layers in one service:
1.	The React application is built and the output is generated inside the frontend/dist/ directory.
2.	This compiled UI build is moved into the backend/dist/ folder.
3.	A combined deployment package is prepared from the backend directory (including the UI build).
4.	The final packaged build is deployed as a single artifact to Azure Web App Services.
This approach ensures:
•	One unified runtime,
•	Simplified deployment pipeline,
•	Consistent SSL and domain configurations,
•	Reduced infrastructure overhead.
4.1.2 Web App Service Environments
The platform currently uses four Azure Web App Services:
1.	Development (DEV)
2.	User Acceptance Testing (UAT)
3.	Production (PROD)
(And one additional reference environment as needed.)
Each environment contains its own dedicated combined UI+API build to prevent configuration conflicts.
________________________________________
4.2 Repository Branching Strategy
The repository follows a controlled branching model with three active branches:
•	develop
•	uat
•	main (Production)
4.2.1 Code Promotion Workflow
The workflow for promoting code between branches is as follows:
From develop → uat
1.	Create a Pull Request (PR) from develop to uat.
2.	Trigger the pipeline:
QualityGPT-WebApp-CI
3.	Once pipeline execution succeeds, a new build artifact is generated.
4.	Release the generated artifact specifically to the UAT Web App Service.
Branch-Based Deployment Rules
To avoid SSL and environment configuration mismatches:
•	Deploy code only to the environment matching its branch.
o	develop → DEV
o	uat → UAT
o	main → PROD
Never deploy a build from one branch into a different environment, as this may break authentication, SSL bindings, and routing configurations.
________________________________________
4.3 Application Walkthrough
The repository is divided into two major folders:
/backend
/frontend
________________________________________
4.4 Backend Architecture (FastAPI)
The backend folder contains the complete FastAPI server code.
Functionality is modularized into the following domains:
•	feedback – manages user feedback operations
•	interaction – manages session and interaction logs
•	risk_predictor – contains Quality Risk Predictor logic
•	session – stores user-session lifecycle management
•	user – manages user details and identity mapping
•	db – contains database models and connection configuration
________________________________________
4.4.1 Database Model Structure
Inside the db/model directory, all database table models for:
•	QualityGPT, and
•	Quality Risk Predictor
are defined using ORM (e.g., SQLAlchemy).
________________________________________
4.4.2 Module Structure (Controller → Repository → Schema → Service)
Each module follows a 4-layer architecture:
1. Controller
•	Acts as the entry point for API routes.
•	Receives HTTP requests.
•	Validates basic request structure.
•	Delegates business logic to the service layer.
2. Repository
•	Responsible for all database interactions.
•	Executes CRUD operations.
•	Interacts directly with ORM models.
•	Provides database abstraction for the service layer.
3. Schema
•	Defines request and response models using Pydantic.
•	Ensures validation, typing, and consistent API payload structures.
•	Prevents malformed data from reaching the service or DB layers.
4. Service
•	Contains business logic.
•	Calls repository functions for database operations.
•	Contains validations, rules, and data transformations.
•	Isolates logic so that controllers remain simple and clean.
________________________________________
4.4.3 Main Application File
The main.py file:
•	Initializes the FastAPI application.
•	Loads & registers all routers from the module controllers.
•	Serves the React UI build from the /dist directory.
•	Sets up middleware, CORS, exception handlers, and authentication integration.
________________________________________
4.5 Frontend Architecture (React)
The frontend folder is structured using:
•	React (TypeScript)
•	Redux Toolkit
•	Azure AD SSO (MSAL)
•	Modular components and hooks
4.5.1 Folder Structure Overview
/components
/hooks
/pages
/reducer
/router
/store
Folder Purpose:
Components
•	Reusable React components (UI widgets, layout components, tables, charts, etc.)
Hooks
•	Custom hooks for reusable logic.
•	Also includes client-side utility functions:
o	CSV export
o	PDF export
o	Excel export
Pages
•	View components for complete screens:
o	Landing Page
o	Risk Predictor Page
o	Interaction Page
o	Other functional screens
Reducer
•	Contains Redux slices segmented by feature:
o	interaction
o	risk predictor
o	scope
o	session
o	search
Router
•	Contains:
o	Public routes (no authentication)
o	Private routes (SSO protected)
•	Manages navigation and role-based access control.
Store
•	Root store configuration for Redux Toolkit.
•	Combines all feature reducers.
4.6 Backend Integration Architecture
The QGPT backend (FastAPI) interacts with two major external systems:
1.	Microsoft SQL Server
2.	MLflow Model Serving Endpoint
Additionally, authentication and authorization are handled through Azure AD SSO (MSAL).
________________________________________
4.6.1 SQL Server Integration
The platform uses Microsoft SQL Server as the primary relational database.
FastAPI interacts with SQL Server through:
•	SQL Client ID / SPN-based authentication
•	Client Secret credentials
•	Secure database URL & ID stored in Azure App Settings
Database Connectivity Model
The backend establishes a secure connection using:
•	Client ID or Service Principal ID (both terms refer to the same identity)
•	Client Secret
•	Database connection URI
•	ADO / ODBC-based drivers
This approach ensures:
•	Encrypted connections
•	No direct password-based authentication
•	Enterprise-grade secure access
Stored Procedure (SP) Execution
Many backend modules rely on:
•	Stored Procedures (SPs) for data access
•	Pre-optimized SQL logic executed server-side
•	Reduced query complexity inside the backend
•	Better performance for analytical operations
FastAPI calls the repositories → repositories execute SPs → SPs return processed data → services transform data → controllers return structured API responses.
________________________________________
4.6.2 MLflow Integration
The QGPT system integrates with an MLflow model endpoint to support the Quality Risk Predictor (QRP) and other ML-driven features.
Role of the MLflow Endpoint
The MLflow service:
•	Receives API requests from FastAPI (input parameters, session metadata, etc.)
•	Performs ML inference using the deployed model
•	Returns prediction results, risk scores, and output metadata
•	FastAPI receives the response and sends the final processed output to the frontend
Flow of ML Prediction
1.	User interacts with UI → submits data
2.	FastAPI receives the request
3.	FastAPI sends a formatted JSON payload to the MLflow endpoint
4.	MLflow model returns prediction results
5.	FastAPI processes and serves results to UI
6.	UI displays model outputs to the user
This architecture supports scalable, decoupled ML deployment.
________________________________________
4.6.3 SSO Authentication (Azure AD MSAL)
The QGPT application uses Azure AD Single Sign-On (SSO) to authenticate users.
Frontend Authentication (MSAL)
•	Located in MSALConfig.ts
•	Defines:
o	Client ID
o	Tenant ID
o	Authority (login endpoint)
o	Redirect URIs
o	Cache & token configurations
Backend Token Validation
The backend validates tokens that the frontend sends via headers (e.g., Authorization: Bearer <token>).
Why MSAL?
•	Secure enterprise login
•	No password handling in the application
•	Token-based access control
•	Works seamlessly with Azure Web App environment identities
________________________________________

