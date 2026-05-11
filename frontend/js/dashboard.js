/* ─────────────────────────────────────────────────
   dashboard.js — Staff Dashboard Logic
   ───────────────────────────────────────────────── */

const API_BASE = "http://localhost:3000/api/orders";

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

    allOrders = await ordersRes.json();
    const stats = await statsRes.json();

    updateStats(stats);
    renderOrders();
    setOnline(true);
  } catch {
    setOnline(false);
  }
}

/* ── Stats ───────────────────────────────────────── */
function updateStats(stats) {
  document.getElementById("stat-total").textContent   = stats.total;
  document.getElementById("stat-pending").textContent = stats.pending;
  document.getElementById("stat-paid").textContent    = stats.paid;
  document.getElementById("stat-revenue").textContent = `$${parseFloat(stats.revenue).toFixed(2)}`;
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
          <span class="total-amount">$${parseFloat(order.total).toFixed(2)}</span>
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
function setOnline(isOnline) {
  const dot  = document.getElementById("status-dot");
  const text = document.getElementById("status-text");
  dot.style.background    = isOnline ? "var(--success)" : "#ef4444";
  dot.style.boxShadow     = isOnline ? "0 0 8px var(--success)" : "0 0 8px #ef4444";
  text.textContent        = isOnline ? "System Online" : "Connection Lost";
}

/* ── Init ────────────────────────────────────────── */
document.querySelectorAll(".filter-tab").forEach((tab) => {
  tab.addEventListener("click", () => setFilter(tab.dataset.filter));
});

loadOrders();
// Auto-refresh every 5 seconds
pollInterval = setInterval(loadOrders, 5000);
