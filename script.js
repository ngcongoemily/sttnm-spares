// ---------- PRODUCT DATA ----------
let products = [
  // PERFORMANCE
  { id: 1, name: "Performance Brake Kit", price: 1500, category: "Performance", image: "brakekit.jpg" },
  { id: 2, name: "Cold Air Intake", price: 1200, category: "Performance", image: "intake.jpg" },
  { id: 3, name: "Sport Exhaust System", price: 1800, category: "Performance", image: "exhaust.jpg" },
  { id: 4, name: "Radiator", price: 2000, category: "Performance", image: "radiator.jpg" },
  { id: 5, name: "Spark Plugs", price: 40, category: "Performance", image: "sparkplugs.jpg" },
  { id: 6, name: "Alternator", price: 2800, category: "Performance", image: "alternator.jpg" },
  { id: 7, name: "Car Lights", price: 3000, category: "Performance", image: "carlights.jpg" },
  { id: 8, name: "Car Distributor", price: 750, category: "Performance", image: "distributor.jpg" },
  // ENGINE
  { id: 9, name: "Valve", price: 120, category: "Engine", image: "valve.jpg" },
  { id: 10, name: "Compression Rings", price: 480, category: "Engine", image: "compression.jpg" },
  { id: 11, name: "Gasket", price: 200, category: "Engine", image: "gasket.jpg" },
  { id: 12, name: "Engine Bearing", price: 350, category: "Engine", image: "bearing.jpg" },
  // DRIVER NEEDS
  { id: 13, name: "Wheel Spanner", price: 70, category: "Driver Needs", image: "spanner.jpg" },
  { id: 14, name: "Car Jack", price: 480, category: "Driver Needs", image: "jack.jpg" },
  { id: 15, name: "Fire Extinguisher", price: 400, category: "Driver Needs", image: "extinguisher.jpg" },
  { id: 16, name: "Triangle", price: 80, category: "Driver Needs", image: "triangle.jpg" },
  { id: 17, name: "Wheel", price: 850, category: "Driver Needs", image: "tire.jpg" }
];

// ---------- GLOBAL VARIABLES ----------
let cart = [];
let isAdmin = false;
let currentCustomer = null;

// Filter state
let currentCategory = 'all';
let searchQuery = '';

// ---------- DOM ELEMENTS ----------
const productsGrid = document.getElementById('productsGrid');
const cartDiv = document.getElementById('cartItems');
const cartTotalSpan = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const customerNote = document.getElementById('customerNote');
const adminPanel = document.getElementById('adminPanel');

// Modals
const adminModal = document.getElementById('adminModal');
const customerModal = document.getElementById('customerModal');
const paymentModal = document.getElementById('paymentModal');
const closeButtons = document.querySelectorAll('.close');

// Payment elements
const paymentTotalSpan = document.getElementById('paymentTotal');
const payBtn = document.getElementById('payBtn');
const paymentMessage = document.getElementById('paymentMessage');

// Auth buttons
const adminLoginBtn = document.getElementById('adminLoginBtn');
const customerSigninBtn = document.getElementById('customerSigninBtn');
const logoutBtn = document.getElementById('logoutBtn');

// ---------- MODAL OPEN/CLOSE ----------
adminLoginBtn.onclick = () => adminModal.style.display = 'flex';
customerSigninBtn.onclick = () => customerModal.style.display = 'flex';

closeButtons.forEach(btn => {
  btn.onclick = function() {
    adminModal.style.display = 'none';
    customerModal.style.display = 'none';
    paymentModal.style.display = 'none';
  };
});

window.onclick = function(event) {
  if (event.target === adminModal) adminModal.style.display = 'none';
  if (event.target === customerModal) customerModal.style.display = 'none';
  if (event.target === paymentModal) paymentModal.style.display = 'none';
};

// ---------- ADMIN LOGIN ----------
document.getElementById('adminLoginSubmit').onclick = function() {
  const username = document.getElementById('adminUsername').value;
  const pin = document.getElementById('adminPin').value;
  const error = document.getElementById('adminError');

  if (username === 'emily' && pin === '1234567') {
    isAdmin = true;
    adminModal.style.display = 'none';
    adminPanel.style.display = 'block';
    renderFilteredProducts();

    // Update buttons
    adminLoginBtn.style.display = 'none';
    customerSigninBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';

    error.textContent = '';
  } else {
    error.textContent = 'Invalid credentials';
  }
};

// ---------- CUSTOMER SIGN IN ----------
document.getElementById('customerSigninSubmit').onclick = function() {
  const name = document.getElementById('customerName').value.trim();
  const error = document.getElementById('customerError');
  if (name) {
    currentCustomer = { name };
    customerModal.style.display = 'none';
    customerNote.textContent = `Signed in as ${name}`;
    checkoutBtn.disabled = false;

    adminLoginBtn.style.display = 'none';
    customerSigninBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';

    error.textContent = '';
  } else {
    error.textContent = 'Please enter your name';
  }
};

