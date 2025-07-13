document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    // Initialize mobile navigation for all pages
    setupMobileNavigation();

    // Page-specific initializations
    if (path.endsWith('admin.html')) {
        setupAdminLogin();
    } else if (path.endsWith('admin-dashboard.html') || path.endsWith('admin-products.html')) {
        checkAuth();
        setupLogout();
        if (path.endsWith('admin-dashboard.html')) {
            initializeDashboard();
        } else {
            initializeAdminProducts();
        }
    } else if (path.endsWith('products.html')) {
        renderPublicProducts();
    }
});

// --- Mobile Navigation ---
function setupMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// --- Authentication ---
function checkAuth() {
    if (!sessionStorage.getItem('isAdmin')) {
        window.location.href = 'admin.html';
    }
}

function setupAdminLogin() {
    const form = document.getElementById('admin-login-form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'admin' && password === 'admin') {
            sessionStorage.setItem('isAdmin', 'true');
            showToast('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 1000);
        } else {
            showToast('Invalid credentials.', 'error');
        }
    });
}

function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('isAdmin');
            window.location.href = 'admin.html';
        });
    }
}

// --- Toast Notification ---
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
        toast.className = toast.className.replace('show', '');
    }, 3000);
}

// --- Product Data Management (localStorage) ---
let products = [];

function getProducts() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    } else {
        // Default products if localStorage is empty
        products = getDefaultProducts();
        saveProducts();
    }
    return products;
}

function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

function getDefaultProducts() {
    return [
        { id: 1, name: "Modern Dining Table", description: "Elegant 8-seater dining table with premium oak finish", price: 4200, category: "dining", style: "modern", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80", visible: true },
        { id: 2, name: "Classic Dining Chairs", description: "Set of 6 upholstered dining chairs with walnut frame", price: 2800, category: "dining", style: "classic", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80", visible: true },
        { id: 3, name: "Contemporary Sofa", description: "3-seater luxury sofa with premium fabric upholstery", price: 3500, category: "living", style: "contemporary", imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80", visible: true },
        { id: 4, name: "Modern Coffee Table", description: "Sleek coffee table with tempered glass top", price: 1200, category: "living", style: "modern", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80", visible: true },
        { id: 5, name: "Traditional Bed Frame", description: "King-size bed frame with ornate carvings", price: 5800, category: "bedroom", style: "traditional", imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80", visible: true },
        { id: 6, name: "Modern Nightstand", description: "Minimalist nightstand with built-in charging station", price: 850, category: "bedroom", style: "modern", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80", visible: true },
        { id: 7, name: "Contemporary Desk", description: "Executive desk with cable management system", price: 2100, category: "office", style: "contemporary", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80", visible: true },
        { id: 8, name: "Modern Office Chair", description: "Ergonomic office chair with lumbar support", price: 750, category: "office", style: "modern", imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80", visible: true }
    ];
}

// --- Admin Dashboard ---
function initializeDashboard() {
    const allProducts = getProducts();
    const visibleProducts = allProducts.filter(p => p.visible);

    document.getElementById('total-products').textContent = visibleProducts.length;
    // Dummy data for other metrics
    document.getElementById('daily-revenue').textContent = '$1,280';
    document.getElementById('monthly-revenue').textContent = '$38,400';
    document.getElementById('total-revenue').textContent = '$450,000';
    document.getElementById('page-views').textContent = '15,678';
    document.getElementById('unique-visitors').textContent = '4,321';
}

// --- Admin Product Management ---
function initializeAdminProducts() {
    renderAdminTable();
    setupModal();
}

function renderAdminTable() {
    const productList = document.getElementById('admin-products-list');
    if (!productList) return;
    
    productList.innerHTML = '';
    getProducts().forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price}</td>
            <td style="text-align: center;">
                <label class="switch">
                    <input type="checkbox" ${product.visible ? 'checked' : ''} onchange="toggleVisibility(${product.id})">
                    <span class="slider"></span>
                </label>
            </td>
            <td style="text-align: center;">
                <button class="btn btn-sm btn-outline" onclick="openEditModal(${product.id})">Modify</button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        `;
        productList.appendChild(row);
    });
}

function setupModal() {
    const modal = document.getElementById('product-modal');
    const addNewBtn = document.getElementById('add-new-product');
    const cancelBtn = document.getElementById('cancel-modal');
    const form = document.getElementById('product-form');

    addNewBtn.addEventListener('click', () => {
        form.reset();
        document.getElementById('product-id').value = '';
        document.getElementById('modal-title').textContent = 'Add Product';
        modal.style.display = 'block';
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', e => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const id = document.getElementById('product-id').value;
        const productData = {
            name: document.getElementById('product-name').value,
            description: document.getElementById('product-description').value,
            price: parseFloat(document.getElementById('product-price').value),
            category: document.getElementById('product-category').value,
            style: document.getElementById('product-style').value,
            imageUrl: document.getElementById('product-image-url').value,
        };

        if (id) { // Editing existing product
            const existingProduct = products.find(p => p.id == id);
            Object.assign(existingProduct, productData);
        } else { // Adding new product
            productData.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            productData.visible = true;
            products.push(productData);
        }
        
        saveProducts();
        renderAdminTable();
        modal.style.display = 'none';
    });
}

function openEditModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-style').value = product.style;
    document.getElementById('product-image-url').value = product.imageUrl;
    
    document.getElementById('modal-title').textContent = 'Edit Product';
    document.getElementById('product-modal').style.display = 'block';
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        renderAdminTable();
    }
}

function toggleVisibility(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        product.visible = !product.visible;
        saveProducts();
    }
}

// --- Public Products Page ---
function renderPublicProducts() {
    // Since products are already in HTML, we just need to set up filtering
    setupProductFilters();
}

function setupProductFilters() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const styleFilter = document.getElementById('style-filter');
    const priceFilter = document.getElementById('price-filter');
    const productItems = document.querySelectorAll('.product-item');

    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedStyle = styleFilter.value;
        const selectedPrice = priceFilter.value;

        productItems.forEach(item => {
            const name = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('.product-description').textContent.toLowerCase();
            const category = item.dataset.category;
            const style = item.dataset.style;
            const price = item.dataset.price;

            const matchesSearch = name.includes(searchTerm) || description.includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
            const matchesStyle = selectedStyle === 'all' || style === selectedStyle;
            const matchesPrice = selectedPrice === 'all' || price === selectedPrice;

            if (matchesSearch && matchesCategory && matchesStyle && matchesPrice) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Add event listeners for filtering
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    if (styleFilter) {
        styleFilter.addEventListener('change', filterProducts);
    }
    if (priceFilter) {
        priceFilter.addEventListener('change', filterProducts);
    }
}