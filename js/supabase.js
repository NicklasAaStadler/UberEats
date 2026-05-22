const SUPABASE_URL = 'https://bjosgydgmjnfptauygjh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqb3NneWRnbWpuZnB0YXV5Z2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxODIyNTQsImV4cCI6MjA5NDc1ODI1NH0.QoB0r4nySaRZctOeZBoVXWt_CEUcuOHwxmo8mh6X17g';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Auth ──────────────────────────────────────────────────────────────────────
async function sbSignIn(email, password) {
  return sb.auth.signInWithPassword({ email, password });
}

async function sbSignUp(email, password) {
  return sb.auth.signUp({ email, password });
}

async function sbSignOut() {
  return sb.auth.signOut();
}

async function sbGetSession() {
  const { data: { session } } = await sb.auth.getSession();
  return session;
}

// ── Profil ────────────────────────────────────────────────────────────────────
async function sbGetProfile() {
  const session = await sbGetSession();
  if (!session) return null;
  const { data } = await sb.from('profiles').select('*').eq('id', session.user.id).single();
  return data;
}

async function sbUpsertProfile(displayName, role) {
  const session = await sbGetSession();
  if (!session) return;
  await sb.from('profiles').upsert({ id: session.user.id, display_name: displayName, role });
}

// ── Restauranter ──────────────────────────────────────────────────────────────
async function sbGetRestaurants() {
  const { data } = await sb.from('restaurants').select('*');
  return data || [];
}

async function sbGetRestaurantWithMenu(id) {
  const { data: restaurant } = await sb.from('restaurants').select('*').eq('id', id).single();
  if (!restaurant) return null;

  const { data: categories } = await sb
    .from('menu_categories')
    .select('id, name, menu_items(id, name, description, price)')
    .eq('restaurant_id', id)
    .order('id');

  restaurant.menu = (categories || []).map(cat => ({
    category: cat.name,
    items: (cat.menu_items || []).map(item => ({
      id:          item.id,
      name:        item.name,
      description: item.description,
      price:       item.price,
    })),
  }));

  return restaurant;
}

// ── Ordrer ────────────────────────────────────────────────────────────────────
async function sbSaveOrder(restaurantId, items, total) {
  const session = await sbGetSession();
  if (!session) return null;

  const { data: order, error } = await sb
    .from('orders')
    .insert({ user_id: session.user.id, restaurant_id: restaurantId || null, total })
    .select()
    .single();

  if (error || !order) return null;

  await sb.from('order_items').insert(
    items.map(c => ({
      order_id:   order.id,
      item_name:  c.name,
      item_price: c.price,
      quantity:   c.quantity,
    }))
  );

  return order;
}

async function sbGetOrders() {
  const session = await sbGetSession();
  if (!session) return [];
  const { data } = await sb
    .from('orders')
    .select('*, order_items(*), restaurants(name, image)')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });
  return data || [];
}

// ── Favoritter ────────────────────────────────────────────────────────────────
async function sbGetFavorites() {
  const session = await sbGetSession();
  if (!session) return [];
  const { data } = await sb.from('favorites').select('restaurant_id').eq('user_id', session.user.id);
  return (data || []).map(f => f.restaurant_id);
}

async function sbToggleFavorite(restaurantId) {
  const session = await sbGetSession();
  if (!session) return null;

  const favs = await sbGetFavorites();
  if (favs.includes(restaurantId)) {
    await sb.from('favorites').delete()
      .eq('user_id', session.user.id)
      .eq('restaurant_id', restaurantId);
    return false;
  } else {
    await sb.from('favorites').insert({ user_id: session.user.id, restaurant_id: restaurantId });
    return true;
  }
}
