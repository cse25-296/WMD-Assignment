// ============================================
// DIME SUITS - SHOPPING CART JAVASCRIPT
// Uses localStorage as single source of truth
// ============================================

// ============================================
// CART STORAGE FUNCTIONS
// ============================================

// Get cart from localStorage
function getCart() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
        return JSON.parse(cartData);
    }
    return [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count badge in navbar
function updateCartCount() {
    const cart = getCart();
    let totalItems = 0;
    
    // Calculate total quantity
    cart.forEach(function(item) {
        totalItems += item.quantity;
    });
    
    // Find or create cart count element
    let cartCount = document.getElementById('cartCount');
    
    if (!cartCount) {
        // Create the badge element if it doesn't exist
        const cartLink = document.querySelector('a[href="cart.html"]');
        if (cartLink) {
            cartCount = document.createElement('span');
            cartCount.id = 'cartCount';
            cartCount.className = 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger';
            cartCount.style.fontSize = '0.65rem';
            cartLink.style.position = 'relative';
            cartLink.appendChild(cartCount);
        }
    }
    
    if (cartCount) {
        if (totalItems > 0) {
            cartCount.textContent = totalItems;
            cartCount.style.display = 'inline';
        } else {
            cartCount.style.display = 'none';
        }
    }
}

// ============================================
// RENDER CART FUNCTIONS
// ============================================

// Render all cart items from localStorage
function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;
    
    // Get cart from localStorage
    const cart = getCart();
    
    // Clear current content
    cartItemsContainer.innerHTML = '';
    
    // Check if cart is empty
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Your cart is empty</p>';
        updateCartTotal();
        return;
    }
    
    // Render each item
    cart.forEach(function(item, index) {
        const itemElement = createCartItemElement(item, index);
        cartItemsContainer.appendChild(itemElement);
    });
    
    // Update total price
    updateCartTotal();
}

// Create HTML element for a cart item
function createCartItemElement(item, index) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.setAttribute('data-index', index);
    
    div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="item-image">
        <div class="item-details">
            <h4>${item.name}</h4>
            <p class="item-info">Color: ${item.color} | Size: ${item.size}</p>
            <p class="item-price">P${item.price.toFixed(2)}</p>
        </div>
        <div class="item-quantity">
            <label>Quantity:</label>
            <div class="quantity-controls">
                <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
                <input type="number" value="${item.quantity}" min="1" class="qty-input" readonly>
                <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
            </div>
        </div>
        <button class="delete-btn" onclick="removeItem(${index})">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
            </svg>
        </button>
    `;
    
    return div;
}

// ============================================
// CART ITEM OPERATIONS
// ============================================

// Change quantity of an item
function changeQuantity(index, change) {
    const cart = getCart();
    
    if (cart[index]) {
        // Update quantity
        cart[index].quantity += change;
        
        // Don't allow quantity less than 1
        if (cart[index].quantity < 1) {
            cart[index].quantity = 1;
        }
        
        // Save to localStorage
        saveCart(cart);
        
        // Re-render cart
        renderCart();
    }
}

// Remove a single item from cart
function removeItem(index) {
    const cart = getCart();
    
    // Remove item at index
    cart.splice(index, 1);
    
    // Save to localStorage
    saveCart(cart);
    
    // Re-render cart
    renderCart();
}

// Clear entire cart
function clearCart() {
    // Ask for confirmation
    const confirmed = confirm('Are you sure you want to clear your entire cart?');
    
    if (confirmed) {
        // Clear localStorage
        localStorage.removeItem('cart');
        
        // Re-render cart
        renderCart();
    }
}

// ============================================
// TOTAL PRICE CALCULATION
// ============================================

// Update cart total price
function updateCartTotal() {
    const cart = getCart();
    let subtotal = 0;
    
    // Calculate total
    cart.forEach(function(item) {
        subtotal += item.price * item.quantity;
    });
    
    // Find and update total elements
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) {
        subtotalElement.textContent = 'P' + subtotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    if (totalElement) {
        totalElement.textContent = 'P' + subtotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}

// ============================================
// ADD TO CART (for product pages)
// ============================================

// Add product to cart
function addToCart(productName, productPrice, productColor, productSize, productImage, quantity) {
    const cart = getCart();
    
    // Check if item already exists (same name, color, size)
    let existingIndex = -1;
    
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].name === productName && 
            cart[i].color === productColor && 
            cart[i].size === productSize) {
            existingIndex = i;
            break;
        }
    }
    
    if (existingIndex !== -1) {
        // Item exists - increase quantity
        cart[existingIndex].quantity += quantity;
    } else {
        // New item - add to cart
        cart.push({
            name: productName,
            price: productPrice,
            color: productColor,
            size: productSize,
            image: productImage,
            quantity: quantity
        });
    }
    
    // Save to localStorage
    saveCart(cart);
    
    // Show success message
    alert('Item added to cart!');
}

// ============================================
// PRODUCT PAGE FUNCTIONS
// ============================================

// Get selected option from button group
function getSelectedOption(container, defaultValue) {
    if (!container) return defaultValue;
    
    const selected = container.querySelector('.selected');
    if (selected) {
        return selected.textContent;
    }
    return defaultValue;
}

// Add product to cart from product page
function addProductToCart() {
    // Get product details from the page
    const productName = document.querySelector('.product-selection h1')?.textContent || 
                        document.querySelector('h1')?.textContent || 'Product';
    const productPriceText = document.querySelector('.product-selection h4')?.textContent?.replace('P', '') || '0';
    const productPrice = parseFloat(productPriceText);
    
    // Get selected size
    const sizeContainer = document.querySelector('.size-options');
    const selectedSize = getSelectedOption(sizeContainer, 'Standard');
    
    // Get selected color
    const colorContainer = document.querySelector('.color-options');
    const selectedColor = getSelectedOption(colorContainer, 'Black');
    
    // Get product image
    const productImage = document.querySelector('.product-image')?.src || 'images/placeholder.jpg';
    
    // Get quantity
    const qtyInput = document.querySelector('.product-selection input[type="number"]');
    const quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
    
    // Add to cart
    addToCart(productName, productPrice, selectedColor, selectedSize, productImage, quantity);
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

// Run when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on cart page
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cartItemsContainer) {
        // We're on cart page - render from localStorage
        renderCart();
    }
    
    // Update cart count badge on all pages
    updateCartCount();
    
    // Setup size button selection
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // Remove selected class from all
            document.querySelectorAll('.size-btn').forEach(function(b) {
                b.classList.remove('selected', 'btn-dark');
                b.classList.add('btn-outline-secondary');
            });
            // Add selected to clicked button
            this.classList.remove('btn-outline-secondary');
            this.classList.add('selected', 'btn-dark');
        });
    });
    
    // Setup color button selection
    const colorBtns = document.querySelectorAll('.color-btn');
    colorBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // Remove selected from all
            document.querySelectorAll('.color-btn').forEach(function(b) {
                b.classList.remove('selected');
            });
            // Add selected to clicked
            this.classList.add('selected');
        });
    });
    
    // Setup add to cart button
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            addProductToCart();
        });
    }
});
