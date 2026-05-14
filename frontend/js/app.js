/* ─────────────────────────────────────────────────
   app.js — Customer Ordering Page Logic
   ───────────────────────────────────────────────── */

const MENU_API = "http://localhost:3000/api/menu";
let ALL_MENU = [];
let CURRENT_FILTER = 'all';

async function fetchMenu() {
  try {
    const res = await fetch(MENU_API);
    ALL_MENU = await res.json();
    renderMenu();
  } catch {
    console.error("Failed to fetch menu");
  }
}

function filterMenu(type) {
  CURRENT_FILTER = type;
  
  // Update active button state
  const filterButtons = document.querySelectorAll('#main-menu-filters .filter-btn');
  filterButtons.forEach(btn => {
    // Check if button text or a data attribute matches. 
    // Since we use onclick, we can check the argument passed to filterMenu.
    const btnType = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
    btn.classList.toggle('active', btnType === type);
  });
  
  renderMenu();
}

let cart = []; // { id, name, price, qty }

/* ── Render Menu ─────────────────────────────────── */
function renderMenu() {
  const grid = document.getElementById("menu-grid");
  if (ALL_MENU.length === 0) {
    grid.innerHTML = "<div class='loading'>Loading menu...</div>";
    return;
  }

  const filtered = ALL_MENU.filter(item => {
    if (CURRENT_FILTER === 'all') return true;
    const itemType = item.type || 'veg';
    return itemType === CURRENT_FILTER;
  });

  // Group by category
  const categories = {};
  filtered.forEach(item => {
    const cat = item.category || "General";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(item);
  });

  // Preservation of order based on the menu image
  const categoryOrder = [
    "Maggi", "Snacks", "Beverages", 
    "Burger Non-Veg", "Burger Veg", 
    "Wrap Non-Veg", "Wrap Veg", 
    "Hot & Crispy"
  ];

  // Identify categories not in the list
  const otherCategories = Object.keys(categories).filter(c => !categoryOrder.includes(c));
  const finalOrder = [...categoryOrder, ...otherCategories];

  let html = finalOrder.map(catName => {
    const items = categories[catName];
    if (!items || items.length === 0) return "";
    
    return `
      <div class="category-block">
        <h3 class="category-title">${catName}</h3>
        <div class="category-grid">
          ${items.map(item => {
            const isOut = item.is_available === false;
            const inCart = cart.find((c) => c.id === item.id);
            const typeClass = item.type === 'non-veg' ? 'non-veg' : 'veg';
            return `
              <div class="menu-card ${inCart ? "in-cart" : ""} ${isOut ? "out-of-stock" : ""} ${typeClass}" id="card-${item.id}">
                <span class="badge" id="badge-${item.id}">${inCart ? inCart.qty : ""}</span>
                <span class="emoji">${item.emoji}</span>
                <div class="name">
                  <span class="type-dot"></span>
                  ${item.name}
                </div>
                <div class="price">₹${item.price.toFixed(2)}</div>
                <button class="add-btn" onclick="addToCart(${item.id})" ${isOut ? "disabled" : ""}>
                  ${isOut ? "Out of Stock" : (inCart ? "Add More" : "+ Add")}
                </button>
              </div>`;
          }).join("")}
        </div>
      </div>`;
  }).join("");

  if (!html) {
    html = `<div class="empty-state">No items found for this selection.</div>`;
  }

  grid.innerHTML = html;
}

/* ── Cart Ops ────────────────────────────────────── */
function addToCart(id) {
  const item = ALL_MENU.find((m) => m.id === id);
  const existing = cart.find((c) => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  renderMenu();
  renderCart();
  showToast(`${item.emoji} ${item.name} added!`);
}

function removeFromCart(id) {
  cart = cart.filter((c) => c.id !== id);
  renderMenu();
  renderCart();
}

function renderCart() {
  const section   = document.getElementById("cart-section");
  const itemsEl   = document.getElementById("cart-items");
  const totalEl   = document.getElementById("cart-total");
  const orderBtn  = document.getElementById("order-btn");

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty">Your cart is empty</div>`;
    totalEl.style.display = "none";
    orderBtn.disabled = true;
    return;
  }

  orderBtn.disabled = false;
  totalEl.style.display = "flex";

  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  itemsEl.innerHTML = cart.map((c) => `
    <div class="cart-item">
      <span class="item-name">${c.emoji} ${c.name} ×${c.qty}</span>
      <div class="item-right">
        <span class="item-price">₹${(c.price * c.qty).toFixed(2)}</span>
        <button class="remove-btn" onclick="removeFromCart(${c.id})" title="Remove">✕</button>
      </div>
    </div>`).join("");

  document.getElementById("total-amount").textContent = `₹${total.toFixed(2)}`;
}

