/* ─────────────────────────────────────────────────
   dashboard.js — Staff Dashboard Logic
   ───────────────────────────────────────────────── */

const API_BASE = "/api/orders";
const MENU_API = "/api/menu";

let allOrders  = [];
let activeFilter = "all";
let pollInterval;

/* ── Fetch + Render ──────────────────────────────── */
async function loadOrders() {
  try {
    const [ordersRes, statsRes] = await Promise.all([
      fetch(`${API_BASE}/all`),
      fetch(`${API_BASE}/stats`),
    ]);

    if (!ordersRes.ok || !statsRes.ok) {
      const err = await ordersRes.json().catch(() => ({}));
      throw new Error(err.error || `Server Error (${ordersRes.status})`);
    }

    allOrders = await ordersRes.json();
    const stats = await statsRes.json();

    updateStats(stats);
    renderOrders();
    setOnline(true);
  } catch (err) {
    setOnline(false, err.message);
    console.error("Dashboard Load Error:", err);
  }
}

function setOnline(isOnline, errorMsg = "") {
  const status = document.getElementById("connection-status");
  if (isOnline) {
    status.innerHTML = '<span class="status-dot online"></span> Online';
  } else {
    status.innerHTML = `<span class="status-dot offline"></span> ${errorMsg || "Connecting..."}`;
  }
}

/* ── Stats ───────────────────────────────────────── */
function updateStats(stats) {
  document.getElementById("stat-total").textContent   = stats.total;
  document.getElementById("stat-pending").textContent = stats.pending;
  document.getElementById("stat-paid").textContent    = stats.paid;
  document.getElementById("stat-revenue").textContent = `₹${parseFloat(stats.revenue).toFixed(2)}`;
}

/* ── Render Orders ───────────────────────────────── */
function renderOrders() {
  const grid = document.getElementById("orders-grid");
  const filtered = activeFilter === "all"
    ? allOrders
    : allOrders.filter((o) => o.status.toLowerCase().includes(activeFilter));

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="icon">📭</div>
        <h3>No orders yet</h3>
        <p>New orders will appear here automatically.</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map((order) => {
    const isPaid    = order.status === "Paid";
    const statusCls = isPaid ? "paid" : "pending";
    const statusDot = isPaid ? "✅" : "⏳";

    return `
      <div class="order-card ${statusCls}" id="order-card-${order.id}">
        <div class="card-header">
          <span class="order-id">#${String(order.id).padStart(3, "0")}</span>
          <span class="status-pill ${statusCls}">${statusDot} ${order.status}</span>
        </div>

        <div class="customer-name">👤 ${order.customerName}</div>
        <div class="card-divider"></div>

        <div class="items-list">
          ${order.items.map((i) => `<span class="item-tag">${i}</span>`).join("")}
        </div>

        <div class="card-footer">
          <span class="total-amount">₹${parseFloat(order.total).toFixed(2)}</span>
          <span class="order-time">🕐 ${order.timestamp}</span>
        </div>

        ${!isPaid
          ? `<button class="btn-pay" onclick="confirmPayment(${order.id})">💵 Confirm Cash Payment</button>`
          : `
            <div class="paid-badge">✅ PAYMENT RECEIVED</div>
            <button class="btn-remove" onclick="removeOrder(${order.id})">🗑️ Complete & Remove</button>
            `}
      </div>`;
  }).join("");
}

/* ── Confirm Payment ─────────────────────────────── */
async function confirmPayment(id) {
  const btn = document.querySelector(`#order-card-${id} .btn-pay`);
  if (btn) { btn.disabled = true; btn.textContent = "Processing…"; }

  try {
    const res = await fetch(`${API_BASE}/pay/${id}`, { method: "PATCH" });
    if (!res.ok) throw new Error();
    await loadOrders();
  } catch {
    if (btn) { btn.disabled = false; btn.textContent = "💵 Confirm Cash Payment"; }
    alert("Failed to update order. Please try again.");
  }
}

/* ── Remove Order ────────────────────────────────── */
async function removeOrder(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error();
    await loadOrders();
  } catch {
    alert("Failed to remove order.");
  }
}

/* ── Filter Tabs ─────────────────────────────────── */
function setFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll(".filter-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.filter === filter);
  });
  renderOrders();
}

