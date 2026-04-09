// Shopping Cart Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    initializeCart();
});

function initializeCart() {
    // Quantity control buttons
    const qtyBtns = document.querySelectorAll('.qty-btn');
    qtyBtns.forEach(btn => {
        btn.addEventListener('click', handleQuantityChange);
    });

    // Delete item buttons
    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', deleteItem);
    });

    // Clear cart button
    const clearCartBtn = document.querySelector('.clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }

    // Continue shopping button
    const continueShoppingBtn = document.querySelector('.continue-shopping-btn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', continueShopping);
    }

    // Update cart total
    updateCartTotal();
}

function handleQuantityChange(e) {
    const btn = e.target.closest('.qty-btn');
    const quantityControls = btn.closest('.quantity-controls');
    const input = quantityControls.querySelector('.qty-input');
    let currentValue = parseInt(input.value);

    if (btn.textContent.trim() === '+') {
        currentValue++;
    } else if (btn.textContent.trim() === '-' && currentValue > 1) {
        currentValue--;
    }

    input.value = currentValue;
    updateCartTotal();
}

function deleteItem(e) {
    const cartItem = e.target.closest('.cart-item');
    if (cartItem) {
        cartItem.remove();
        updateCartTotal();
        
        // Check if cart is empty
        const remainingItems = document.querySelectorAll('.cart-item').length;
        if (remainingItems === 0) {
            const cartItems = document.querySelector('.cart-items');
            cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Your cart is empty</p>';
        }
    }
}

function clearCart(e) {
    e.preventDefault();
    const confirmed = confirm('Are you sure you want to clear your entire cart?');
    if (confirmed) {
        const cartItems = document.querySelectorAll('.cart-item');
        cartItems.forEach(item => item.remove());
        
        const itemsContainer = document.querySelector('.cart-items');
        itemsContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Your cart is empty</p>';
        
        updateCartTotal();
    }
}

function updateCartTotal() {
    const cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;

    cartItems.forEach(item => {
        const priceText = item.querySelector('.item-price').textContent.replace('P', '').trim();
        const quantity = parseInt(item.querySelector('.qty-input').value);
        const price = parseFloat(priceText);
        
        subtotal += price * quantity;
    });

    // Update subtotal and total
    const subtotalElement = document.querySelector('#subtotal');
    const totalElement = document.querySelector('#total');
    
    if (subtotalElement && totalElement) {
        const formattedSubtotal = 'P' + subtotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        subtotalElement.textContent = formattedSubtotal;
        totalElement.textContent = formattedSubtotal;
    }
}

function proceedToCheckout() {
    // Navigate to checkout page
    window.location.href = 'checkout.html';
}

function continueShopping(e) {
    e.preventDefault();
    // Navigate back to shop or home page
    window.location.href = 'index.html';
}

// Add to cart functionality (for product pages)
function addToCart(productName, productPrice, productColor, productSize, productImage) {
    const cartItems = document.querySelector('.cart-items');
    
    if (!cartItems) {
        // If we're not on the cart page, store in localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({
            name: productName,
            price: productPrice,
            color: productColor,
            size: productSize,
            image: productImage,
            quantity: 1
        });
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Item added to cart!');
        return;
    }

    // Check if item already exists in cart
    const existingItems = document.querySelectorAll('.cart-item');
    let itemFound = false;

    existingItems.forEach(item => {
        const itemTitle = item.querySelector('.item-details h4').textContent;
        if (itemTitle === productName) {
            const input = item.querySelector('.qty-input');
            input.value = parseInt(input.value) + 1;
            itemFound = true;
        }
    });

    if (!itemFound) {
        const newItem = document.createElement('div');
        newItem.className = 'cart-item';
        newItem.innerHTML = `
            <img src="${productImage}" alt="${productName}" class="item-image">
            <div class="item-details">
                <h4>${productName}</h4>
                <p class="item-info">color:${productColor} | size:${productSize}</p>
                <p class="item-price">P${productPrice}</p>
            </div>
            <div class="item-quantity">
                <label>Quantity:</label>
                <div class="quantity-controls">
                    <button class="qty-btn">-</button>
                    <input type="number" value="1" min="1" class="qty-input">
                    <button class="qty-btn">+</button>
                </div>
            </div>
            <button class="delete-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                </svg>
            </button>
        `;

        cartItems.appendChild(newItem);

        // Reattach event listeners to new buttons
        const newQtyBtns = newItem.querySelectorAll('.qty-btn');
        newQtyBtns.forEach(btn => {
            btn.addEventListener('click', handleQuantityChange);
        });

        const deleteBtn = newItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', deleteItem);
    }

    updateCartTotal();
    alert('Item added to cart!');
}

