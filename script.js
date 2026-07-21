// ============================================
// script.js - ElectroHub
// Premium Dark Theme
// ============================================

// ----- PRODUCT DATA -----
const products = [
    { id: 1, name: 'Galaxy S24 Ultra', price: 99999, desc: '200MP camera, 12GB RAM, 256GB', img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=250&h=200&fit=crop&auto=format' },
    { id: 2, name: 'MacBook Pro 14"', price: 159900, desc: 'M3 chip, 16GB, 512GB SSD', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=250&h=200&fit=crop&auto=format' },
    { id: 3, name: 'Sony WH-1000XM5', price: 29990, desc: 'Noise cancelling, 30h battery', img: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=250&h=200&fit=crop&auto=format' },
    { id: 4, name: 'Apple Watch Ultra 2', price: 89900, desc: '49mm, GPS + Cellular, rugged', img: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=250&h=200&fit=crop&auto=format' },
    { id: 5, name: 'PlayStation 5', price: 49999, desc: 'Ultra HD, 825GB SSD, DualSense', img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=250&h=200&fit=crop&auto=format' },
    { id: 6, name: 'iPad Air M2', price: 59900, desc: '10.9", 64GB, Wi-Fi + 5G', img: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=250&h=200&fit=crop&auto=format' },
    { id: 7, name: 'Dell 32" 4K Monitor', price: 74999, desc: 'UHD, IPS, 60Hz, USB-C', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=250&h=200&fit=crop&auto=format' },
    { id: 8, name: 'Mechanical Keyboard', price: 12999, desc: 'RGB, hot-swappable, wireless', img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=250&h=200&fit=crop&auto=format' },
    { id: 9, name: 'Canon EOS R6', price: 149999, desc: '20MP, 4K video, RF mount', img: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=250&h=200&fit=crop&auto=format' },
    { id: 10, name: 'DJI Mini 4 Pro', price: 79990, desc: '4K HDR, 48MP, 34min flight', img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=250&h=200&fit=crop&auto=format' },
    { id: 11, name: 'Wi-Fi 6 Router', price: 18999, desc: 'AX6000, 8 antennas, Mesh', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f0b5?w=250&h=200&fit=crop&auto=format' },
    { id: 12, name: 'Nike Air Max', price: 14999, desc: 'Running shoes, cushioned sole', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=250&h=200&fit=crop&auto=format' }
];

// ----- CART STATE -----
let cart = JSON.parse(localStorage.getItem('electrohub_cart')) || [];

// ----- RENDER PRODUCTS -----
function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    grid.innerHTML = products.map(p => `
        <div class="product-card" data-id="${p.id}">
            <img src="${p.img}" alt="${p.name}" loading="lazy" />
            <h3>${p.name}</h3>
            <p class="description">${p.desc}</p>
            <div class="price">₹${p.price.toLocaleString('en-IN')}</div>
            <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>
        </div>
    `).join('');

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const id = parseInt(this.dataset.id);
            addToCart(id);
        });
    });
}

// ----- ADD TO CART -----
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    showFeedback('Added to cart!', 'success');
}

// ----- REMOVE FROM CART -----
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    renderCart();
}

// ----- UPDATE CART UI -----
function updateCart() {
    localStorage.setItem('electrohub_cart', JSON.stringify(cart));
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = count;
}

// ----- RENDER CART (in overlay) -----
function renderCart() {
    const container = document.getElementById('cartItems');
    const totalContainer = document.getElementById('cartTotal');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `<div class="empty-cart">🛒 Your cart is empty. Start shopping!</div>`;
        if (totalContainer) totalContainer.innerHTML = '';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-info">
                <img src="${item.img}" alt="${item.name}" />
                <div>
                    <div class="cart-item-name">${item.name}</div>
                    <div style="color: var(--text-light); font-size: 0.9rem;">Qty: ${item.quantity}</div>
                </div>
            </div>
            <div>
                <span class="cart-item-price">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                <button class="cart-item-remove" data-id="${item.id}">✕</button>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            removeFromCart(id);
        });
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (totalContainer) {
        totalContainer.innerHTML = `Total: ₹${total.toLocaleString('en-IN')}`;
    }
}

// ===== SECTION NAVIGATION =====
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.add('hidden'));

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.remove('hidden');
                this.classList.add('active');
            }

            const toggle = document.querySelector('.nav-toggle');
            if (toggle && toggle.checked) {
                toggle.checked = false;
            }

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ===== SEARCH WITH FILTER =====
function setupSearch() {
    const input = document.getElementById('searchInput');
    const btn = document.getElementById('searchBtn');

    function filterProducts() {
        const query = input.value.trim().toLowerCase();
        const cards = document.querySelectorAll('.product-card');

        if (!query) {
            cards.forEach(c => c.style.display = 'flex');
            return;
        }

        cards.forEach(card => {
            const name = card.querySelector('h3')?.innerText?.toLowerCase() || '';
            const desc = card.querySelector('.description')?.innerText?.toLowerCase() || '';
            if (name.includes(query) || desc.includes(query)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (btn) btn.addEventListener('click', filterProducts);
    if (input) {
        input.addEventListener('keyup', filterProducts);
    }
}

// ===== CONTACT FORM TOGGLE =====
function setupContactToggle() {
    const signupBox = document.getElementById('signupBox');
    const loginBox = document.getElementById('loginBox');
    const showLogin = document.getElementById('showLogin');
    const showSignup = document.getElementById('showSignup');

    if (showLogin) {
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            signupBox.style.display = 'none';
            loginBox.style.display = 'block';
        });
    }

    if (showSignup) {
        showSignup.addEventListener('click', function(e) {
            e.preventDefault();
            loginBox.style.display = 'none';
            signupBox.style.display = 'block';
        });
    }
}

// ===== CART OVERLAY =====
function setupCartOverlay() {
    const overlay = document.getElementById('cartOverlay');
    const cartIcon = document.getElementById('cartIcon');
    const closeBtn = document.getElementById('closeCart');

    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            overlay.classList.add('open');
            renderCart();
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}

// ===== FORM HANDLING =====
function setupForms() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;
            if (email && password) {
                showFeedback('✅ Login successful!', 'success');
                this.reset();
            } else {
                showFeedback('⚠️ Please fill all fields', 'error');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const pwd = this.querySelectorAll('input[type="password"]');
            if (name && email && pwd[0].value && pwd[1].value) {
                if (pwd[0].value === pwd[1].value) {
                    showFeedback('✅ Account created successfully!', 'success');
                    this.reset();
                } else {
                    showFeedback('⚠️ Passwords do not match', 'error');
                }
            } else {
                showFeedback('⚠️ Please fill all fields', 'error');
            }
        });
    }
}

// ===== FEEDBACK TOAST =====
function showFeedback(message, type = 'success') {
    const existing = document.querySelector('.feedback-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'feedback-toast';
    const color = type === 'success' ? 'var(--primary)' : 'var(--secondary)';
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${color};
        color: var(--bg-dark);
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        box-shadow: 0 0 30px ${color}40;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🟣 ElectroHub loaded!');
    renderProducts();
    setupNavigation();
    setupSearch();
    setupContactToggle();
    setupCartOverlay();
    setupForms();
    updateCart();

    console.log(`📦 ${products.length} products loaded`);
    console.log(`🛒 ${cart.length} items in cart`);
});
