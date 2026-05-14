const supabase = require("../config/supabase");

// POST /api/orders/place
const placeOrder = async (req, res, next) => {
  try {
    const { customerName, items, total } = req.body;

    if (!customerName || !items || !Array.isArray(items) || items.length === 0 || total == null) {
      return res.status(400).json({ error: "customerName, items[], and total are required." });
    }

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          customer_name: customerName.trim(),
          items,
          total: parseFloat(total),
          status: "Pending Payment",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        },
      ])
      .select();

    if (error) {
      console.error("❌ Supabase Error (placeOrder):", error.message);
      console.error("Details:", error.details);
      throw error;
    }
    
    console.log("✅ Order saved to Supabase:", data[0].id);
    
    // Map snake_case from DB to camelCase for Frontend
    const mappedOrder = { ...data[0], customerName: data[0].customer_name };
    res.status(201).json(mappedOrder);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/all
const getAllOrders = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .neq("status", "Completed") // Don't show completed/removed orders
      .order("id", { ascending: false });

    if (error) throw error;

    // Map DB columns to match frontend expectations if necessary
    const mappedData = data.map(o => ({
      ...o,
      customerName: o.customer_name // Frontend expects customerName
    }));

    res.json(mappedData);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/stats
const getStats = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("orders").select("status, total");

    if (error) throw error;

    const total = data.length;
    const pending = data.filter((o) => o.status === "Pending Payment").length;
    const paid = data.filter((o) => o.status === "Paid").length;
    
    // Revenue should include both active 'Paid' orders and 'Completed' ones
    const revenue = data
      .filter((o) => o.status === "Paid" || o.status === "Completed")
      .reduce((sum, o) => sum + parseFloat(o.total), 0)
      .toFixed(2);

    res.json({ total, pending, paid, revenue });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/orders/pay/:id
const markAsPaid = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const { data, error } = await supabase
      .from("orders")
      .update({ status: "Paid" })
      .eq("id", id)
      .select();

    if (error) throw error;
    if (data.length === 0) return res.status(404).json({ error: `Order #${id} not found.` });

    // Map snake_case from DB to camelCase for Frontend
    const mappedOrder = { ...data[0], customerName: data[0].customer_name };
    res.json(mappedOrder);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/orders/:id
const deleteOrder = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    // Instead of deleting, we mark as 'Completed' so revenue stats are preserved
    const { error } = await supabase
      .from("orders")
      .update({ status: "Completed" })
      .eq("id", id);

    if (error) throw error;
    res.json({ message: `Order #${id} marked as completed and removed from view.` });
  } catch (err) {
    next(err);
  }
};

module.exports = { placeOrder, getAllOrders, getStats, markAsPaid, deleteOrder };
