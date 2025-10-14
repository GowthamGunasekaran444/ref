from fastapi import FastAPI, Request, HTTPException
import requests
import jwt
from jwt import PyJWKClient, InvalidTokenError

app = FastAPI()

# Azure AD Configuration
AZURE_TENANT_ID = "<your-tenant-id>"  # 👈 Replace with your tenant ID
EXPECTED_ISSUER = f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/v2.0"
EXPECTED_AUDIENCE = "https://graph.microsoft.com"

# OpenID configuration URL for your tenant
OPENID_CONFIG_URL = f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration"


def get_jwk_client():
    """Fetch the JWKs URI from Azure and build a PyJWKClient."""
    openid_config = requests.get(OPENID_CONFIG_URL).json()
    jwks_uri = openid_config["jwks_uri"]
    return PyJWKClient(jwks_uri)


def validate_azure_token(request: Request):
    """Validate the Azure AD token using PyJWT and requests."""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    token = auth_header.split(" ")[1]

    try:
        # Get JWK client and fetch signing key
        jwk_client = get_jwk_client()
        signing_key = jwk_client.get_signing_key_from_jwt(token)

        # Decode and validate claims
        decoded_token = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            audience=EXPECTED_AUDIENCE,
            issuer=EXPECTED_ISSUER,
        )

        return decoded_token

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidIssuerError:
        raise HTTPException(status_code=401, detail="Invalid token issuer")
    except jwt.InvalidAudienceError:
        raise HTTPException(status_code=401, detail="Invalid token audience")
    except InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


@app.middleware("http")
async def azure_auth_middleware(request: Request, call_next):
    """
    Middleware: Validate token only for /secure routes.
    """
    if request.url.path.startswith("/secure"):
        validate_azure_token(request)
    response = await call_next(request)
    return response


@app.get("/secure/data")
def secure_data(request: Request):
    """A protected route that requires a valid Azure AD token."""
    token_data = validate_azure_token(request)
    return {"message": "✅ Token is valid!", "claims": token_data}


@app.get("/public")
def public_data():
    """A public route that doesn't need authentication."""
    return {"message": "🌐 This route is open to everyone."}