/* ── Online Status ───────────────────────────────── */
/* ── Online Status is handled at the top ── */

/* ── Menu Manager ─────────────────────────────────── */
const MENU_API = "/api/menu";

function toggleMenuManager() {
  const panel = document.getElementById("menu-manager");
  const btn = document.getElementById("toggle-menu-btn");
  const isHidden = panel.style.display === "none" || panel.style.display === "";
  panel.style.display = isHidden ? "block" : "none";
  btn.textContent = isHidden ? "Hide Menu Manager" : "Show Menu Manager";
  if (isHidden) loadMenuItems();
}

let ALL_MENU_ITEMS = [];

async function loadMenuItems() {
  try {
    const res = await fetch(MENU_API);
    ALL_MENU_ITEMS = await res.json();
    renderMenuItems(ALL_MENU_ITEMS);
  } catch {
    showToast("Failed to load menu items.");
  }
}

function renderMenuItems(items) {
  const list = document.getElementById("menu-items-list");
  if (items.length === 0) {
    list.innerHTML = `<div class="empty-state" style="padding:30px 20px">
      <div class="icon">🍽️</div>
      <h3>No menu items yet</h3>
      <p>Add your first item above.</p>
    </div>`;
    return;
  }

  // Group by category
  const categories = {};
  items.forEach(item => {
    const cat = item.category || "General";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(item);
  });

  const categoryOrder = [
    "Maggi", "Snacks", "Beverages", 
    "Burger Non-Veg", "Burger Veg", 
    "Wrap Non-Veg", "Wrap Veg", 
    "Hot & Crispy"
  ];

  const otherCategories = Object.keys(categories).filter(c => !categoryOrder.includes(c));
  const finalOrder = [...categoryOrder, ...otherCategories];

  const renderSection = (title, itemList) => {
    const isNonVeg = title.toLowerCase().includes("non-veg") || title === "Hot & Crispy";
    const typeClass = isNonVeg ? "non-veg" : "veg";
    const icon = isNonVeg ? "🔴" : "🟢";
    
    return `
      <div class="menu-section">
        <h3 class="section-divider ${typeClass}">${icon} ${title} (${itemList.length})</h3>
        ${itemList.map((item) => `
          <div class="menu-item-row ${item.is_available === false ? "out-of-stock" : ""}" id="menu-row-${item.id}">
            <span class="item-emoji">${item.emoji || "🍽️"}</span>
            <div class="item-info">
              <span class="item-name">${item.name}</span>
              <span class="item-type-badge ${item.type}">${item.type === 'non-veg' ? '🔴 Non-Veg' : '🟢 Veg'}</span>
            </div>
            <span class="item-price">₹${parseFloat(item.price).toFixed(2)}</span>
            <div class="item-actions">
              <label class="toggle-switch" title="Toggle Availability">
                <input type="checkbox" ${item.is_available !== false ? "checked" : ""} onchange="toggleAvailability(${item.id}, this.checked)">
                <span class="slider"></span>
              </label>
              <button class="btn-edit" onclick="editMenuItem(${item.id})">✏️ Edit</button>
              <button class="btn-delete" onclick="deleteMenuItem(${item.id})">🗑️ Delete</button>
            </div>
          </div>`).join("")}
      </div>
    `;
  };

  list.innerHTML = finalOrder
    .filter(cat => categories[cat] && categories[cat].length > 0)
    .map(cat => renderSection(cat, categories[cat]))
    .join("");
}