// ---------- LOGOUT ----------
logoutBtn.onclick = function() {
  isAdmin = false;
  currentCustomer = null;

  adminPanel.style.display = 'none';
  renderFilteredProducts();

  checkoutBtn.disabled = true;
  customerNote.textContent = 'Sign in to checkout';

  adminLoginBtn.style.display = 'inline-block';
  customerSigninBtn.style.display = 'inline-block';
  logoutBtn.style.display = 'none';

  // Clear admin form
  document.getElementById('addProductForm').reset();
};

// ---------- FILTER & RENDER ----------
function filterProducts() {
  let filtered = products;

  // Apply category filter
  if (currentCategory !== 'all') {
    filtered = filtered.filter(p => p.category === currentCategory);
  }

  // Apply search query
  if (searchQuery.trim() !== '') {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return filtered;
}

function renderFilteredProducts() {
  const filtered = filterProducts();
  renderProducts(filtered);
}

function renderProducts(productsToRender) {
  productsGrid.innerHTML = '';
  productsToRender.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    // Image with fallback
    const img = document.createElement('img');
    img.src = product.image || 'https://via.placeholder.com/150?text=No+Image';
    img.alt = product.name;
    img.onerror = () => img.src = 'https://via.placeholder.com/150?text=No+Image';

    const name = document.createElement('h3');
    name.textContent = product.name;

    const price = document.createElement('p');
    price.className = 'price';
    price.textContent = `R${product.price}`;

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add to Cart';
    addBtn.onclick = () => addToCart(product);

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(price);
    card.appendChild(addBtn);

    // Admin delete button
    if (isAdmin) {
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'delete-btn';
      deleteBtn.onclick = () => deleteProduct(product.id);
      card.appendChild(deleteBtn);
    }

    productsGrid.appendChild(card);
  });
}

// ---------- DELETE PRODUCT ----------
function deleteProduct(id) {
  if (!isAdmin) return;
  products = products.filter(p => p.id !== id);
  renderFilteredProducts();
}

// ---------- ADD PRODUCT ----------
document.getElementById('addProductForm').onsubmit = function(e) {
  e.preventDefault();
  if (!isAdmin) return;

  const name = document.getElementById('productName').value;
  const price = parseFloat(document.getElementById('productPrice').value);
  const category = document.getElementById('productCategory').value;
  const image = document.getElementById('productImage').value || 'placeholder.jpg';

  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  const newProduct = { id: newId, name, price, category, image };

  products.push(newProduct);
  renderFilteredProducts();

  e.target.reset();
};

// ---------- CART FUNCTIONS ----------
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  renderCart();
}

function renderCart() {
  cartDiv.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <span>${item.name} x${item.quantity}</span>
      <span>R${(item.price * item.quantity).toFixed(2)}</span>
      <button onclick="removeFromCart(${item.id})" style="background:red; color:white; border:none; border-radius:4px; cursor:pointer;">✕</button>
    `;
    cartDiv.appendChild(itemDiv);
  });
  cartTotalSpan.textContent = total.toFixed(2);
}
// Make removeFromCart globally accessible (for inline onclick)
window.removeFromCart = removeFromCart;

// ---------- CHECKOUT & PAYMENT ----------
checkoutBtn.onclick = function() {
  if (!currentCustomer) {
    alert('Please sign in first.');
    return;
  }
  if (cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  paymentTotalSpan.textContent = total.toFixed(2);
  paymentMessage.textContent = '';
  document.getElementById('cardNumber').value = '';
  document.getElementById('cardExpiry').value = '';
  document.getElementById('cardCvv').value = '';
  paymentModal.style.display = 'flex';
};

payBtn.onclick = function() {
  const cardNumber = document.getElementById('cardNumber').value.trim();
  const expiry = document.getElementById('cardExpiry').value.trim();
  const cvv = document.getElementById('cardCvv').value.trim();

  if (!cardNumber || !expiry || !cvv) {
    alert('Please fill in all card details.');
    return;
  }

  paymentMessage.textContent = 'Payment successful! Thank you for your order.';

  setTimeout(() => {
    cart = [];
    renderCart();
    paymentModal.style.display = 'none';
    alert(`Thank you for your order, ${currentCustomer.name}! Your payment was successful.`);
  }, 1500);
};

// ---------- CATEGORY BUTTONS ----------
const categoryBtns = document.querySelectorAll('.category-btn');
categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all
    categoryBtns.forEach(b => b.classList.remove('active'));
    // Add active to clicked
    btn.classList.add('active');
    // Update current category
    currentCategory = btn.dataset.category;
    // Re-render products
    renderFilteredProducts();
  });
});

// ---------- SEARCH INPUT ----------
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  renderFilteredProducts();
});

// ---------- INITIAL RENDER ----------
renderFilteredProducts();
renderCart();