// 主逻辑文件 - 包含全局工具函数和页面交互逻辑

/**
 * 工具函数集合
 */
const Utils = {
  // 显示提示消息
  showToast(message, type = 'info', duration = 2000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // 复制文本到剪贴板
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast('已复制到剪贴板', 'success');
      return true;
    } catch (err) {
      // 降级方案
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.showToast('已复制到剪贴板', 'success');
      return true;
    }
  },

  // 格式化日期
  formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN');
  },

  // 格式化金额
  formatMoney(amount) {
    return `¥${Number(amount).toFixed(2)}`;
  },

  // 验证手机号
  validatePhone(phone) {
    return /^1[3-9]\d{9}$/.test(phone);
  },

  // 跳转到指定页面
  navigate(url) {
    window.location.href = url;
  },

  // 加载动画
  showLoading(container) {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = '<div class="spinner"></div>';
    container.appendChild(overlay);
    return overlay;
  },

  // 移除加载动画
  hideLoading(overlay) {
    if (overlay && overlay.parentNode) {
      overlay.remove();
    }
  }
};

// 将工具函数挂载到全局
window.Utils = Utils;

/**
 * 导航栏组件
 */
const Navbar = {
  init() {
    // 页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', () => {
      const backBtn = document.querySelector('.back-btn');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          window.history.back();
        });
      }
    });
  },

  update(pageTitle) {
    document.title = `${pageTitle} - ${CONFIG.PAGE_TITLE}`;
    const titleEl = document.querySelector('.page-title');
    if (titleEl) {
      titleEl.textContent = pageTitle;
    }
  }
};

// 初始化导航栏
Navbar.init();

/**
 * 页面切换动画
 */
const PageTransitions = {
  init() {
    // 监听所有链接点击
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (link && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const target = link.getAttribute('href');
        this.transitionTo(target);
      }
    });
  },

  transitionTo(targetUrl) {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    // 添加退出动画
    mainContent.classList.add('fade-out');
    
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 300);
  }
};

PageTransitions.init();

/**
 * 表单验证
 */
const FormValidation = {
  validatePhone(input) {
    const phone = input.value.trim();
    if (!phone) {
      return { valid: false, message: '请输入手机号' };
    }
    if (!Utils.validatePhone(phone)) {
      return { valid: false, message: '手机号格式不正确' };
    }
    return { valid: true, message: '' };
  },

  validateCoupon(couponId) {
    if (!couponId) {
      return { valid: false, message: '请选择代金券' };
    }
    return { valid: true, message: '' };
  },

  validateAmount(amount) {
    if (!amount || amount <= 0) {
      return { valid: false, message: '请选择充值金额' };
    }
    return { valid: true, message: '' };
  },

  validatePayment(method) {
    if (!method) {
      return { valid: false, message: '请选择支付方式' };
    }
    return { valid: true, message: '' };
  }
};

// 导出
window.FormValidation = FormValidation;
