
app = FastAPI()

# === Your configuration ===
TENANT_ID = "<your-tenant-id>"      # 👈 e.g., "72f988bf-xxxx-xxxx-xxxx-2d7cd011db47"
APP_ID = "<your-client-id>"         # 👈 your Azure app registration's Application (client) ID
EXPECTED_ISSUER = f"https://sts.windows.net/{TENANT_ID}/"  # or use v2 endpoint if required

# --- Token Validation Function ---
def validate_unverified_token(token: str):
    """
    Decode a JWT token without verifying signature,
    but enforce expiration, audience, and issuer validation.
    """
    try:
        # Step 1: Decode without verifying signature, but verify expiration
        decoded = jwt.decode(
            token,
            options={
                "verify_signature": False,
                "verify_exp": True,
            }
        )

        # Step 2: Validate audience (aud claim)
        aud = decoded.get("aud")
        if not aud or aud != APP_ID:
            raise HTTPException(status_code=401, detail="Invalid audience")

        # Step 3: Validate issuer (iss claim)
        iss = decoded.get("iss")
        if not iss or not iss.startswith(EXPECTED_ISSUER):
            raise HTTPException(status_code=401, detail="Invalid issuer")

        # ✅ All checks passed — valid token
        return {"authorized": True}

    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
