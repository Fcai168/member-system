// API 层 - 连接 Supabase 真实数据库
const supabase = window.supabase ? supabase.createClient(CONFIG.supabase.url, CONFIG.supabase.anonKey) : null;

const API = {
  // 获取会员信息
  async getMemberInfo(phone) {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('phone', phone)
        .single();
      
      if (error) throw error;
      return data;
    } catch (e) {
      console.error('获取会员信息失败:', e);
      return null;
    }
  },

  // 领取代金券
  async claimCoupon(phone) {
    try {
      // 检查是否已有券
      const { data: existing } = await supabase
        .from('vouchers')
        .select('id')
        .eq('phone', phone)
        .eq('status', 'active')
        .single();
      
      if (existing) {
        return { success: false, message: '您已有待使用的代金券' };
      }
      
      // 生成券码
      const code = 'OC-' + Date.now().toString(36).toUpperCase();
      
      // 插入新券
      const { data, error } = await supabase
        .from('vouchers')
        .insert([{ phone, code, status: 'active' }])
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, coupon: data };
    } catch (e) {
      console.error('领取代金券失败:', e);
      return { success: false, message: e.message };
    }
  },

  // 获取优惠券列表
  async getCoupons(phone) {
    try {
      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .eq('phone', phone)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error('获取优惠券失败:', e);
      return [];
    }
  },

  // 提交充值订单
  async submitOrder(orderData) {
    try {
      const order = {
        id: `ORD${Date.now()}`,
        phone: orderData.phone,
        contact: orderData.contact,
        voucher_code: orderData.voucherCode,
        recharge_amount: orderData.rechargeAmount,
        voucher_discount: orderData.voucherDiscount,
        actual_pay: orderData.actualPay,
        payment_method: orderData.paymentMethod,
        payment_screenshot: orderData.screenshot,
        status: 'processing'
      };
      
      const { data, error } = await supabase
        .from('orders')
        .insert([order])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (e) {
      console.error('提交订单失败:', e);
      throw e;
    }
  },

  // 获取订单列表
  async getOrders(phone) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('phone', phone)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error('获取订单失败:', e);
      return [];
    }
  },

  // 获取网站设置
  async getSettings() {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*');
      
      if (error) throw error;
      
      // 转换为键值对
      const settings = {};
      data?.forEach(item => {
        settings[item.key] = item.value;
      });
      return settings;
    } catch (e) {
      console.error('获取设置失败:', e);
      return {};
    }
  },

  // 更新网站设置
  async updateSetting(key, value) {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ key, value });
      
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('更新设置失败:', e);
      return false;
    }
  }
};
