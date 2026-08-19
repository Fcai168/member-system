// 客服Bot配置 - 元宝bot接入
const CUSTOMER_BOT = {
  // 平台类型
  platform: 'yuanbao',

  // Bot ID
  botId: 'bot_f95f9ac5f0394ad1945b5c0d21f04220',

  // 接入方式
  method: 'link', // link | iframe | redirect

  // 客服链接配置 - 元宝bot链接
  links: {
    yuanbao: 'https://bot_f95f9ac5f0394ad1945b5c0d21f04220.bot/',
    default: 'https://95388.cn.mt/online-chat/'
  },

  // 按钮配置
  button: {
    text: '联系元宝客服',
    icon: '🤖',
    position: 'fixed',
    bottom: 20,
    right: 20
  },

  // 欢迎消息
  welcomeMessage: '您好！我是易捷加油智能客服元宝，有什么可以帮您的？'
};

// 客服功能模块
const CustomerBot = {
  init() {
    this.addButton();
    this.bindEvents();
  },

  addButton() {
    const btn = document.createElement('div');
    btn.id = 'customer-bot-btn';
    btn.innerHTML = `<div class="bot-icon">${CUSTOMER_BOT.button.icon}</div><div class="bot-text">${CUSTOMER_BOT.button.text}</div>`;
    btn.style.cssText = `
      position: ${CUSTOMER_BOT.button.position};
      bottom: ${CUSTOMER_BOT.button.bottom}px;
      right: ${CUSTOMER_BOT.button.right}px;
      background: linear-gradient(135deg, #E53935 0%, #FF6F61 100%);
      color: white;
      padding: 12px 20px;
      border-radius: 25px;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(229, 57, 53, 0.4);
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s;
      z-index: 9999;
      font-size: 14px;
      font-weight: 500;
    `;
    document.body.appendChild(btn);
  },

  bindEvents() {
    const btn = document.getElementById('customer-bot-btn');
    if (btn) {
      btn.addEventListener('click', () => this.openChat());
    }
  },

  openChat() {
    const url = CUSTOMER_BOT.links.yuanbao || CUSTOMER_BOT.links.default;
    window.open(url, '_blank');
  }
};

document.addEventListener('DOMContentLoaded', () => CustomerBot.init());
