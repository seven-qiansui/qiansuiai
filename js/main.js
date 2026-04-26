// ============================================================
// 千岁 AI - 核心交互 v2
// ============================================================
document.addEventListener("DOMContentLoaded", function () {

  // --- 0. 鼠标跟随金色光晕 ---
  var cursorGlow = document.querySelector(".cursor-glow");
  if (!cursorGlow) {
    cursorGlow = document.createElement("div");
    cursorGlow.className = "cursor-glow";
    document.body.appendChild(cursorGlow);
  }
  var mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
  document.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.classList.add("active");
  });
  document.addEventListener("mouseleave", function () {
    cursorGlow.classList.remove("active");
  });
  function animateCursorGlow() {
    // 平滑跟随 (ease factor 0.12)
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    cursorGlow.style.left = glowX + "px";
    cursorGlow.style.top = glowY + "px";
    requestAnimationFrame(animateCursorGlow);
  }
  animateCursorGlow();

  // --- 1. 导航栏收缩 + Hero 视差 ---
  var navbar = document.getElementById("navbar");
  var heroOrb = document.querySelector(".hero-visual-orb");
  function updateNav() {
    if (!navbar) return;
    if (window.scrollY > 50) { navbar.classList.add("shrink"); }
    else { navbar.classList.remove("shrink"); }
    // Hero orb 视差 + 内容淡出
    if (window.scrollY < window.innerHeight) {
      var p = window.scrollY / window.innerHeight;
      if (heroOrb) {
        heroOrb.style.transform = 'translate(-50%, calc(-50% + ' + (p * 60) + 'px)) scale(' + (1 + p * 0.15) + ')';
        heroOrb.style.opacity = 1 - p * 1.5;
      }
      var heroContent = document.querySelector(".hero-content");
      if (heroContent) {
        heroContent.style.opacity = 1 - p * 1.8;
        heroContent.style.transform = 'translateY(' + (p * -30) + 'px)';
      }
    }
  }
  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();

  // --- 2. 滚动进度条 ---
  var bar = document.getElementById("scrollProgress");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "scrollProgress";
    bar.className = "scroll-progress";
    document.body.prepend(bar);
  }
  function updateBar() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (h <= 0) { bar.style.width = "0"; return; }
    bar.style.width = (window.scrollY / h * 100) + "%";
  }
  window.addEventListener("scroll", updateBar, { passive: true });
  updateBar();

  // --- 3. 滚动显示动画 ---
  var reveals = document.querySelectorAll(".reveal:not(.visible)");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add("visible");
          io.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.12 });
    for (var i = 0; i < reveals.length; i++) { io.observe(reveals[i]); }
  } else {
    for (var i = 0; i < reveals.length; i++) { reveals[i].classList.add("visible"); }
  }

  // --- 3.5 打字机词轮播 ---
  var twWord = document.getElementById("twWord");
  if (twWord) {
    var twWords = ["AI 视觉设计", "视频制作", "社媒运营", "企业 AI 服务"];
    var twIndex = 0;
    setInterval(function () {
      twIndex = (twIndex + 1) % twWords.length;
      twWord.classList.add("switching");
      setTimeout(function () {
        twWord.textContent = twWords[twIndex];
        twWord.classList.remove("switching");
      }, 200);
    }, 3000);
  }

  // --- 4. 数字递增动画 ---
  var counters = document.querySelectorAll(".count-up");
  if ("IntersectionObserver" in window && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          animateCount(entries[i].target);
          co.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.5 });
    for (var i = 0; i < counters.length; i++) { co.observe(counters[i]); }
  }

  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-target"));
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1200;
    var start = performance.now();
    function tick(now) {
      var p = Math.min((now - start) / duration, 1);
      var ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(target * ease) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // --- 5. 移动端菜单 ---
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      toggle.classList.toggle("active");
      links.classList.toggle("open");
    });
    var navLinks = links.querySelectorAll(".nav-link, .nav-cta");
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener("click", function () {
        toggle.classList.remove("active");
        links.classList.remove("open");
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("open")) {
        toggle.classList.remove("active");
        links.classList.remove("open");
      }
    });
  }

  // --- 6. 留言表单 ---
  var SERVER_SANG_KEY = "SCT339454TmNbQOCLB6AMVJnpGLtDpTzaL";
  var form = document.getElementById("inquiryForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("name").value.trim();
      var contact = document.getElementById("contact").value.trim();
      var service = document.getElementById("service");
      var serviceText = service.options[service.selectedIndex].text;
      var budget = document.getElementById("budget");
      var budgetText = budget.selectedIndex > 0 ? budget.options[budget.selectedIndex].text : "未选择";
      var message = document.getElementById("message").value.trim();
      if (!name || !contact || !service.value) {
        alert("请填写称呼和联系方式");
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      btn.textContent = "提交中...";
      btn.disabled = true;

      if (SERVER_SANG_KEY) {
        var formData = new URLSearchParams();
        formData.append("title", "新咨询 - " + name + " | " + serviceText);
        formData.append("desp",
          "称呼: " + name + "\n\n" +
          "联系方式: " + contact + "\n\n" +
          "服务类型: " + serviceText + "\n\n" +
          "预算: " + budgetText + "\n\n" +
          "需求: " + (message || "未填写")
        );
        fetch("https://sctapi.ftqq.com/" + SERVER_SANG_KEY + ".send", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString()
        }).then(function(res) { return res.json(); })
        .then(function(data) {
          if (data.code === 0) {
            alert("提交成功 我们会尽快联系你");
            form.reset();
          } else {
            alert("提交失败 请稍后重试");
          }
        }).catch(function() {
          alert("提交成功 我们会尽快联系你");
          form.reset();
        }).finally(function() {
          btn.textContent = "提交咨询";
          btn.disabled = false;
        });
      } else {
        alert("提交成功 我们会尽快联系你");
        form.reset();
        btn.textContent = "提交咨询";
        btn.disabled = false;
      }
    });
  }

  // --- 7. 案例筛选 ---
  var filterBtns = document.querySelectorAll(".filter-btn");
  var caseCards = document.querySelectorAll(".case-card");
  // 默认只显示第一个分类
  if (filterBtns.length > 0 && caseCards.length > 0) {
    var defaultFilter = filterBtns[0].getAttribute("data-filter");
    for (var k = 0; k < caseCards.length; k++) {
      if (caseCards[k].getAttribute("data-category") !== defaultFilter) {
        caseCards[k].style.display = "none";
      }
    }
  }
  for (var i = 0; i < filterBtns.length; i++) {
    filterBtns[i].addEventListener("click", function () {
      var filter = this.getAttribute("data-filter");
      for (var j = 0; j < filterBtns.length; j++) { filterBtns[j].classList.remove("active"); }
      this.classList.add("active");
      for (var k = 0; k < caseCards.length; k++) {
        if (caseCards[k].getAttribute("data-category") === filter) {
          caseCards[k].style.display = "";
        } else {
          caseCards[k].style.display = "none";
        }
      }
    });
  }

  // --- 8. 案例详情弹窗 ---
  var ecommerceDeliverables = [
    { name: "产品白底图", count: "1 张" },
    { name: "电商主图", count: "4 张" },
    { name: "详情页设计", count: "10P（一套）" },
    { name: "精修调色", count: "5 张" }
  ];
  // 视频 - 按子类型
  var videoShort = [
    { name: "主图视频", count: "15-30 秒" },
    { name: "产品展示", count: "卖点演示" },
    { name: "多平台适配", count: "尺寸兼容" },
    { name: "首图视频", count: "1 条" }
  ];
  var videoBrand = [
    { name: "品牌宣传片", count: "30-60 秒" },
    { name: "产品介绍", count: "多风格定制" },
    { name: "品牌形象", count: "视觉输出" },
    { name: "多平台适配", count: "全渠道" }
  ];
  var videoProduct = [
    { name: "功能动态展示", count: "3D/实拍" },
    { name: "使用场景还原", count: "场景演示" },
    { name: "效果对比展示", count: "数据可视化" },
    { name: "多平台适配", count: "全渠道" }
  ];
  var videoFeed = [
    { name: "抖音/快手适配", count: "竖版" },
    { name: "高转化素材", count: "多版本" },
    { name: "AB 测试", count: "数据优化" },
    { name: "复盘报告", count: "1 份" }
  ];
  // 社媒 - 按子类型
  var socialXHS = [
    { name: "种草笔记撰写", count: "8 篇/月" },
    { name: "选题策划", count: "内容规划" },
    { name: "关键词 SEO", count: "持续优化" },
    { name: "数据复盘", count: "月度报告" }
  ];
  var socialWX = [
    { name: "行业干货文章", count: "4 篇/月" },
    { name: "产品软文推广", count: "2 篇/月" },
    { name: "热点解读分析", count: "及时跟进" },
    { name: "品牌故事撰写", count: "1 篇/月" }
  ];
  var socialContent = [
    { name: "月度内容规划", count: "完整方案" },
    { name: "热点追踪", count: "及时借势" },
    { name: "内容日历", count: "排期管理" },
    { name: "发布时机优化", count: "数据驱动" }
  ];
  var socialFans = [
    { name: "评论互动", count: "日常回复" },
    { name: "私信处理", count: "及时跟进" },
    { name: "粉丝活动策划", count: "月度策划" },
    { name: "用户反馈收集", count: "定期汇总" }
  ];
  // 企业AI - 按子类型
  var aiTools = [
    { name: "需求分析评估", count: "完整报告" },
    { name: "工具选型", count: "对比方案" },
    { name: "部署配置", count: "环境搭建" },
    { name: "使用培训", count: "文档输出" }
  ];
  var aiWorkflow = [
    { name: "流程梳理", count: "诊断报告" },
    { name: "自动化方案", count: "定制设计" },
    { name: "脚本开发", count: "集成部署" },
    { name: "效果追踪", count: "持续优化" }
  ];
  var aiTrain = [
    { name: "AI 基础概念", count: "全员普及" },
    { name: "工具实操", count: "上机演练" },
    { name: "场景分享", count: "行业案例" },
    { name: "持续答疑", count: "长期跟进" }
  ];
  var aiCustom = [
    { name: "业务场景分析", count: "深度调研" },
    { name: "定制方案设计", count: "专项规划" },
    { name: "原型开发测试", count: "迭代验证" },
    { name: "持续优化", count: "长期跟进" }
  ];
  var caseData = {
    "ecommerce-1": { title: "护肤品视觉项目", desc: "AI 生成背景 人工精修", deliverables: ecommerceDeliverables },
    "ecommerce-2": { title: "3C 数码详情页项目", desc: "完整板块设计 卖点可视化", deliverables: ecommerceDeliverables },
    "ecommerce-3": { title: "女装品牌店铺装修项目", desc: "首页 活动页 品牌 VI 统一输出", deliverables: ecommerceDeliverables },
    "ecommerce-4": { title: "零食品牌视觉全案", desc: "主图 详情页 活动海报统一输出", deliverables: ecommerceDeliverables },
    "ecommerce-5": { title: "家居产品展示项目", desc: "场景合成 去背景 批量精修", deliverables: ecommerceDeliverables },
    "ecommerce-6": { title: "母婴用品视觉项目", desc: "温馨 ins 风 多 SKU 统一视觉风格", deliverables: ecommerceDeliverables },
    "ecommerce-7": { title: "运动装备视觉项目", desc: "卖点可视化 场景渲染 功能演示图", deliverables: ecommerceDeliverables },
    "ecommerce-8": { title: "宠物食品品牌项目", desc: "IP 形象设计 产品包装 详情页一体化", deliverables: ecommerceDeliverables },
    "video-1": { title: "品牌宣传片项目", desc: "产品展示 多平台适配", deliverables: videoBrand },
    "video-2": { title: "信息流广告项目", desc: "多版本 AB 测试 高转化素材制作", deliverables: videoFeed },
    "video-3": { title: "3C 开箱视频项目", desc: "AI 生成脚本 产品展示与教程", deliverables: videoShort },
    "video-4": { title: "女装穿搭视频项目", desc: "多套搭配展示 场景切换 节奏感剪辑", deliverables: videoShort },
    "video-5": { title: "家电演示视频项目", desc: "功能演示 场景还原 对比效果展示", deliverables: videoProduct },
    "video-6": { title: "运动品牌广告片项目", desc: "动感剪辑 高燃配乐 多场景切换", deliverables: videoProduct },
    "video-7": { title: "宠物用品视频项目", desc: "产品展示 使用演示", deliverables: videoShort },
    "video-8": { title: "企业宣传片项目", desc: "企业形象展示 团队介绍 文化输出", deliverables: videoBrand },
    "social-1": { title: "小红书运营项目", desc: "粉丝增长 爆文产出", deliverables: socialXHS },
    "social-2": { title: "公众号代运营项目", desc: "深度内容创作 定期发布", deliverables: socialWX },
    "social-3": { title: "全平台内容项目", desc: "公众号 小红书 抖音同步运营", deliverables: socialContent },
    "social-4": { title: "种草笔记运营项目", desc: "穿搭种草笔记 爆款内容", deliverables: socialXHS },
    "social-5": { title: "美食内容策划项目", desc: "测评种草 探店内容 粉丝互动", deliverables: socialContent },
    "social-6": { title: "家居内容运营项目", desc: "好物推荐 种草转化 数据复盘", deliverables: socialWX },
    "social-7": { title: "健身社交运营项目", desc: "运动干货 打卡活动 社群维护", deliverables: socialFans },
    "social-8": { title: "宠物 IP 账号项目", desc: "萌宠人设打造 日常内容更新", deliverables: socialFans },
    "ai-1": { title: "电商团队 AI 工作流项目", desc: "选品到上架全流程自动化", deliverables: aiWorkflow },
    "ai-2": { title: "企业 AI 培训项目", desc: "团队培训 AI 工具实操", deliverables: aiTrain },
    "ai-3": { title: "企业 AI 定制项目", desc: "业务场景分析 原型开发与测试", deliverables: aiCustom },
    "ai-4": { title: "智能客服系统项目", desc: "自动化客服 响应效率提升", deliverables: aiTools },
    "ai-5": { title: "文案团队 AI 落地项目", desc: "内容生产提效 AI 工具部署", deliverables: aiTools },
    "ai-6": { title: "电商数据 AI 分析项目", desc: "销售预测 用户画像 自动报表", deliverables: aiCustom },
    "ai-7": { title: "设计团队 AI 辅助项目", desc: "AI 辅助设计 批量出图 效率提升", deliverables: aiTools },
    "ai-8": { title: "营销团队 AI 部署项目", desc: "智能投放 内容生成 精准营销", deliverables: aiWorkflow }
  };

  var _caseModal = document.getElementById("caseModal");
  var _caseTitle = document.getElementById("caseModalTitle");
  var _caseDesc = document.getElementById("caseModalDesc");
  var _caseDeliverables = document.getElementById("caseDeliverables");

  // 全局函数（供 HTML onclick 调用）
  window.openCaseModal = function (eOrId, id) {
    var e = (eOrId instanceof Event) ? eOrId : null;
    var realId = id || eOrId;
    if (e) e.preventDefault();
    var data = caseData[realId];
    if (!data || !_caseModal) return;
    _caseTitle.textContent = data.title;
    _caseDesc.textContent = data.desc;
    var html = "";
    for (var i = 0; i < data.deliverables.length; i++) {
      var d = data.deliverables[i];
      html += '<div class="case-deliverable"><div class="del-icon"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div><div class="del-name">' + d.name + '</div><div class="del-count">' + d.count + '</div></div>';
    }
    _caseDeliverables.innerHTML = html;
    _caseModal.classList.add("active");
  };

  window.closeCaseModal = function () {
    if (_caseModal) _caseModal.classList.remove("active");
  };

  // 点击案例卡片
  for (var c = 0; c < caseCards.length; c++) {
    caseCards[c].style.cursor = "pointer";
    caseCards[c].addEventListener("click", function () {
      var id = this.getAttribute("data-case-id");
      if (window.innerWidth < 768) {
        window.location.href = "contact.html";
      } else {
        window.openCaseModal(id);
      }
    });
  }

  // 点击弹窗背景关闭
  if (_caseModal) {
    _caseModal.addEventListener("click", function (e) {
      if (e.target === _caseModal) window.closeCaseModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") window.closeCaseModal();
    });
  }


});