// Checkout Form Functionality
function formatCardNumber(value) {
    // Remove any spaces
    const cleaned = value.replace(/\s/g, '');
    // Add spaces every 4 digits
    return cleaned.replace(/(\d{4})/g, '$1 ').trim();
}

function formatExpireDate(value) {
    // Remove any non-digits
    const cleaned = value.replace(/\D/g, '');
    // Format as MM/YY
    if (cleaned.length >= 2) {
        return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
}

// Add event listeners for card number and expire date formatting
document.addEventListener('DOMContentLoaded', function() {
    const cardNumberInput = document.querySelector('#cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            e.target.value = formatCardNumber(e.target.value);
        });
    }

    const expireDateInput = document.querySelector('#expireDate');
    if (expireDateInput) {
        expireDateInput.addEventListener('input', function(e) {
            e.target.value = formatExpireDate(e.target.value);
        });
    }

    const cvvInput = document.querySelector('#cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        });
    }
});

function validateCheckoutForm() {
    const email = document.querySelector('#email').value.trim();
    const firstName = document.querySelector('#firstName').value.trim();
    const lastName = document.querySelector('#lastName').value.trim();
    const street = document.querySelector('#street').value.trim();
    const city = document.querySelector('#city').value.trim();
    const province = document.querySelector('#province').value.trim();
    const zipcode = document.querySelector('#zipcode').value.trim();
    const country = document.querySelector('#country').value.trim();
    const cardNumber = document.querySelector('#cardNumber').value.trim().replace(/\s/g, '');
    const cardName = document.querySelector('#cardName').value.trim();
    const expireDate = document.querySelector('#expireDate').value.trim();
    const cvv = document.querySelector('#cvv').value.trim();

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }

    // Shipping address validation
    if (!firstName || !lastName || !street || !city || !province || !zipcode || !country) {
        alert('Please fill in all shipping address fields');
        return false;
    }

    // Card number validation (basic check for 16 digits)
    if (!cardNumber || cardNumber.length !== 16) {
        alert('Please enter a valid 16-digit card number');
        return false;
    }

    // Card name validation
    if (!cardName) {
        alert('Please enter the name on the card');
        return false;
    }

    // Expire date validation (MM/YY format)
    const expireDateRegex = /^\d{2}\/\d{2}$/;
    if (!expireDate || !expireDateRegex.test(expireDate)) {
        alert('Please enter a valid expire date (MM/YY)');
        return false;
    }

    // CVV validation (3-4 digits)
    if (!cvv || cvv.length < 3 || cvv.length > 4) {
        alert('Please enter a valid CVV (3-4 digits)');
        return false;
    }

    return true;
}

function processCheckout() {
    if (validateCheckoutForm()) {
        // Get form data
        const checkoutData = {
            email: document.querySelector('#email').value,
            firstName: document.querySelector('#firstName').value,
            lastName: document.querySelector('#lastName').value,
            street: document.querySelector('#street').value,
            city: document.querySelector('#city').value,
            province: document.querySelector('#province').value,
            zipcode: document.querySelector('#zipcode').value,
            country: document.querySelector('#country').value,
            cardName: document.querySelector('#cardName').value,
            cardNumberLast4: document.querySelector('#cardNumber').value.replace(/\s/g, '').slice(-4),
            timestamp: new Date().toISOString()
        };

        // Store checkout data (in a real app, this would be sent to a server)
        localStorage.setItem('lastCheckout', JSON.stringify(checkoutData));

        // Show success message
        alert('Order placed successfully!\n\nThank you for your purchase, ' + checkoutData.firstName + '!\n\nA confirmation email has been sent to ' + checkoutData.email);

        // Clear cart from localStorage
        localStorage.removeItem('cart');

        // Redirect to home page or order confirmation page
        window.location.href = 'index.html';
    }
}

