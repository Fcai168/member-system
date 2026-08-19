-- Supabase Database Initialization Script
-- 易捷加油充值系统数据库表结构

-- 1. Settings表（网站设置）
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  banner TEXT DEFAULT '🎉 充值特惠 · 代金券限时领',
  announcement TEXT DEFAULT '欢迎使用充值服务，代金券限量发放中！',
  admin_password TEXT DEFAULT 'admin123',
  wechat_qr TEXT,
  alipay_qr TEXT,
  service_phone TEXT,
  service_link TEXT,
  service_time TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 初始化设置记录
INSERT INTO settings (id, banner, announcement, admin_password) 
VALUES (1, '🎉 充值特惠 · 代金券限时领', '欢迎使用充值服务，代金券限量发放中！', 'admin123')
ON CONFLICT (id) DO NOTHING;

-- 2. Vouchers表（代金券）
CREATE TABLE IF NOT EXISTS vouchers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  phone VARCHAR(11) NOT NULL,
  voucher_code VARCHAR(20) NOT NULL UNIQUE,
  referrer_code VARCHAR(20),
  amount DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_phone UNIQUE (phone)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_vouchers_phone ON vouchers(phone);
CREATE INDEX IF NOT EXISTS idx_vouchers_code ON vouchers(voucher_code);

-- 3. Orders表（订单）
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_no VARCHAR(30) NOT NULL UNIQUE,
  phone VARCHAR(11) NOT NULL,
  referrer_code VARCHAR(20),
  contact_name VARCHAR(50),
  voucher_code VARCHAR(20),
  amount DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  pay_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(20),
  screenshot TEXT,
  status VARCHAR(20) DEFAULT 'processing',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_orders_order_no ON orders(order_no);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- 4. 启用Row Level Security (RLS)
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 5. 创建Policy（允许所有操作）
CREATE POLICY "Allow all access on settings" ON settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access on vouchers" ON vouchers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access on orders" ON orders FOR ALL USING (true) WITH CHECK (true);

-- 6. 创建updated_at触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. 为各表创建触发器
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vouchers_updated_at ON vouchers;
CREATE TRIGGER update_vouchers_updated_at
  BEFORE UPDATE ON vouchers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 完成
SELECT 'Database initialization completed successfully!' AS status;