/* ── Place Order ─────────────────────────────────── */
async function placeOrder() {
  const name = document.getElementById("custName").value.trim();
  if (!name) { showToast("⚠️ Please enter your name first!"); return; }
  if (cart.length === 0) { showToast("⚠️ Your cart is empty!"); return; }

  const btn = document.getElementById("order-btn");
  btn.disabled = true;
  btn.textContent = "Placing Order…";

  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const items = cart.map((c) => c.qty > 1 ? `${c.name} ×${c.qty}` : c.name);
  const cartSnapshot = cart.map((c) => ({ ...c })); // snapshot before cart clears

  try {
    const res = await fetch(`${API_BASE}/place`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerName: name, items, total: total.toFixed(2) }),
    });

    if (!res.ok) throw new Error("Server error");
    const order = await res.json();
    showReceipt(order, cartSnapshot, total);
  } catch {
    showToast("❌ Server is down. Try again later.");
    btn.disabled = false;
    btn.textContent = "🍔 Place Order";
  }
}

/* ── Show Receipt ────────────────────────────────── */
function showReceipt(order, cartItems, subtotalRaw) {
  const subtotal   = parseFloat(subtotalRaw);
  const tax        = subtotal * 0.05;
  const grandTotal = subtotal + tax;

  // Store data for PDF download
  currentReceiptData = { order, cartItems, subtotal, tax, grandTotal };
  document.getElementById("order-screen").style.display  = "none";
  document.getElementById("receipt-screen").style.display = "flex";

  document.getElementById("receipt-id").textContent       = `#${String(order.id).padStart(3, "0")}`;
  document.getElementById("receipt-name").textContent     = order.customerName;
  document.getElementById("receipt-time").textContent     = order.timestamp;
  document.getElementById("receipt-date").textContent     = new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  document.getElementById("receipt-subtotal").textContent = `₹${subtotal.toFixed(2)}`;
  document.getElementById("receipt-tax").textContent      = `₹${tax.toFixed(2)}`;
  document.getElementById("receipt-grand").textContent    = `₹${grandTotal.toFixed(2)}`;

  // Itemized list
  document.getElementById("receipt-items-list").innerHTML = cartItems.map((c) => `
    <div class="receipt-item">
      <span class="item-desc">${c.emoji} ${c.name}${c.qty > 1 ? ` ×${c.qty}` : ""}</span>
      <span class="item-amt">₹${(c.price * c.qty).toFixed(2)}</span>
    </div>`).join("");
}

/* ── Toast ───────────────────────────────────────── */
function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2800);
}

/* ── PDF Download ────────────────────────────────── */
let currentReceiptData = null;

function downloadReceiptPDF() {
  if (!currentReceiptData) return;
  
  const { order, cartItems, subtotal, tax, grandTotal } = currentReceiptData;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    unit: "mm",
    format: [80, 150] // Receipt-style size
  });

  const centerX = 40;
  let y = 10;

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("BURGER ONE", centerX, y, { align: "center" });
  
  y += 5;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Fast · Fresh · Delicious", centerX, y, { align: "center" });
  
  y += 5;
  doc.text("------------------------------------------", centerX, y, { align: "center" });
  
  // Order Info
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.text(`Order: #${String(order.id).padStart(3, "0")}`, 10, y);
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${order.customerName}`, 10, y);
  y += 4;
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, y);
  y += 4;
  doc.text(`Time: ${order.timestamp}`, 10, y);
  
  y += 5;
  doc.text("------------------------------------------", centerX, y, { align: "center" });
  
  // Items
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.text("Items", 10, y);
  doc.text("Price", 70, y, { align: "right" });
  
  y += 4;
  doc.setFont("helvetica", "normal");
  cartItems.forEach(item => {
    const itemText = `${item.name}${item.qty > 1 ? ` x${item.qty}` : ""}`;
    const priceText = `₹${(item.price * item.qty).toFixed(2)}`;
    doc.text(itemText, 10, y);
    doc.text(priceText, 70, y, { align: "right" });
    y += 4;
  });
  
  y += 2;
  doc.text("------------------------------------------", centerX, y, { align: "center" });
  
  // Totals
  y += 5;
  doc.text("Subtotal:", 10, y);
  doc.text(`₹${subtotal.toFixed(2)}`, 70, y, { align: "right" });
  y += 4;
  doc.text("Tax (5%):", 10, y);
  doc.text(`₹${tax.toFixed(2)}`, 70, y, { align: "right" });
  
  y += 6;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL:", 10, y);
  doc.text(`₹${grandTotal.toFixed(2)}`, 70, y, { align: "right" });
  
  y += 8;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for your order!", centerX, y, { align: "center" });
  y += 4;
  doc.text("See you again soon!", centerX, y, { align: "center" });

  doc.save(`Receipt_Order_${order.id}.pdf`);

  // Show thank you message
  showToast("❤️ Thank you, visit again!");

  // Redirect to payment notice after 2 seconds
  setTimeout(() => {
    document.getElementById("receipt-screen").style.display = "none";
    document.getElementById("payment-notice-screen").style.display = "flex";
  }, 2000);
}

/* ── Init ────────────────────────────────────────── */
const API_BASE = "http://localhost:3000/api/orders";
fetchMenu();
renderCart();

// Theme Toggle Logic
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// Check for saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  body.classList.add("light-mode");
  themeToggle.textContent = "🌙";
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light-mode");
  const isLight = body.classList.contains("light-mode");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  themeToggle.textContent = isLight ? "🌙" : "🌓";
  
  // Feedback
  showToast(isLight ? "☀️ Light Mode Active" : "🌙 Dark Mode Active");
});