// --- 6. QR 弹窗 ---
function openQRModal(type) {
  var modal = document.getElementById("qrModal");
  var img = document.getElementById("qrImage");
  var txt = document.getElementById("qrText");
  if (!modal || !img || !txt) return;
  if (type === "wechat") {
    img.src = "wechat-qr.jpg";
    txt.textContent = "扫码添加微信";
  } else if (type === "official") {
    img.src = "wechat-official.jpg";
    txt.textContent = "关注公众号";
  }
  modal.classList.add("active");
}
function closeQRModal() {
  var modal = document.getElementById("qrModal");
  if (modal) modal.classList.remove("active");
}
document.addEventListener("click", function (e) {
  var modal = document.getElementById("qrModal");
  if (e.target === modal) closeQRModal();
});

// 联系卡片悬停自动弹出二维码
(function () {
  var timer = null;
  var modal = document.getElementById('qrModal');
  var cards = document.querySelectorAll('.contact-hover-qr');
  var hideTimer = null;
  if (!modal) return;

  function safeOpen(type) {
    openQRModal(type);
  }
  function safeClose() {
    hideTimer = setTimeout(function () {
      closeQRModal();
    }, 200);
  }
  function cancelClose() {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  }

  // 弹窗区域：离开时关闭
  modal.addEventListener('mouseleave', function () {
    safeClose();
  });
  modal.addEventListener('mouseenter', cancelClose);

  cards.forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      var qrType = card.getAttribute('data-qr');
      cancelClose();
      timer = setTimeout(function () {
        safeOpen(qrType);
      }, 300);
    });
    card.addEventListener('mouseleave', function () {
      if (timer) { clearTimeout(timer); timer = null; }
      safeClose();
    });
  });
})();

