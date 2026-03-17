// 滚动动画 - Intersection Observer
document.addEventListener('DOMContentLoaded', function() {
  // 滚动触发动画
  const scrollElements = document.querySelectorAll('.scroll-animate');
  
  const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <=
      (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
  };
  
  const displayScrollElement = (element) => {
    element.classList.add('visible');
  };
  
  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 1.25)) {
        displayScrollElement(el);
      }
    });
  };
  
  // 初始检查
  handleScrollAnimation();
  
  // 滚动监听
  window.addEventListener('scroll', () => {
    handleScrollAnimation();
  });
  
  // 按钮点击反馈
  const buttons = document.querySelectorAll('.VPButton');
  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      this.style.animation = 'buttonPress 0.2s ease';
      setTimeout(() => {
        this.style.animation = '';
      }, 200);
    });
  });
  
  // 导航栏滚动效果
  const nav = document.querySelector('.VPNav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }
});
