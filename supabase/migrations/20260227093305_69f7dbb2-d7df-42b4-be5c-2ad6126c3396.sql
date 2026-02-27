
-- Fix all RLS policies to PERMISSIVE (currently all are RESTRICTIVE)

-- PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins view all profiles" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON profiles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- USER_ROLES
DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;

CREATE POLICY "Users can view own roles" ON user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON user_roles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- WALLETS
DROP POLICY IF EXISTS "Users view own wallet" ON wallets;
DROP POLICY IF EXISTS "Users update own wallet" ON wallets;
DROP POLICY IF EXISTS "System can insert wallets" ON wallets;

CREATE POLICY "Users view own wallet" ON wallets FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users update own wallet" ON wallets FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "System can insert wallets" ON wallets FOR INSERT WITH CHECK (true);

-- WALLET_TRANSACTIONS
DROP POLICY IF EXISTS "Users view own transactions" ON wallet_transactions;
DROP POLICY IF EXISTS "Users insert own transactions" ON wallet_transactions;

CREATE POLICY "Users view own transactions" ON wallet_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own transactions" ON wallet_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- RESTAURANTS
DROP POLICY IF EXISTS "Anyone can view restaurants" ON restaurants;
DROP POLICY IF EXISTS "Vendors can insert restaurant" ON restaurants;
DROP POLICY IF EXISTS "Vendors can update restaurant" ON restaurants;
DROP POLICY IF EXISTS "Vendors can delete restaurant" ON restaurants;

CREATE POLICY "Anyone can view restaurants" ON restaurants FOR SELECT USING (true);
CREATE POLICY "Vendors can insert restaurant" ON restaurants FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Vendors can update restaurant" ON restaurants FOR UPDATE TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Vendors can delete restaurant" ON restaurants FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- MENU_ITEMS
DROP POLICY IF EXISTS "Anyone can view menu items" ON menu_items;
DROP POLICY IF EXISTS "Vendors can insert menu items" ON menu_items;
DROP POLICY IF EXISTS "Vendors can update menu items" ON menu_items;
DROP POLICY IF EXISTS "Vendors can delete menu items" ON menu_items;

CREATE POLICY "Anyone can view menu items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Vendors can insert menu items" ON menu_items FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM restaurants WHERE restaurants.id = menu_items.restaurant_id AND restaurants.owner_id = auth.uid()));
CREATE POLICY "Vendors can update menu items" ON menu_items FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM restaurants WHERE restaurants.id = menu_items.restaurant_id AND restaurants.owner_id = auth.uid()));
CREATE POLICY "Vendors can delete menu items" ON menu_items FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM restaurants WHERE restaurants.id = menu_items.restaurant_id AND restaurants.owner_id = auth.uid()));

-- ORDERS
DROP POLICY IF EXISTS "Students view own orders" ON orders;
DROP POLICY IF EXISTS "Students create orders" ON orders;
DROP POLICY IF EXISTS "Students update own orders" ON orders;
DROP POLICY IF EXISTS "Vendors view restaurant orders" ON orders;
DROP POLICY IF EXISTS "Vendors update restaurant orders" ON orders;
DROP POLICY IF EXISTS "Riders view assigned orders" ON orders;
DROP POLICY IF EXISTS "Riders update assigned orders" ON orders;
DROP POLICY IF EXISTS "Admins view all orders" ON orders;

CREATE POLICY "Students view own orders" ON orders FOR SELECT TO authenticated USING (auth.uid() = student_id);
CREATE POLICY "Students create orders" ON orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students update own orders" ON orders FOR UPDATE TO authenticated USING (auth.uid() = student_id);
CREATE POLICY "Vendors view restaurant orders" ON orders FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM restaurants WHERE restaurants.id = orders.restaurant_id AND restaurants.owner_id = auth.uid()));
CREATE POLICY "Vendors update restaurant orders" ON orders FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM restaurants WHERE restaurants.id = orders.restaurant_id AND restaurants.owner_id = auth.uid()));
CREATE POLICY "Riders view assigned orders" ON orders FOR SELECT TO authenticated USING (auth.uid() = rider_id);
CREATE POLICY "Riders update assigned orders" ON orders FOR UPDATE TO authenticated USING (auth.uid() = rider_id);
CREATE POLICY "Admins view all orders" ON orders FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- ORDER_ITEMS
DROP POLICY IF EXISTS "Users view own order items" ON order_items;
DROP POLICY IF EXISTS "Users insert order items" ON order_items;
DROP POLICY IF EXISTS "Vendors view order items" ON order_items;
DROP POLICY IF EXISTS "Admins view all order items" ON order_items;

CREATE POLICY "Users view own order items" ON order_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.student_id = auth.uid() OR orders.rider_id = auth.uid())));
CREATE POLICY "Users insert order items" ON order_items FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.student_id = auth.uid()));
CREATE POLICY "Vendors view order items" ON order_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM orders o JOIN restaurants r ON r.id = o.restaurant_id WHERE o.id = order_items.order_id AND r.owner_id = auth.uid()));
CREATE POLICY "Admins view all order items" ON order_items FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- DISPATCHES
DROP POLICY IF EXISTS "Students view own dispatches" ON dispatches;
DROP POLICY IF EXISTS "Students create dispatches" ON dispatches;
DROP POLICY IF EXISTS "Riders view assigned dispatches" ON dispatches;
DROP POLICY IF EXISTS "Riders update assigned dispatches" ON dispatches;
DROP POLICY IF EXISTS "Admins view all dispatches" ON dispatches;

CREATE POLICY "Students view own dispatches" ON dispatches FOR SELECT TO authenticated USING (auth.uid() = student_id);
CREATE POLICY "Students create dispatches" ON dispatches FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Riders view assigned dispatches" ON dispatches FOR SELECT TO authenticated USING (auth.uid() = rider_id);
CREATE POLICY "Riders update assigned dispatches" ON dispatches FOR UPDATE TO authenticated USING (auth.uid() = rider_id);
CREATE POLICY "Admins view all dispatches" ON dispatches FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- TRIP_ROUTES
DROP POLICY IF EXISTS "Anyone can view routes" ON trip_routes;
DROP POLICY IF EXISTS "Admins can insert routes" ON trip_routes;
DROP POLICY IF EXISTS "Admins can update routes" ON trip_routes;
DROP POLICY IF EXISTS "Admins can delete routes" ON trip_routes;

CREATE POLICY "Anyone can view routes" ON trip_routes FOR SELECT USING (true);
CREATE POLICY "Admins can insert routes" ON trip_routes FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update routes" ON trip_routes FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete routes" ON trip_routes FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- TRIP_BOOKINGS
DROP POLICY IF EXISTS "Students view own bookings" ON trip_bookings;
DROP POLICY IF EXISTS "Students create bookings" ON trip_bookings;

CREATE POLICY "Students view own bookings" ON trip_bookings FOR SELECT TO authenticated USING (auth.uid() = student_id);
CREATE POLICY "Students create bookings" ON trip_bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);

-- PLATFORM_SETTINGS
DROP POLICY IF EXISTS "Authenticated users can read settings" ON platform_settings;
DROP POLICY IF EXISTS "Admins can insert settings" ON platform_settings;
DROP POLICY IF EXISTS "Admins can update settings" ON platform_settings;

CREATE POLICY "Authenticated users can read settings" ON platform_settings FOR SELECT USING (true);
CREATE POLICY "Admins can insert settings" ON platform_settings FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update settings" ON platform_settings FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Enable realtime for orders and dispatches
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE dispatches;
