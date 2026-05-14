const supabase = require("../config/supabase");

let menuItems = [
  // MAGGI
  { id: 1,  name: "Yummy Plain Maggi", emoji: "🍜", price: 59, is_available: true, type: "veg", category: "Maggi" },
  { id: 2,  name: "Onion Masala Maggi", emoji: "🧅", price: 79, is_available: true, type: "veg", category: "Maggi" },
  { id: 3,  name: "Tomato Masala Maggi", emoji: "🍅", price: 79, is_available: true, type: "veg", category: "Maggi" },
  { id: 4,  name: "Schezwan Masala Maggi", emoji: "🔥", price: 79, is_available: true, type: "veg", category: "Maggi" },
  { id: 5,  name: "Corn Capsicum Masala Maggi", emoji: "🌽", price: 79, is_available: true, type: "veg", category: "Maggi" },
  { id: 6,  name: "Veggie Masala Maggi", emoji: "🥦", price: 79, is_available: true, type: "veg", category: "Maggi" },
  { id: 7,  name: "Cheese Maggi", emoji: "🧀", price: 99, is_available: true, type: "veg", category: "Maggi" },

  // SANKS (Snacks)
  { id: 8,  name: "Veg Sandwiches", emoji: "🥪", price: 49, is_available: true, type: "veg", category: "Snacks" },
  { id: 9,  name: "Panner Sandwich", emoji: "🥪", price: 59, is_available: true, type: "veg", category: "Snacks" },
  { id: 10, name: "Chicken Sandwich", emoji: "🥪", price: 69, is_available: true, type: "non-veg", category: "Snacks" },
  { id: 11, name: "French Fries", emoji: "🍟", price: 69, is_available: true, type: "veg", category: "Snacks" },
  { id: 12, name: "Veg Nuggets", emoji: "🍗", price: 79, is_available: true, type: "veg", category: "Snacks" },
  { id: 13, name: "Potato Pops", emoji: "🥔", price: 79, is_available: true, type: "veg", category: "Snacks" },
  { id: 14, name: "Thumbs Up 200ml", emoji: "🥤", price: 20, is_available: true, type: "veg", category: "Snacks" },
  { id: 15, name: "Water Bottle", emoji: "💧", price: 10, is_available: true, type: "veg", category: "Snacks" },

  // BEVERAGE & MILK SHAKES
  { id: 16, name: "Blue Lagoon Mojito", emoji: "🍹", price: 59, is_available: true, type: "veg", category: "Beverages" },
  { id: 17, name: "Lime/Mint Mojito", emoji: "🍸", price: 59, is_available: true, type: "veg", category: "Beverages" },
  { id: 18, name: "Orange Mojito", emoji: "🍊", price: 59, is_available: true, type: "veg", category: "Beverages" },
  { id: 19, name: "Greenapple Mojito", emoji: "🍏", price: 59, is_available: true, type: "veg", category: "Beverages" },
  { id: 20, name: "Kiwi Mojito", emoji: "🥝", price: 59, is_available: true, type: "veg", category: "Beverages" },
  { id: 21, name: "Blueberry Mojito", emoji: "🫐", price: 59, is_available: true, type: "veg", category: "Beverages" },
  { id: 22, name: "Strawberry Mojito", emoji: "🍓", price: 59, is_available: true, type: "veg", category: "Beverages" },
  { id: 23, name: "Virjin Mojito", emoji: "🍸", price: 59, is_available: true, type: "veg", category: "Beverages" },
  { id: 24, name: "Cold Coffee and Icecream", emoji: "☕", price: 89, is_available: true, type: "veg", category: "Beverages" },
  { id: 25, name: "Oreo Milk Shake", emoji: "🥤", price: 89, is_available: true, type: "veg", category: "Beverages" },

  // BURGER NON-VEG
  { id: 26, name: "Crispy Chicken Burger", emoji: "🍔", price: 119, is_available: true, type: "non-veg", category: "Burger Non-Veg" },
  { id: 27, name: "Juicy Crunchy Chicken Burger", emoji: "🍔", price: 129, is_available: true, type: "non-veg", category: "Burger Non-Veg" },
  { id: 28, name: "Peri Peri Chicken Burger", emoji: "🌶️", price: 119, is_available: true, type: "non-veg", category: "Burger Non-Veg" },
  { id: 29, name: "Chicken Double Down Burger", emoji: "🍖", price: 169, is_available: true, type: "non-veg", category: "Burger Non-Veg" },

  // BURGER VEG
  { id: 30, name: "Aloo Tikki Burger", emoji: "🥔", price: 79, is_available: true, type: "veg", category: "Burger Veg" },
  { id: 31, name: "Crispy Veg Burger", emoji: "🥬", price: 119, is_available: true, type: "veg", category: "Burger Veg" },
  { id: 32, name: "Crispy Paneer Burger", emoji: "🧀", price: 129, is_available: true, type: "veg", category: "Burger Veg" },
  { id: 33, name: "Mushroom Crispy Burger", emoji: "🍄", price: 129, is_available: true, type: "veg", category: "Burger Veg" },

  // WRAP / LONGER NON-VEG
  { id: 34, name: "Crispy Chicken Wrap", emoji: "🌯", price: 119, is_available: true, type: "non-veg", category: "Wrap Non-Veg" },
  { id: 35, name: "Crunchy Chicken Wrap", emoji: "🌯", price: 129, is_available: true, type: "non-veg", category: "Wrap Non-Veg" },
  { id: 36, name: "Peri Peri Chicken Wrap", emoji: "🌶️", price: 129, is_available: true, type: "non-veg", category: "Wrap Non-Veg" },
  { id: 37, name: "Crispy Chicken Longer", emoji: "🥖", price: 139, is_available: true, type: "non-veg", category: "Wrap Non-Veg" },
  { id: 38, name: "Crispy Chicken Sub Sandwich", emoji: "🥪", price: 139, is_available: true, type: "non-veg", category: "Wrap Non-Veg" },
  { id: 39, name: "Tandoor Chicken Sub Sandwich", emoji: "🍗", price: 139, is_available: true, type: "non-veg", category: "Wrap Non-Veg" },

  // WRAP / LONGER VEG
  { id: 40, name: "Crispy Paneer Wrap", emoji: "🧀", price: 119, is_available: true, type: "veg", category: "Wrap Veg" },
  { id: 41, name: "Veg Delight Wrap", emoji: "🌯", price: 119, is_available: true, type: "veg", category: "Wrap Veg" },
  { id: 42, name: "Mushroom Crispy Wrap", emoji: "🍄", price: 199, is_available: true, type: "veg", category: "Wrap Veg" },
  { id: 43, name: "Crispy Veg Longer", emoji: "🥖", price: 129, is_available: true, type: "veg", category: "Wrap Veg" },
  { id: 44, name: "Crispy Paneer Longer", emoji: "🧀", price: 139, is_available: true, type: "veg", category: "Wrap Veg" },
  { id: 45, name: "Crispy Paneer Sub", emoji: "🥪", price: 139, is_available: true, type: "veg", category: "Wrap Veg" },

  // HOT & CRISPY (CHICKEN)
  { id: 46, name: "Chicken Popcorn (15 Pcs)", emoji: "🍿", price: 99, is_available: true, type: "non-veg", category: "Hot & Crispy" },
  { id: 47, name: "Chicken Popcorn (25 Pcs)", emoji: "🍿", price: 149, is_available: true, type: "non-veg", category: "Hot & Crispy" },
  { id: 48, name: "Boneless Strips (4 Pcs)", emoji: "🍗", price: 99, is_available: true, type: "non-veg", category: "Hot & Crispy" },
  { id: 49, name: "Boneless Strips (6 Pcs)", emoji: "🍗", price: 119, is_available: true, type: "non-veg", category: "Hot & Crispy" },
  { id: 50, name: "Boneless Strips (10 Pcs)", emoji: "🍗", price: 199, is_available: true, type: "non-veg", category: "Hot & Crispy" },
  { id: 51, name: "Hot Wings Small (5 Pcs)", emoji: "🔥", price: 99, is_available: true, type: "non-veg", category: "Hot & Crispy" },
  { id: 52, name: "Hot Wings Small (8 Pcs)", emoji: "🔥", price: 139, is_available: true, type: "non-veg", category: "Hot & Crispy" },
  { id: 53, name: "Hot Wings Small (12 Pcs)", emoji: "🔥", price: 229, is_available: true, type: "non-veg", category: "Hot & Crispy" },
  { id: 54, name: "Hot Wings Big (4 Pcs)", emoji: "🍗", price: 109, is_available: true, type: "non-veg", category: "Hot & Crispy" },
  { id: 55, name: "Hot Wings Big (6 Pcs)", emoji: "🍗", price: 139, is_available: true, type: "non-veg", category: "Hot & Crispy" },
  { id: 56, name: "Hot Wings Big (10 Pcs)", emoji: "🍗", price: 229, is_available: true, type: "non-veg", category: "Hot & Crispy" },
];
let nextId = 57;
let useDb = true;

