(function () {
  const app = document.getElementById("app");
  const page = document.body.dataset.page || "home";
  const api = window.PupStoreApi;
  const data = window.PupStoreMockData;
  const statusLabels = {
    unverified: "Unverified demo profile",
    pending: "Pending demo review",
    verified: "Verified demo profile",
    rejected: "Rejected demo profile"
  };
  const photo = (id, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
  const kes = (value) => `KES ${Number(value).toLocaleString("en-KE")}`;
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  function header() {
    const active = page === "dog" ? "dogs" : page;
    return `
      <div class="announcement"><span>Made for the love of dogs</span><span class="announcement-dot"></span><span>Connecting good people with good dogs, across Kenya</span></div>
      <header class="site-header">
        <a class="brand" href="index.html" aria-label="Pup Store Kenya home"><span class="brand-mark" aria-hidden="true">p</span><span class="brand-words">pup store<span>KENYA</span></span></a>
        <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false"><span></span><span></span></button>
        <nav class="main-nav" aria-label="Main navigation">
          <a class="${active === "dogs" ? "active" : ""}" href="dogs.html">Find a dog</a>
          <a class="${active === "products" ? "active" : ""}" href="products.html">Shop</a>
          <a class="${active === "vets" ? "active" : ""}" href="vets.html">Find a vet</a>
          <a class="${active === "dashboard" ? "active" : ""}" href="dashboard.html">Dashboard</a>
        </nav>
        <div class="header-actions"><a class="login-link" href="login.html">Log in</a><a class="button button-dark button-small" href="register.html">Join Pup Store <span aria-hidden="true">↗</span></a></div>
      </header>`;
  }

  function footer() {
    return `<footer class="site-footer"><div class="footer-main">
      <div class="footer-brand"><a class="brand brand-light" href="index.html"><span class="brand-mark" aria-hidden="true">p</span><span class="brand-words">pup store<span>KENYA</span></span></a><p>A more thoughtful way to find your new best friend.</p></div>
      <div class="footer-links"><div><strong>Explore</strong><a href="dogs.html">Find a dog</a><a href="products.html">Dog essentials</a><a href="vets.html">Find a vet</a></div><div><strong>Your account</strong><a href="register.html">Create an account</a><a href="login.html">Log in</a><a href="dashboard.html">Dashboard demo</a></div></div>
    </div><div class="footer-bottom"><span>© 2026 Pup Store Kenya</span><span>Thoughtfully made for Kenya <span class="footer-heart">♥</span></span></div></footer>`;
  }

  function statusBadge(status) {
    if (status === "verified") return `<span class="verification-badge"><span aria-hidden="true">✓</span> Verified <span class="demo-tag">DEMO</span></span>`;
    return `<span class="status-text status-${escapeHtml(status)}">${escapeHtml(statusLabels[status] || statusLabels.unverified)}</span>`;
  }

  function dogCard(dog) {
    const sourceBadge = dog.sellerType === "official"
      ? `<span class="official-badge"><span aria-hidden="true">✦</span> Official Pup Store</span>`
      : statusBadge(dog.status);
    const sellerLabel = dog.sellerType === "official" ? "" : `<span class="seller-origin">Independent seller</span>`;
    return `<article class="dog-card">
      <a class="dog-card-image" href="dog.html?id=${encodeURIComponent(dog.id)}" aria-label="View ${escapeHtml(dog.name)}, ${escapeHtml(dog.breed)}">
        <img src="${photo(dog.image, 760)}" alt="${escapeHtml(dog.breed)} puppy" loading="lazy">
        <span class="image-label">${escapeHtml(dog.gender)}</span><span class="image-arrow" aria-hidden="true">↗</span>
      </a>
      <div class="dog-card-content"><div class="dog-card-top"><div><p class="eyebrow">${escapeHtml(dog.name)} · ${escapeHtml(dog.age)}</p><h3>${escapeHtml(dog.breed)}</h3></div><strong class="dog-price">${kes(dog.price)}</strong></div>
      <p class="dog-location"><span aria-hidden="true">⌖</span> ${escapeHtml(dog.location)}</p>
      <div class="dog-card-bottom"><div class="seller-summary"><span class="seller-name">${escapeHtml(dog.seller)}</span>${sellerLabel}</div>${sourceBadge}</div></div>
    </article>`;
  }

  function productCard(product) {
    return `<article class="product-card"><div class="product-image"><img src="${photo(product.image, 720)}" alt="${escapeHtml(product.name)}" loading="lazy"><span class="product-category">${escapeHtml(product.category)}</span></div><div class="product-info"><div><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.description)}</p></div><strong>${kes(product.price)}</strong></div><button class="button button-outline product-action" type="button" data-demo-action="Product browsing">View product <span aria-hidden="true">↗</span></button></article>`;
  }

  function vetCard(vet) {
    return `<article class="vet-card"><img class="vet-photo" src="${photo(vet.image, 480)}" alt="Portrait of ${escapeHtml(vet.name)}" loading="lazy"><div class="vet-info"><div class="vet-title"><div><p class="eyebrow">${escapeHtml(vet.specialty)}</p><h3>${escapeHtml(vet.name)}</h3></div>${statusBadge(vet.status)}</div><p class="vet-clinic">${escapeHtml(vet.clinic)}</p><p class="dog-location"><span aria-hidden="true">⌖</span> ${escapeHtml(vet.location)}</p><a class="text-link" href="tel:${escapeHtml(vet.phone.replace(/\s/g, ""))}">Contact professional <span aria-hidden="true">↗</span></a></div></article>`;
  }

  function homePage() {
    const featured = data.dogs.filter((dog) => dog.featured).slice(0, 4);
    return `<main>
      <section class="hero"><div class="hero-copy"><span class="eyebrow hero-eyebrow"><span class="eyebrow-line"></span> A happier way to find your dog</span><h1>Somewhere,<br>your best friend<br>is <em>waiting.</em></h1><p>Meet wonderful dogs from independent Kenyan breeders and the Pup Store family. Find the one that feels like home.</p>
        <div class="hero-actions"><a class="button button-light" href="dogs.html">Find your dog <span aria-hidden="true">↗</span></a><a class="play-link" href="vets.html"><span class="play-icon" aria-hidden="true">↗</span> Meet our community</a></div>
        <div class="hero-note"><span class="avatar-stack"><img src="${photo("photo-1534528741775-53994a69daeb", 80)}" alt=""><img src="${photo("photo-1500648767791-00dcc994a43e", 80)}" alt=""><img src="${photo("photo-1544005313-94ddf0286df2", 80)}" alt=""></span><span><strong>Good dogs, good people.</strong><br>Finding each other, right here in Kenya.</span></div>
      </div><div class="hero-visual"><img class="hero-image" src="${photo("photo-1552053831-71594a27632d", 1200)}" alt="Golden dog enjoying a sunny afternoon"><div class="hero-photo-caption"><span class="caption-sparkle">✳</span><span><strong>Room for one more?</strong><small>Your new chapter starts here.</small></span><a href="dogs.html" aria-label="Browse dogs">↗</a></div><div class="hero-index">01 <span></span> 04</div></div><div class="hero-ornament" aria-hidden="true">✳</div></section>
      <section class="trust-strip"><span>More than a marketplace</span><span><b>01</b> People-first connections</span><span><b>02</b> Independent & official listings</span><span><b>03</b> Kenya, from nose to tail</span></section>
      <section class="section section-featured"><div class="section-heading"><div><p class="eyebrow"><span class="eyebrow-line"></span> Meet a few good dogs</p><h2>New faces, <em>big love.</em></h2></div><a class="text-link" href="dogs.html">Explore all dogs <span aria-hidden="true">↗</span></a></div><div class="dog-grid">${featured.map(dogCard).join("")}</div></section>
      <section class="home-split"><div class="split-image"><img src="${photo("photo-1548199973-03cce0bbc87b", 1000)}" alt="Two happy dogs spending time together" loading="lazy"><span class="photo-stamp">GOOD<br>DOGS<br>ONLY</span></div><div class="split-copy"><p class="eyebrow"><span class="eyebrow-line"></span> More than a listing</p><h2>It's not just finding a dog.<br>It's finding <em>your dog.</em></h2><p>Every good match begins with a little curiosity. Browse at your own pace, discover the people behind each listing, and explore our growing community of dog lovers.</p><a class="button button-dark" href="dogs.html">Start exploring <span aria-hidden="true">↗</span></a><div class="split-caption"><span>For the first walks.</span><span>For all the ones after. <b>♥</b></span></div></div></section>
      <section class="community-section"><div class="section-heading"><div><p class="eyebrow"><span class="eyebrow-line"></span> Here for every part of the journey</p><h2>Good care comes<br>in many <em>forms.</em></h2></div><p>Find thoughtful essentials for home and discover veterinary professionals who care about your dog's wellbeing.</p></div><div class="community-cards"><a class="community-card community-products" href="products.html"><div><span class="community-number">01 / ESSENTIALS</span><h3>The little things<br>they'll love.</h3><span class="round-arrow">↗</span></div><img src="${photo("photo-1589924691995-400dc9ecc119", 760)}" alt="Dog supplies" loading="lazy"></a><a class="community-card community-vets" href="vets.html"><div><span class="community-number">02 / GOOD CARE</span><h3>A helping hand<br>when you need it.</h3><span class="round-arrow">↗</span></div><img src="${photo("photo-1559839734-2b71ea197ec2", 760)}" alt="Veterinary professional" loading="lazy"></a></div></section>
      <section class="cta-band"><span class="cta-star" aria-hidden="true">✳</span><p class="eyebrow">Good things start with hello</p><h2>Come on in.<br><em>There's room for you.</em></h2><a class="button button-light" href="register.html">Join the community <span aria-hidden="true">↗</span></a></section>
    </main>`;
  }

  function dogsPage() {
    return `<main class="page-main"><section class="page-intro"><div><p class="eyebrow"><span class="eyebrow-line"></span> Meet your new best friend</p><h1>Good dogs.<br><em>Great beginnings.</em></h1><p>Browse dogs from across Kenya, listed by independent sellers and Pup Store Kenya.</p></div><div class="intro-aside"><span class="intro-aside-icon">✳</span><span>Every listing is demo content.<br>Prices shown in Kenyan Shillings.</span></div></section>
      <section class="catalogue-section"><div class="filter-panel"><div class="filter-heading"><span>Find your match</span><button type="button" class="reset-filters">Reset</button></div><label class="filter-label" for="breed-filter">Breed</label><select id="breed-filter"><option value="">All breeds</option>${data.breeds.map((breed) => `<option value="${escapeHtml(breed)}">${escapeHtml(breed)}</option>`).join("")}</select><label class="filter-label" for="location-filter">Location</label><select id="location-filter"><option value="">All of Kenya</option><option>Nairobi</option><option>Mombasa</option><option>Kisumu</option><option>Nakuru</option><option>Kiambu</option><option>Thika</option></select><label class="filter-label" for="gender-filter">Gender</label><select id="gender-filter"><option value="">Any</option><option>Male</option><option>Female</option></select><label class="filter-label" for="seller-filter">Listing type</label><select id="seller-filter"><option value="">All listings</option><option value="official">Official Pup Store</option><option value="independent">Independent seller</option></select><label class="filter-label" for="sort-filter">Sort by</label><select id="sort-filter"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select><div class="filter-legend"><span>Seller labels</span><p><i class="legend-official"></i> Official Pup Store</p><p><i class="legend-verified">✓</i> Verified demo profile</p><small>Badges represent sample data only.</small></div></div><div class="catalogue-results"><div class="catalogue-toolbar"><div><h2>Find your favourite</h2><p id="results-count" aria-live="polite"></p></div><button class="mobile-filter-button" type="button">Filters <span aria-hidden="true">⌄</span></button></div><div class="dog-grid catalogue-grid" id="dog-results"></div><p class="empty-state" id="empty-results" hidden>No dogs match those filters yet. Try widening your search.</p></div></section></main>`;
  }

  function dogDetailsPage(dog) {
    if (!dog) return `<main class="page-main"><section class="not-found"><p class="eyebrow">A little detour</p><h1>We couldn't find<br><em>that listing.</em></h1><a class="button button-dark" href="dogs.html">Back to all dogs <span aria-hidden="true">↗</span></a></section></main>`;
    const badge = dog.sellerType === "official" ? `<span class="official-badge"><span aria-hidden="true">✦</span> Official Pup Store listing</span>` : statusBadge(dog.status);
    return `<main class="page-main detail-page"><a class="back-link" href="dogs.html">← Back to all dogs</a><section class="detail-layout"><div class="detail-photo"><img src="${photo(dog.image, 1300)}" alt="${escapeHtml(dog.breed)} puppy named ${escapeHtml(dog.name)}"><span class="image-label">${escapeHtml(dog.gender)}</span></div><div class="detail-copy"><p class="eyebrow">${escapeHtml(dog.age)} · ${escapeHtml(dog.location)}</p><h1>Meet <em>${escapeHtml(dog.name)}.</em></h1><h2>${escapeHtml(dog.breed)}</h2><p class="detail-price">${kes(dog.price)}</p><p class="detail-description">${escapeHtml(dog.description)}</p><div class="detail-divider"></div><p class="eyebrow">Listed by</p><div class="seller-profile"><span class="seller-avatar">${escapeHtml(dog.seller.charAt(0))}</span><div><strong>${escapeHtml(dog.seller)}</strong><small>${dog.sellerType === "official" ? "Pup Store Kenya" : "Independent seller"}</small></div></div><div class="detail-badges">${badge}</div><button type="button" class="button button-dark button-wide" data-demo-action="Seller contact">Contact seller <span aria-hidden="true">↗</span></button><p class="demo-disclaimer">Demo listing. Contact actions are not connected to a seller or backend.</p></div></section></main>`;
  }

  function productsPage() {
    return `<main class="page-main"><section class="page-intro compact-intro"><div><p class="eyebrow"><span class="eyebrow-line"></span> The everyday good stuff</p><h1>A little something<br><em>for their world.</em></h1><p>Thoughtful essentials for the walks, naps, playtimes, and everything in between.</p></div><div class="intro-aside"><span class="intro-aside-icon">✳</span><span>Demo catalogue.<br>Prices shown in Kenyan Shillings.</span></div></section><section class="products-section"><div class="section-heading products-heading"><div><p class="eyebrow">A few favourites</p><h2>Good things for <em>good dogs.</em></h2></div><span class="demo-notice">Sample products · No checkout</span></div><div class="product-grid">${data.products.map(productCard).join("")}</div></section></main>`;
  }

  function vetsPage() {
    return `<main class="page-main"><section class="page-intro compact-intro"><div><p class="eyebrow"><span class="eyebrow-line"></span> Here when you need a helping hand</p><h1>Good care for<br><em>good companions.</em></h1><p>Meet veterinary professionals and clinics in our growing Kenyan community.</p></div><div class="intro-aside"><span class="intro-aside-icon">✳</span><span>Professional profiles are demo data.<br>Verification status is clearly labelled.</span></div></section><section class="vet-section"><div class="section-heading"><div><p class="eyebrow">Meet the professionals</p><h2>Care starts with <em>hello.</em></h2></div><a href="register.html?role=vet" class="button button-outline">I'm a vet <span aria-hidden="true">↗</span></a></div><div class="vet-grid">${data.vets.map(vetCard).join("")}</div><p class="demo-disclaimer vet-disclaimer">Contact details are illustrative demo data. This page does not book appointments or provide veterinary advice.</p></section></main>`;
  }

  function authPage(isRegister) {
    const registerContent = `<label class="field-label" for="account-type">I am joining as</label><select id="account-type" name="role"><option value="buyer">Dog buyer</option><option value="seller">Dog seller / breeder</option><option value="vendor">Dog accessories vendor</option><option value="vet">Veterinary professional</option></select>
      <div class="role-fields" data-role-fields="buyer"><label class="field-label" for="buyer-interest">What brings you here?</label><select id="buyer-interest" name="buyerInterest"><option>Looking for a dog</option><option>Exploring the community</option></select></div>
      <div class="role-fields" data-role-fields="seller" hidden><label class="field-label" for="business-name">Business or kennel name</label><input id="business-name" name="businessName" placeholder="Your business name"><label class="field-label" for="seller-location">Your location</label><input id="seller-location" name="location" placeholder="e.g. Karen, Nairobi"></div>
      <div class="role-fields" data-role-fields="vendor" hidden><label class="field-label" for="store-name">Store or brand name</label><input id="store-name" name="storeName" placeholder="Your accessories brand"><label class="field-label" for="vendor-category">Main product category</label><select id="vendor-category" name="vendorCategory"><option>Dog food and nutrition</option><option>Collars, leads and harnesses</option><option>Beds and carriers</option><option>Toys and enrichment</option><option>Grooming and healthcare</option><option>Clothing and accessories</option></select><label class="field-label" for="vendor-location">Business location</label><input id="vendor-location" name="location" placeholder="e.g. Nairobi, Kenya"></div>
      <div class="role-fields" data-role-fields="vet" hidden><label class="field-label" for="clinic-name">Clinic or practice name</label><input id="clinic-name" name="clinicName" placeholder="Your practice name"><label class="field-label" for="vet-location">Practice location</label><input id="vet-location" name="location" placeholder="e.g. Nyali, Mombasa"><label class="field-label" for="vet-registration">Professional registration number</label><input id="vet-registration" name="registrationNumber" placeholder="For demo only"></div>`;
    return `<main class="auth-page"><section class="auth-visual"><img src="${photo(isRegister ? "photo-1548199973-03cce0bbc87b" : "photo-1552053831-71594a27632d", 1100)}" alt="A happy dog ready to meet you"><a class="brand brand-light auth-brand" href="index.html"><span class="brand-mark" aria-hidden="true">p</span><span class="brand-words">pup store<span>KENYA</span></span></a><div class="auth-visual-copy"><p class="eyebrow">A little more love in the world</p><h2>${isRegister ? "Good things begin<br>with a <em>hello.</em>" : "Your next chapter<br>has four <em>paws.</em>"}</h2><p>${isRegister ? "Join a community made for the love of dogs." : "Welcome back to a community made for the love of dogs."}</p></div><span class="auth-visual-note">For the love of dogs, everywhere.</span></section><section class="auth-form-panel"><div class="auth-form-wrap"><p class="eyebrow">${isRegister ? "Find your people" : "Nice to have you back"}</p><h1>${isRegister ? "Create your account" : "Welcome back"}</h1><p class="auth-subtitle">${isRegister ? "A few details and you're part of the pack." : "Log in to continue to your Pup Store demo."}</p><div class="mock-notice"><span aria-hidden="true">✳</span> Demo only — no real account is created or authenticated.</div><form class="account-form" id="${isRegister ? "register-form" : "login-form"}">
      ${isRegister ? '<label class="field-label" for="full-name">Your name</label><input id="full-name" name="name" autocomplete="name" placeholder="How should we call you?" required>' : ""}
      <label class="field-label" for="email">Email address</label><input id="email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required>
      ${isRegister ? "" : '<label class="field-label" for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" placeholder="Your password" required>'}
      ${isRegister ? registerContent : ""}
      ${isRegister ? '<label class="checkbox-label"><input type="checkbox" required><span>I agree to be contacted about this demo registration.</span></label>' : ""}
      <button class="button button-dark button-wide" type="submit">${isRegister ? "Create demo account" : "Log in to demo"} <span aria-hidden="true">↗</span></button><p class="form-feedback" id="form-feedback" role="status" aria-live="polite"></p></form><p class="auth-switch">${isRegister ? "Already part of the pack?" : "New to Pup Store?"} <a href="${isRegister ? "login.html" : "register.html"}">${isRegister ? "Log in" : "Create an account"}</a></p><a class="auth-back" href="index.html">← Back to Pup Store</a></div></section></main>`;
  }

  function dashboardPage() {
    return `<main class="page-main dashboard-page"><section class="page-intro compact-intro"><div><p class="eyebrow"><span class="eyebrow-line"></span> Your Pup Store</p><h1>A little space<br><em>of your own.</em></h1><p>This is a sample dashboard preview. Choose an account type to explore its starter view.</p></div><div class="intro-aside"><span class="intro-aside-icon">✳</span><span>Demo dashboard.<br>No account data is stored.</span></div></section><section class="dashboard-wrap"><aside class="dashboard-sidebar"><p class="eyebrow">Demo profile</p><label class="field-label" for="dashboard-role">Account type</label><select id="dashboard-role"><option value="buyer">Dog buyer</option><option value="seller">Dog seller / breeder</option><option value="vendor">Dog accessories vendor</option><option value="vet">Veterinary professional</option></select><div class="sidebar-profile"><span class="seller-avatar">P</span><div><strong>Pat Demo</strong><small>Sample account</small></div></div><div class="demo-notice-small">Mock account · Not a real user</div></aside><div class="dashboard-content" id="dashboard-content"></div></section></main>`;
  }

  const pageRenderers = {
    home: homePage,
    dogs: dogsPage,
    dog: () => dogDetailsPage(null),
    products: productsPage,
    vets: vetsPage,
    login: () => authPage(false),
    register: () => authPage(true),
    dashboard: dashboardPage
  };

  app.innerHTML = `${header()}${(pageRenderers[page] || homePage)()}${footer()}<div class="toast" id="toast" role="status" aria-live="polite"></div>`;
  document.title = {
    home: "Pup Store Kenya — Good dogs, good homes",
    dogs: "Browse Dogs — Pup Store Kenya",
    dog: "Dog Details — Pup Store Kenya",
    products: "Dog Products — Pup Store Kenya",
    vets: "Find a Vet — Pup Store Kenya",
    login: "Log in — Pup Store Kenya",
    register: "Create an account — Pup Store Kenya",
    dashboard: "My dashboard — Pup Store Kenya"
  }[page] || "Pup Store Kenya";

  const menuToggle = document.querySelector(".menu-toggle");
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    document.querySelector(".main-nav").classList.toggle("is-open", !isOpen);
    document.querySelector(".header-actions").classList.toggle("is-open", !isOpen);
  });

  if (page === "dogs") {
    const results = document.getElementById("dog-results");
    const selects = ["breed-filter", "location-filter", "gender-filter", "seller-filter", "sort-filter"].map((id) => document.getElementById(id));
    function renderDogs() {
      const [breed, location, gender, seller, sort] = selects.map((select) => select.value);
      let dogs = data.dogs.filter((dog) => (!breed || dog.breed === breed)
        && (!location || dog.location.toLowerCase().includes(location.toLowerCase()))
        && (!gender || dog.gender === gender)
        && (!seller || dog.sellerType === seller));
      if (sort === "price-low") dogs = dogs.slice().sort((a, b) => a.price - b.price);
      if (sort === "price-high") dogs = dogs.slice().sort((a, b) => b.price - a.price);
      results.innerHTML = dogs.map(dogCard).join("");
      document.getElementById("results-count").textContent = `${dogs.length} demo ${dogs.length === 1 ? "listing" : "listings"}`;
      document.getElementById("empty-results").hidden = dogs.length > 0;
    }
    selects.forEach((select) => select.addEventListener("change", renderDogs));
    document.querySelector(".reset-filters").addEventListener("click", () => {
      selects.forEach((select) => { select.value = ""; });
      selects[4].value = "featured";
      renderDogs();
    });
    document.querySelector(".mobile-filter-button").addEventListener("click", () => document.querySelector(".filter-panel").classList.toggle("filter-open"));
    renderDogs();
  }

  if (page === "dog") {
    const id = new URLSearchParams(window.location.search).get("id");
    api.getDog(id).then((dog) => {
      if (!dog) return;
      const details = document.createElement("div");
      details.innerHTML = dogDetailsPage(dog);
      const main = document.querySelector("main");
      main.replaceWith(details.firstElementChild);
      document.title = `${dog.name} · ${dog.breed} — Pup Store Kenya`;
    });
  }

  if (page === "register") {
    const roleSelect = document.getElementById("account-type");
    const requestedRole = new URLSearchParams(window.location.search).get("role");
    if (["buyer", "seller", "vendor", "vet"].includes(requestedRole)) roleSelect.value = requestedRole;
    function updateRoleFields() {
      document.querySelectorAll(".role-fields").forEach((group) => { group.hidden = group.dataset.roleFields !== roleSelect.value; });
    }
    roleSelect.addEventListener("change", updateRoleFields);
    updateRoleFields();
  }

  if (page === "login" || page === "register") {
    document.querySelector(".account-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const role = page === "register" ? document.getElementById("account-type").value : "buyer";
      document.getElementById("form-feedback").textContent = page === "register"
        ? `Demo submitted as a ${role === "vet" ? "veterinary professional" : role === "vendor" ? "dog accessories vendor" : role === "seller" ? "dog seller / breeder" : "dog buyer"}. No account has been created.`
        : "Demo only — authentication isn't connected, so no account has been accessed.";
    });
  }

  if (page === "dashboard") {
    const rolePicker = document.getElementById("dashboard-role");
    const requestedRole = new URLSearchParams(window.location.search).get("role");
    if (["buyer", "seller", "vendor", "vet"].includes(requestedRole)) rolePicker.value = requestedRole;
    const dashboardContent = document.getElementById("dashboard-content");
    function renderDashboard() {
      const role = rolePicker.value;
      const content = {
        buyer: `<div class="dashboard-welcome"><p class="eyebrow">Your dog-loving life</p><h2>Welcome, <em>Pat.</em></h2><p>Your demo dashboard is ready for its first adventure.</p></div><div class="dashboard-stats"><article><span>Saved dogs</span><strong>0</strong><small>Sample data</small></article><article><span>Recent views</span><strong>2</strong><small>Sample data</small></article><article><span>Account status</span><strong class="status-text status-unverified">Unverified</strong><small>Demo profile</small></article></div><div class="dashboard-panel"><div><h3>Start with a good dog</h3><p>Browse the demo listings and discover some lovely faces.</p></div><a class="button button-dark" href="dogs.html">Browse dogs <span aria-hidden="true">↗</span></a></div>`,
        seller: `<div class="dashboard-welcome"><p class="eyebrow">Your seller space</p><h2>Welcome, <em>Pat.</em></h2><p>A simple starting point for your demo seller profile.</p></div><div class="verification-panel"><div><p class="eyebrow">Seller verification</p><h3>Unverified <span class="status-text status-unverified">Demo profile</span></h3><p>This sample status doesn't represent a real application or verification result.</p></div><a class="button button-outline" href="register.html?role=seller">Edit demo profile <span aria-hidden="true">↗</span></a></div><div class="dashboard-stats"><article><span>Active listings</span><strong>0</strong><small>Sample data</small></article><article><span>Profile views</span><strong>0</strong><small>Sample data</small></article><article><span>Messages</span><strong>0</strong><small>Not connected</small></article></div><div class="dashboard-panel"><div><h3>Share your first listing</h3><p>Listing management will be available when connected to a backend.</p></div><button class="button button-dark" type="button" data-demo-action="Seller listing management">Coming later</button></div>`,
        vendor: `<div class="dashboard-welcome"><p class="eyebrow">Your vendor space</p><h2>Welcome, <em>Pat.</em></h2><p>Prepare a dog accessories listing and preview its demo commission.</p></div><div class="verification-panel"><div><p class="eyebrow">Vendor verification</p><h3>Pending <span class="status-text status-pending">Demo profile</span></h3><p>This sample status is not a real vendor application or verification result.</p></div><a class="button button-outline" href="register.html?role=vendor">Edit demo profile <span aria-hidden="true">↗</span></a></div><div class="dashboard-stats"><article><span>Active products</span><strong>0</strong><small>Sample data</small></article><article><span>Post credits</span><strong>0</strong><small>No payment made</small></article><article><span>Store views</span><strong>0</strong><small>Sample data</small></article></div><div class="vendor-listing-panel"><div class="vendor-listing-form"><p class="eyebrow">Create a demo product post</p><h3>Upload your accessory</h3><label class="field-label" for="product-name">Product name</label><input id="product-name" type="text" placeholder="e.g. Adjustable walking harness"><label class="field-label" for="product-category">Category</label><select id="product-category"><option>Collars, leads and harnesses</option><option>Dog food and nutrition</option><option>Beds and carriers</option><option>Toys and enrichment</option><option>Grooming and healthcare</option><option>Clothing and accessories</option></select><label class="field-label" for="product-valuation">Product valuation (KES)</label><input id="product-valuation" type="number" min="0" step="100" value="5000" placeholder="Enter the product price"></div><div class="commission-card"><p class="eyebrow">Commission preview</p><div class="commission-result"><span>Demo commission</span><strong id="commission-amount">KES 250</strong></div><div class="commission-details"><span>Valuation</span><strong id="commission-valuation">KES 5,000</strong></div><div class="commission-details"><span>Rate</span><strong id="commission-rate">5%</strong></div><p>Based on a sample valuation tier. No charge is made in this frontend demo.</p></div></div><button class="button button-dark vendor-post-button" type="button" data-demo-action="Product listing upload">Upload demo post <span aria-hidden="true">↗</span></button>`,
        vet: `<div class="dashboard-welcome"><p class="eyebrow">Your professional space</p><h2>Welcome, <em>Pat.</em></h2><p>A simple starting point for your demo veterinary profile.</p></div><div class="verification-panel"><div><p class="eyebrow">Professional verification</p><h3>Pending <span class="status-text status-pending">Demo profile</span></h3><p>This sample status doesn't represent a real application or verification result.</p></div><a class="button button-outline" href="register.html?role=vet">Edit demo profile <span aria-hidden="true">↗</span></a></div><div class="dashboard-stats"><article><span>Profile visits</span><strong>0</strong><small>Sample data</small></article><article><span>Services</span><strong>0</strong><small>Sample data</small></article><article><span>Bookings</span><strong>0</strong><small>Not connected</small></article></div><div class="dashboard-panel"><div><h3>Help dog owners find you</h3><p>Professional listings and booking tools are prepared for a future phase.</p></div><a class="button button-dark" href="vets.html">View vet directory <span aria-hidden="true">↗</span></a></div>`
      };
      dashboardContent.innerHTML = content[role];
      if (role === "vendor") {
        const valuationInput = document.getElementById("product-valuation");
        const valuationOutput = document.getElementById("commission-valuation");
        const commissionOutput = document.getElementById("commission-amount");
        const rateOutput = document.getElementById("commission-rate");
        const updateCommission = () => {
          const valuation = Math.max(0, Number(valuationInput.value) || 0);
          const rate = valuation <= 10000 ? 0.05 : valuation <= 50000 ? 0.07 : 0.10;
          valuationOutput.textContent = `KES ${valuation.toLocaleString("en-KE")}`;
          commissionOutput.textContent = `KES ${Math.round(valuation * rate).toLocaleString("en-KE")}`;
          rateOutput.textContent = `${Math.round(rate * 10000) / 100}%`;
        };
        valuationInput.addEventListener("input", updateCommission);
        updateCommission();
      }
    }
    rolePicker.addEventListener("change", renderDashboard);
    renderDashboard();
  }

  let toastTimer;
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-demo-action]");
    if (!button) return;
    const toast = document.getElementById("toast");
    toast.textContent = `${button.dataset.demoAction} is a demo interaction and isn't connected yet.`;
    toast.classList.add("toast-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("toast-visible"), 3200);
  });
})();
