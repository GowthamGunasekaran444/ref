QGPT Application Architecture & Deployment Overview
4.1 Azure Web App Services Deployment Model
The QGPT Web Application is hosted entirely on Azure Web App Services, where both the frontend (React UI) and backend (FastAPI) run within a single Web App instance per environment.

Combined UI + Backend Build Strategy:
1. React is built and output is generated in frontend/dist/
2. The UI build is moved into backend/dist/
3. A combined deployment package is created
4. The package is deployed to Azure Web App Services

Environments Include:
- Development (DEV)
- User Acceptance Testing (UAT)
- Production (PROD)
4.2 Repository Branching Strategy
Three active branches:
- develop
- uat
- main

Code Promotion Workflow:
- Create PR from develop → uat
- Trigger pipeline QualityGPT-WebApp-CI
- Release artifact to matching environment

Important:
Do NOT deploy builds from one branch into another environment (SSL & config mismatch).
4.3 Application Walkthrough
Repository has two major folders:
- backend
- frontend
4.4 Backend Architecture (FastAPI)
The backend contains modules:
- feedback
- interaction
- risk_predictor
- session
- user
- db (with model definitions)

Module Structure (per module):
- Controller: exposes API endpoints
- Repository: DB operations and SP calls
- Schema: request/response models
- Service: business logic

main.py:
- Initializes FastAPI
- Registers routers
- Serves UI build from /dist
4.5 Frontend Architecture (React)
Frontend uses React + Redux Toolkit + MSAL (Azure AD SSO).

Folder Structure:
- components
- hooks
- pages
- reducer
- router
- store
4.6 Backend Integration Architecture
The backend interacts with:
1. SQL Server
2. MLflow Model Endpoint

SQL Server:
- Uses Client ID / SPN authentication
- Secure Client Secret
- Stored Procedures for optimized DB access

MLflow:
- FastAPI sends inference requests
- MLflow returns predictions
- Results displayed on UI

SSO:
- MSALConfig.ts contains configuration
- Azure AD handles authentication