(async () => {
  try {
    const { error } = await supabase.from("menu_items").select("id").limit(1);
    if (error) {
      console.warn("⚠️  menu_items table not found, using in-memory storage.");
      useDb = false;
      return;
    }
    const { data, error: fetchError } = await supabase
      .from("menu_items")
      .select("*")
      .order("id", { ascending: true });
    if (fetchError) throw fetchError;
    
    // Force sync if count is wrong or data is old
    const isMissingCategory = data && data.length > 0 && !data[0].category;
    
    if (!data || data.length < 56 || isMissingCategory) {
      console.log("🔄 Menu sync required. Current count: " + (data ? data.length : 0));
      
      // Clear and Re-insert (Most reliable way to ensure 1:1 match with the image)
      const { error: delError } = await supabase.from("menu_items").delete().neq("id", 0);
      if (delError) console.error("❌ Delete error:", delError);

      const { error: insError } = await supabase.from("menu_items").insert(menuItems);
      if (insError) {
        console.error("❌ Insert error:", insError);
      } else {
        console.log("✅ Menu fully synchronized (56 items)");
        const { data: syncedData } = await supabase.from("menu_items").select("*").order("id", { ascending: true });
        menuItems = syncedData || menuItems;
      }
    } else {
      menuItems = data;
      console.log("✅ Menu confirmed: " + menuItems.length + " items");
    }
    nextId = menuItems.length > 0 ? Math.max(...menuItems.map((i) => i.id)) + 1 : 57;
  } catch {
    console.warn("⚠️  Could not connect to Supabase, using in-memory storage.");
    useDb = false;
  }
})();

