/**
 * Robot Learning Blog - Custom Effects
 * 增强交互体验的自定义JavaScript效果
 */

(function() {
  'use strict';

  // ==================== 页面加载完成后执行 ====================
  document.addEventListener('DOMContentLoaded', function() {

    // 初始化所有特效
    initSmoothScroll();
    initResearchCardEffects();
    initHeaderAnimation();
    initCursorEffect();
    initScrollReveal();
    initTypingEffect();

    console.log('🤖 Robot Learning Blog - Custom effects loaded!');
  });

  // ==================== 平滑滚动 ====================
  function initSmoothScroll() {
    // 为所有锚点链接添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
          e.preventDefault();
          document.querySelector(href).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ==================== 研究卡片特效 ====================
  function initResearchCardEffects() {
    const cards = document.querySelectorAll('.research-card');

    cards.forEach(card => {
      // 鼠标移动视差效果
      card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          translateY(-10px)
          scale(1.02)
        `;
      });

      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
      });

      // 点击涟漪效果
      card.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        card.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // ==================== 头部动画 ====================
  function initHeaderAnimation() {
    let lastScroll = 0;
    const header = document.querySelector('.header');

    if (!header) return;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
      }

      if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // 向下滚动
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
      } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // 向上滚动
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
      }

      lastScroll = currentScroll;
    });
  }

  // ==================== 自定义光标效果 ====================
  function initCursorEffect() {
    // 检测是否为移动设备
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';
    document.body.appendChild(cursorDot);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // 平滑跟随动画
    function animateCursor() {
      // 外圈跟随
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';

      // 内点跟随（更快）
      dotX += (mouseX - dotX) * 0.3;
      dotY += (mouseY - dotY) * 0.3;
      cursorDot.style.left = dotX + 'px';
      cursorDot.style.top = dotY + 'px';

      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // 悬停交互元素时放大光标
    const interactiveElements = document.querySelectorAll('a, button, .research-card, .menu-item');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        cursorDot.classList.add('cursor-hover');
      });

      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        cursorDot.classList.remove('cursor-hover');
      });
    });
  }

  // ==================== 滚动显示动画 ====================
  function initScrollReveal() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // 观察所有需要动画的元素
    const elementsToReveal = document.querySelectorAll(
      '.research-card, .post-block, .site-state-item'
    );

    elementsToReveal.forEach((el, index) => {
      el.classList.add('reveal-hidden');
      el.style.transitionDelay = `${index * 0.1}s`;
      observer.observe(el);
    });
  }

  // ==================== 打字机效果（用于副标题） ====================
  function initTypingEffect() {
    const subtitle = document.querySelector('.site-subtitle');
    if (!subtitle) return;

    const originalText = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.opacity = '1';

    let charIndex = 0;

    function typeChar() {
      if (charIndex < originalText.length) {
        subtitle.textContent += originalText.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, 100);
      }
    }

    // 页面加载1秒后开始打字
    setTimeout(typeChar, 1000);
  }

  // ==================== 代码块复制按钮 ====================
  function initCodeCopyButton() {
    const codeBlocks = document.querySelectorAll('pre code');

    codeBlocks.forEach(block => {
      const pre = block.parentElement;
      const button = document.createElement('button');
      button.className = 'code-copy-btn';
      button.innerHTML = '<i class="fas fa-copy"></i>';
      button.title = 'Copy code';

      pre.style.position = 'relative';
      pre.appendChild(button);

      button.addEventListener('click', function() {
        const code = block.textContent;

        navigator.clipboard.writeText(code).then(() => {
          button.innerHTML = '<i class="fas fa-check"></i>';
          button.classList.add('copied');

          setTimeout(() => {
            button.innerHTML = '<i class="fas fa-copy"></i>';
            button.classList.remove('copied');
          }, 2000);
        });
      });
    });
  }

  // ==================== 粒子背景效果 ====================
  function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';

    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.3)';
        ctx.fill();
      }
    }

    // 创建粒子
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // 绘制连线
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.2 - distance / 750})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  // 可选：启用粒子背景（可能影响性能）
  // initParticles();

})();

// ==================== 添加涟漪效果的CSS ====================
const style = document.createElement('style');
style.textContent = `
  .ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(34, 211, 238, 0.6);
    width: 20px;
    height: 20px;
    margin-top: -10px;
    margin-left: -10px;
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }

  @keyframes ripple-animation {
    to {
      transform: scale(10);
      opacity: 0;
    }
  }

  .custom-cursor {
    position: fixed;
    width: 40px;
    height: 40px;
    border: 2px solid rgba(34, 211, 238, 0.6);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.2s ease, border-color 0.2s ease;
    transform: translate(-50%, -50%);
  }

  .custom-cursor-dot {
    position: fixed;
    width: 8px;
    height: 8px;
    background: rgba(34, 211, 238, 0.8);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
  }

  .custom-cursor.cursor-hover {
    transform: translate(-50%, -50%) scale(1.5);
    border-color: rgba(34, 211, 238, 1);
  }

  .custom-cursor-dot.cursor-hover {
    background: rgba(34, 211, 238, 1);
  }

  .header.scroll-down {
    transform: translateY(-100%);
    transition: transform 0.3s ease;
  }

  .header.scroll-up {
    transform: translateY(0);
    transition: transform 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  }

  .reveal-hidden {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  .reveal-visible {
    opacity: 1;
    transform: translateY(0);
  }

  .code-copy-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(6, 182, 212, 0.8);
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
    z-index: 10;
  }

  .code-copy-btn:hover {
    background: rgba(34, 211, 238, 1);
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(6, 182, 212, 0.5);
  }

  .code-copy-btn.copied {
    background: rgba(34, 197, 94, 0.8);
  }
`;
document.head.appendChild(style);
