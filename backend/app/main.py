import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
from app.api.routes import router as api_router
from app.database import Base, engine

BASE_DIR = Path(__file__).resolve().parent.parent.parent
STATIC_DIR = BASE_DIR / "static"

app = FastAPI(
    title="PARAKH AI - GeM Bid Compliance Platform",
    description="AI-Assisted Integrated Bid Compliance Verification Platform for GeM Procurement (SIH26100, Team: Butter Chicken)",
    version="2.0.0"
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response

# Enable CORS for local dev / API calls securely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://127.0.0.1:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix="/api")

# Mount Static Files if static dir exists
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# Helper to serve static html files
def serve_html(relative_path: str):
    file_path = STATIC_DIR / relative_path
    if file_path.exists():
        return FileResponse(str(file_path))
    return {"error": "Page not found"}

@app.get("/")
async def root():
    return serve_html("public/index.html")

# Portal Routes
@app.get("/portal")
async def portal_root():
    return serve_html("portal/login.html")

@app.get("/portal/{page}")
async def portal_pages(page: str):
    allowed_pages = ["login", "register", "dashboard", "profile", "applications", "services", "documents", "notifications", "settings"]
    if page == "bidder":
        return serve_html("bidder/index.html")
    if page in allowed_pages:
        return serve_html(f"portal/{page}.html")
    return serve_html("portal/login.html")

# Bidder Portal Routes
@app.get("/bidder")
async def bidder_root():
    return serve_html("bidder/index.html")

@app.get("/bidder/{page}")
async def bidder_pages(page: str):
    allowed_bidder_pages = ["index", "login", "submit", "status"]
    if page in allowed_bidder_pages:
        return serve_html(f"bidder/{page}.html")
    return serve_html("bidder/index.html")

# Public Routes
@app.get("/public/index.html")
async def public_index_redirect():
    return RedirectResponse(url="/")

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "PARAKH AI Procurement Core",
        "version": "2.0.0",
        "sih_problem_statement": "SIH26100",
        "team": "BUTTER CHICKEN"
    }

@app.get("/{page}")
async def public_pages(page: str):
    allowed_pages = ["about", "services", "programs", "resources", "updates", "faq", "contact", "bidder"]
    if page in allowed_pages:
        return serve_html(f"public/{page}.html")
    # Fallback to index if it's not a known route (basic protection)
    return serve_html("public/index.html")