// --- 7. 星空 + 星座背景 ---
(function () {
  var canvas = document.createElement("canvas");
  canvas.id = "wireCanvas";
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "-1";
  document.body.appendChild(canvas);

  var ctx = canvas.getContext("2d");
  var dpr = window.devicePixelRatio || 1;
  var width, height;

  var bgStars = [];
  var constellations = [];
  var activeConstellations = [];
  var BG_COUNT = 400;
  var REGEN_INTERVAL = 15;
  var reGenTimer = 0;

  var REAL_CONSTELLATIONS = {
    "Orion":       [[0,0],[0.3,0.1],[0.5,0.15],[0.7,0.2],[0.9,0.25],[0.45,0.4],[0.5,0.45],[0.55,0.5],[0.45,0.6],[0.55,0.65]],
    "UrsaMajor":   [[0,0],[0.2,0.05],[0.35,0.15],[0.5,0.1],[0.6,0.2],[0.7,0.15],[0.8,0.1],[0.35,0.3],[0.5,0.35]],
    "Cassiopeia":  [[0,0],[0.15,0.3],[0.35,0.1],[0.55,0.35],[0.7,0.05],[0.85,0.25]],
    "Scorpius":    [[0,0],[0.1,0.1],[0.15,0.2],[0.2,0.35],[0.25,0.4],[0.3,0.5],[0.4,0.55],[0.5,0.5],[0.6,0.6],[0.7,0.55],[0.8,0.7]],
    "Leo":         [[0,0],[0.15,0.1],[0.3,0.05],[0.4,0.15],[0.35,0.3],[0.2,0.35],[0.5,0.4],[0.6,0.35],[0.7,0.5]],
    "Cygnus":      [[0.4,0],[0.45,0.15],[0.5,0.3],[0.55,0.45],[0.6,0.6],[0.2,0.3],[0.8,0.3]],
    "Lyra":        [[0,0],[0.15,0.1],[0.3,0],[0.4,0.15],[0.2,0.2],[0.25,0.35],[0.15,0.5],[0.3,0.45]],
    "Aquila":      [[0.5,0],[0.3,0.2],[0.7,0.2],[0.5,0.4],[0.2,0.5],[0.8,0.5],[0.5,0.7]],
    "Taurus":      [[0,0],[0.15,0.1],[0.3,0.05],[0.45,0.15],[0.6,0.1],[0.2,0.3],[0.4,0.35],[0.6,0.3]],
    "Gemini":      [[0,0],[0.1,0.15],[0.15,0.3],[0.2,0.45],[0.25,0.6],[0.7,0],[0.6,0.15],[0.55,0.3],[0.5,0.45],[0.45,0.6]],
    "Pegasus":     [[0,0],[0.3,0],[0.3,0.3],[0,0.3],[0.15,0.15],[0.5,0.15],[0.6,0.3],[0.7,0.45],[0.8,0.6]],
    "Draco":       [[0,0],[0.1,0.1],[0.2,0.05],[0.3,0.15],[0.35,0.3],[0.3,0.45],[0.4,0.5],[0.5,0.55],[0.6,0.65],[0.7,0.6],[0.8,0.7]]
  };

  function createBgStars() {
    bgStars = [];
    var count = window.innerWidth < 768 ? 150 : 400;
    for (var i = 0; i < count; i++) {
      bgStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.2 + 0.2,
        alpha: Math.random() * 0.5 + 0.1,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.003 + 0.002
      });
    }
  }

  function buildConstellation() {
    var keys = Object.keys(REAL_CONSTELLATIONS);
    var name = keys[Math.floor(Math.random() * keys.length)];
    var data = REAL_CONSTELLATIONS[name];
    if (!data) return null;
    var cx = Math.random() * width * 0.5 + width * 0.25;
    var cy = Math.random() * height * 0.5 + height * 0.2;
    var scale = 60 + Math.random() * 80;
    var rotation = Math.random() * Math.PI * 2;
    var pts = [];
    for (var j = 0; j < data.length; j++) {
      var px = data[j][0] - 0.5;
      var py = data[j][1] - 0.5;
      var rx = px * Math.cos(rotation) - py * Math.sin(rotation);
      var ry = px * Math.sin(rotation) + py * Math.cos(rotation);
      pts.push({
        x: cx + rx * scale,
        y: cy + ry * scale,
        size: Math.random() * 1.0 + 0.6,
        phase: Math.random() * Math.PI * 2,
        breatheSpeed: Math.random() * 0.004 + 0.003
      });
    }
    // 连线：最近邻
    var edges = [];
    for (var j = 0; j < pts.length; j++) {
      var minDist = Infinity, nearIdx = -1;
      for (var k = 0; k < pts.length; k++) {
        if (k === j) continue;
        var dx = pts[j].x - pts[k].x;
        var dy = pts[j].y - pts[k].y;
        var d = dx * dx + dy * dy;
        if (d < minDist) { minDist = d; nearIdx = k; }
      }
      if (nearIdx > -1) {
        var pair = [Math.min(j, nearIdx), Math.max(j, nearIdx)];
        var exists = false;
        for (var e = 0; e < edges.length; e++) {
          if (edges[e][0] === pair[0] && edges[e][1] === pair[1]) { exists = true; break; }
        }
        if (!exists) edges.push(pair);
      }
    }
    return { name: name, points: pts, edges: edges, phase: Math.random() * Math.PI * 2, breatheSpeed: Math.random() * 0.003 + 0.002 };
  }

  function pickConstellations() {
    constellations = [];
    activeConstellations = [];
    var count = 4 + Math.floor(Math.random() * 2); // 4-5 个
    for (var i = 0; i < count; i++) {
      var c = buildConstellation();
      if (c) { constellations.push(c); activeConstellations.push(c.name); }
    }
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    createBgStars();
  }

  resize();
  pickConstellations();
  window.addEventListener("resize", function () { resize(); pickConstellations(); });

  function draw(timestamp) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
    var t = timestamp || 0;

    // 背景星星 — 暖金色调呼吸闪烁
    for (var i = 0; i < bgStars.length; i++) {
      var s = bgStars[i];
      var a = s.alpha + Math.sin(t * s.speed + s.phase) * 0.2;
      a = Math.max(0.05, Math.min(1, a));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(230,210,170," + a + ")";
      ctx.fill();
    }

    // 星座 — 金色整体呼吸 + 单星呼吸
    for (var i = 0; i < constellations.length; i++) {
      var c = constellations[i];
      var groupPulse = Math.sin(t * c.breatheSpeed + c.phase) * 0.5 + 0.5; // 0~1

      // 连线 - 香槟金色
      var lineAlpha = 0.03 + groupPulse * 0.06;
      ctx.strokeStyle = "rgba(201,169,110," + lineAlpha + ")";
      ctx.lineWidth = 0.5;
      for (var j = 0; j < c.edges.length; j++) {
        ctx.beginPath();
        ctx.moveTo(c.points[c.edges[j][0]].x, c.points[c.edges[j][0]].y);
        ctx.lineTo(c.points[c.edges[j][1]].x, c.points[c.edges[j][1]].y);
        ctx.stroke();
      }

      // 星星 — 各自呼吸
      for (var j = 0; j < c.points.length; j++) {
        var p = c.points[j];
        var dotAlpha = 0.08 + Math.sin(t * p.breatheSpeed + p.phase) * 0.12 + groupPulse * 0.12;
        dotAlpha = Math.max(0.04, Math.min(0.7, dotAlpha));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(223,192,138," + dotAlpha + ")";
        ctx.fill();
      }
    }

    // 定时随机替换一个星座
    reGenTimer += 1 / 60;
    if (reGenTimer >= REGEN_INTERVAL) {
      reGenTimer = 0;
      var idx = Math.floor(Math.random() * constellations.length);
      var c = buildConstellation();
      if (c) { constellations[idx] = c; }
    }
  }

  var animPaused = false;
  document.addEventListener("visibilitychange", function () {
    animPaused = document.hidden;
    if (!animPaused) requestAnimationFrame(loop);
  });

  function loop(ts) {
    if (animPaused) return;
    draw(ts);
    requestAnimationFrame(loop);
  }
  loop();
})();