async function toggleAvailability(id, isAvailable) {
  try {
    const res = await fetch(`${MENU_API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_available: isAvailable }),
    });
    if (!res.ok) throw new Error();
    const row = document.getElementById(`menu-row-${id}`);
    if (isAvailable) row.classList.remove("out-of-stock");
    else row.classList.add("out-of-stock");
    showToast(isAvailable ? "✅ Item is now available" : "⚠️ Item marked as out of stock");
  } catch {
    alert("Failed to update availability.");
    loadMenuItems(); // refresh to reset checkbox
  }
}

async function addMenuItem(e) {
  e.preventDefault();
  const name = document.getElementById("menu-name").value.trim();
  const emoji = document.getElementById("menu-emoji").value.trim();
  const price = document.getElementById("menu-price").value;
  const type  = document.getElementById("menu-type").value;
  const category = document.getElementById("menu-category").value;
  if (!name || !price) return;

  try {
    const res = await fetch(MENU_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, emoji: emoji || "🍽️", price: parseFloat(price), type, category }),
    });
    if (!res.ok) throw new Error();
    document.getElementById("menu-add-form").reset();
    await loadMenuItems();
    showToast(`✅ "${name}" added to menu!`);
  } catch {
    alert("Failed to add menu item.");
  }
}

async function deleteMenuItem(id) {
  if (!confirm("Delete this menu item?")) return;
  try {
    const res = await fetch(`${MENU_API}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error();
    await loadMenuItems();
    showToast("🗑️ Item deleted.");
  } catch {
    alert("Failed to delete item.");
  }
}

function editMenuItem(id) {
  const item = ALL_MENU_ITEMS.find(i => i.id === id);
  if (!item) return;

  const row = document.getElementById(`menu-row-${id}`);
  const { emoji, name, price, type, category } = item;
  
  row.classList.add("editing");
  row.innerHTML = `
    <input class="edit-emoji" type="text" value="${emoji}" placeholder="🍔" style="width:50px" />
    <input class="edit-name" type="text" value="${name}" placeholder="Item name" />
    <select class="edit-type">
      <option value="veg" ${type === 'veg' ? 'selected' : ''}>Veg</option>
      <option value="non-veg" ${type === 'non-veg' ? 'selected' : ''}>Non-Veg</option>
    </select>
    <select class="edit-category">
      <option value="Maggi" ${category === 'Maggi' ? 'selected' : ''}>Maggi</option>
      <option value="Snacks" ${category === 'Snacks' ? 'selected' : ''}>Snacks</option>
      <option value="Beverages" ${category === 'Beverages' ? 'selected' : ''}>Beverages</option>
      <option value="Burger Non-Veg" ${category === 'Burger Non-Veg' ? 'selected' : ''}>Burger Non-Veg</option>
      <option value="Burger Veg" ${category === 'Burger Veg' ? 'selected' : ''}>Burger Veg</option>
      <option value="Wrap Non-Veg" ${category === 'Wrap Non-Veg' ? 'selected' : ''}>Wrap Non-Veg</option>
      <option value="Wrap Veg" ${category === 'Wrap Veg' ? 'selected' : ''}>Wrap Veg</option>
      <option value="Hot & Crispy" ${category === 'Hot & Crispy' ? 'selected' : ''}>Hot & Crispy</option>
    </select>
    <input class="edit-price" type="number" value="${price}" step="0.01" min="0" style="width:80px" />
    <div class="item-actions">
      <button class="btn-edit" onclick="saveMenuItem(${id})">💾 Save</button>
      <button class="btn-delete" onclick="loadMenuItems()">✕ Cancel</button>
    </div>`;
}

async function saveMenuItem(id) {
  const row = document.getElementById(`menu-row-${id}`);
  const inputs = row.querySelectorAll("input");
  const emoji = inputs[0].value.trim();
  const name = inputs[1].value.trim();
  const type = row.querySelector(".edit-type").value;
  const category = row.querySelector(".edit-category").value;
  const price = inputs[2].value;

  if (!name || !price) { alert("Name and price are required."); return; }

  try {
    const res = await fetch(`${MENU_API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, emoji: emoji || "🍽️", price: parseFloat(price), type, category }),
    });
    if (!res.ok) throw new Error();
    await loadMenuItems();
    showToast(`✅ "${name}" updated!`);
  } catch {
    alert("Failed to update item.");
  }
}

function showToast(msg) {
  let toast = document.getElementById("menu-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "menu-toast";
    toast.style.cssText = `
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      background: var(--surface); color: var(--text); padding: 12px 24px;
      border-radius: 10px; font-size: 14px; font-weight: 600;
      border: 1px solid var(--border); z-index: 999;
      transition: opacity 0.3s; opacity: 0;
      font-family: 'Outfit', sans-serif;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = "1";
  setTimeout(() => { toast.style.opacity = "0"; }, 2500);
}

/* ── Init ────────────────────────────────────────── */
document.querySelectorAll(".filter-tab").forEach((tab) => {
  tab.addEventListener("click", () => setFilter(tab.dataset.filter));
});

loadOrders();
// Auto-refresh every 5 seconds
pollInterval = setInterval(loadOrders, 5000);
