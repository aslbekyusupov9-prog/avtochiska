-- =====================================================
-- Tozalik Ustasi — Supabase Schema
-- Bu SQL ni Supabase Dashboard > SQL Editor da bir marta ishga tushiring
-- =====================================================

-- 1. Asosiy jadval — barcha site ma'lumotlari bitta qatorda
CREATE TABLE IF NOT EXISTS site_data (
  id TEXT PRIMARY KEY DEFAULT 'main',
  orders JSONB NOT NULL DEFAULT '[]'::jsonb,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  services JSONB NOT NULL DEFAULT '[]'::jsonb,
  car_types JSONB NOT NULL DEFAULT '[]'::jsonb,
  reviews JSONB NOT NULL DEFAULT '[]'::jsonb,
  hero_content JSONB NOT NULL DEFAULT '{}'::jsonb,
  site_info JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mavjud jadvalga car_types ustunini qo'shish (agar bo'lmasa)
ALTER TABLE site_data ADD COLUMN IF NOT EXISTS car_types JSONB NOT NULL DEFAULT '[]'::jsonb;

-- 2. Realtime uchun REPLICA IDENTITY
ALTER TABLE site_data REPLICA IDENTITY FULL;

-- 3. Row Level Security yoqish
ALTER TABLE site_data ENABLE ROW LEVEL SECURITY;

-- 4. Barcha operatsiyalarga ruxsat (anon key bilan)
DROP POLICY IF EXISTS "allow_all" ON site_data;
CREATE POLICY "allow_all" ON site_data
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Boshlang'ich qator
INSERT INTO site_data (id) VALUES ('main')
ON CONFLICT (id) DO NOTHING;

-- 6. updated_at avtomatik yangilash uchun trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_site_data_updated_at ON site_data;
CREATE TRIGGER update_site_data_updated_at
  BEFORE UPDATE ON site_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Telegram botga start bosgan foydalanuvchilar jadvali
CREATE TABLE IF NOT EXISTS telegram_subscribers (
  chat_id TEXT PRIMARY KEY,
  first_name TEXT,
  username TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS yoqish
ALTER TABLE telegram_subscribers ENABLE ROW LEVEL SECURITY;

-- Barcha operatsiyalarga ruxsat (anon key orqali)
DROP POLICY IF EXISTS "allow_all_subscribers" ON telegram_subscribers;
CREATE POLICY "allow_all_subscribers" ON telegram_subscribers
  FOR ALL
  USING (true)
  WITH CHECK (true);


-- =====================================================
-- Tekshirish: SELECT * FROM site_data;
-- =====================================================
