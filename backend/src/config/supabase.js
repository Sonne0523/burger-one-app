require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl === "your_supabase_project_url") {
  console.warn("\n⚠️  Supabase credentials missing in backend/.env!");
  console.warn("   Orders will not be saved. Please add your credentials.\n");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
