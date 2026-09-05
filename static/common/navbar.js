document.addEventListener("DOMContentLoaded", () => {
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
            <a href="/" class="brand-section">
                <img src="/static/images/parakh-logo.png" alt="PARAKH AI Logo" style="height: 50px; width: auto; object-fit: contain;">
                <div>
                    <h1>PARAKH AI</h1>
                    <p>GeM Bid Compliance Platform</p>
                </div>
            </a>
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