const getAll = async (req, res, next) => {
  try {
    if (useDb) {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      return res.json(data);
    }
    res.json(menuItems);
  } catch (err) {
    next(err);
  }
};

const addItem = async (req, res, next) => {
  try {
    const { name, emoji, price, is_available, type, category } = req.body;
    if (!name || !name.trim() || price == null || isNaN(price)) {
      return res.status(400).json({ error: "name and price are required." });
    }
    const item = { 
      name: name.trim(), 
      emoji: emoji || "🍽️", 
      price: parseFloat(price),
      is_available: is_available !== undefined ? is_available : true,
      type: type || "veg",
      category: category || "General"
    };

    if (useDb) {
      const { data, error } = await supabase
        .from("menu_items")
        .insert(item)
        .select();
      if (error) throw error;
      return res.status(201).json(data[0]);
    }

    item.id = nextId++;
    menuItems.push(item);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name, emoji, price, is_available, type, category } = req.body;
    if (useDb) {
      const updates = {};
      if (name) updates.name = name.trim();
      if (emoji) updates.emoji = emoji;
      if (price != null) updates.price = parseFloat(price);
      if (is_available !== undefined) updates.is_available = is_available;
      if (type) updates.type = type;
      if (category) updates.category = category;
      const { data, error } = await supabase
        .from("menu_items")
        .update(updates)
        .eq("id", id)
        .select();
      if (error) throw error;
      if (data.length === 0) return res.status(404).json({ error: "Menu item not found." });
      return res.json(data[0]);
    }

    const idx = menuItems.findIndex((i) => i.id === id);
    if (idx === -1) return res.status(404).json({ error: "Menu item not found." });
    if (name) menuItems[idx].name = name.trim();
    if (emoji) menuItems[idx].emoji = emoji;
    if (price != null) menuItems[idx].price = parseFloat(price);
    if (is_available !== undefined) menuItems[idx].is_available = is_available;
    if (type) menuItems[idx].type = type;
    if (category) menuItems[idx].category = category;
    res.json(menuItems[idx]);
  } catch (err) {
    next(err);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (useDb) {
      const { error } = await supabase.from("menu_items").delete().eq("id", id);
      if (error) throw error;
      return res.json({ message: `Item #${id} removed.` });
    }

    const idx = menuItems.findIndex((i) => i.id === id);
    if (idx === -1) return res.status(404).json({ error: "Menu item not found." });
    menuItems.splice(idx, 1);
    res.json({ message: `Item #${id} removed.` });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, addItem, updateItem, deleteItem };
