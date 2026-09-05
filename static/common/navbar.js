document.addEventListener("DOMContentLoaded", () => {
    const isHome = window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname === '';
    const backButtonHTML = !isHome ? `
        <button type="button" onclick="if(window.history.length > 1){ window.history.back(); } else { window.location.href='/'; }" class="btn-back-nav" style="display:inline-flex; align-items:center; gap:6px; background:#F1F5F9; border:1px solid #CBD5E1; color:#07264A; padding:6px 12px; border-radius:4px; font-size:12px; font-weight:700; cursor:pointer; text-decoration:none; margin-right:8px; transition: background 0.15s ease;" title="Return to previous page">
            <span>&larr;</span> <span>Back</span>
        </button>
    ` : '';

    const navbarHTML = `
        <div class="gov-top-strip">
            <div>
                <a href="#">भारत सरकार | GOVERNMENT OF INDIA</a>
            </div>
            <div>
                <a href="#">Skip to Main Content</a>
                <a href="#">A-</a>
                <a href="#">A</a>
                <a href="#">A+</a>
                <a href="#">हिन्दी / English</a>
            </div>
        </div>
        <header class="institutional-header">
            <div style="display:flex; align-items:center; gap:12px;">
                ${backButtonHTML}
                <a href="/" class="brand-section" style="text-decoration:none;">
                    <img src="/static/images/parakh-logo.png" alt="PARAKH AI Logo" style="height: 50px; width: auto; object-fit: contain;">
                    <div>
                        <h1>PARAKH AI</h1>
                        <p>GeM Bid Compliance Platform</p>
                    </div>
                </a>
            </div>
            <nav class="navbar-nav">
                <a href="/" class="nav-link">Home</a>
                <a href="/about" class="nav-link">About</a>
                <a href="/services" class="nav-link">Services</a>
                <a href="/programs" class="nav-link">Programs</a>
                <a href="/resources" class="nav-link">Resources</a>
                <a href="/contact" class="nav-link">Contact</a>
                <a href="/bidder" class="btn-portal" style="background-color: #009291; margin-right: 6px; text-decoration:none;">Bidder Portal</a>
                <a href="/portal" class="btn-portal" style="background-color: #07264A; text-decoration:none;">Officer Portal</a>
            </nav>
        </header>
    `;

    const navContainer = document.getElementById("navbar-container");
    if (navContainer) {
        navContainer.innerHTML = navbarHTML;
    }
});
