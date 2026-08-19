// 二维码管理模块
const QRCodeManager = {
  wechatQR: null,
  alipayQR: null,
  
  // 初始化二维码
  async init() {
    try {
      const settings = await API.getSettings();
      this.wechatQR = settings.wechat_qr || '';
      this.alipayQR = settings.alipay_qr || '';
    } catch (e) {
      console.error('加载二维码失败:', e);
      // 使用默认占位图
      this.wechatQR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiM5OTkiPuaXr+acn+WtpOWbvuWQjeWKqOiLveWQhui0peWPkee6j+aIu+aYnuWTkOaIkOaZjuWKqOiLvea7heS8leWbvuazl+WtjOe7m+aIjumVjumFj+aItuS8muWQj+iLveWQhui0peWPkee6j+aIvuaYnuaWluWtkCk8L3RleHQ+PC9zdmc+';
      this.alipayQR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiM5OTkiPuWbvuWQjuWtkOaIkOaZjuWKqOiLveWQhui0peWPkee6j+aIu+aYnuWTkOaIkOaZjuWKqOiLvea7heS8leWbvuazl+WtjOe7m+aIjumFjumFj+aItuS8muWQj+iLveWQhui0peWPkee6j+aIvuaYnuaWtuWtsCk8L3RleHQ+PC9zdmc+';
    }
  },
  
  // 显示二维码
  showQR(method, amount) {
    const section = document.getElementById('qrCodeSection');
    const placeholder = document.getElementById('qrPlaceholder');
    const amountEl = document.getElementById('qrAmount');
    const indicator = document.getElementById('qrTypeIndicator');
    const typeIcon = document.getElementById('qrTypeIcon');
    const typeName = document.getElementById('qrTypeName');
    
    // 隐藏之前的二维码
    const existingImg = placeholder.querySelector('img');
    if (existingImg) existingImg.remove();
    
    // 设置金额
    amountEl.textContent = '¥' + amount;
    
    // 设置指示器样式
    indicator.className = 'qr-type-indicator ' + method;
    
    if (method === 'wechat') {
      typeIcon.textContent = '💚';
      typeName.textContent = '微信支付';
    } else {
      typeIcon.textContent = '💙';
      typeName.textContent = '支付宝';
    }
    
    // 显示二维码图片
    const qrImage = this[method === 'wechat' ? 'wechatQR' : 'alipayQR'];
    if (qrImage) {
      const img = document.createElement('img');
      img.src = qrImage;
      img.alt = method === 'wechat' ? '微信收款码' : '支付宝收款码';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      placeholder.appendChild(img);
    }
    
    // 显示区域
    section.classList.add('show');
  },
  
  // 隐藏二维码
  hideQR() {
    const section = document.getElementById('qrCodeSection');
    section.classList.remove('show');
  }
};
