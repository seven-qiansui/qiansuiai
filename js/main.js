// ============================================================
// 千岁 AI - 核心交互 v2
// ============================================================
document.addEventListener("DOMContentLoaded", function () {

  // --- 1. 导航栏收缩 ---
  var navbar = document.getElementById("navbar");
  function updateNav() {
    if (!navbar) return;
    if (window.scrollY > 50) { navbar.classList.add("shrink"); }
    else { navbar.classList.remove("shrink"); }
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
    "ecommerce-1": { title: "护肤品主图详情页", desc: "AI 生成背景 人工精修 转化率提升 40", deliverables: ecommerceDeliverables },
    "ecommerce-2": { title: "3C 数码详情页", desc: "15 板块完整设计 点击率提升 60", deliverables: ecommerceDeliverables },
    "ecommerce-3": { title: "女装品牌店铺装修", desc: "首页 活动页 品牌 VI 统一输出", deliverables: ecommerceDeliverables },
    "ecommerce-4": { title: "零食品牌视觉全案", desc: "主图 详情页 活动海报统一输出", deliverables: ecommerceDeliverables },
    "ecommerce-5": { title: "家居家具产品展示", desc: "场景合成 去背景 批量精修 200 张", deliverables: ecommerceDeliverables },
    "ecommerce-6": { title: "母婴用品主图设计", desc: "温馨 ins 风 多 SKU 统一视觉风格", deliverables: ecommerceDeliverables },
    "ecommerce-7": { title: "运动装备详情页", desc: "卖点可视化 场景渲染 功能演示图", deliverables: ecommerceDeliverables },
    "ecommerce-8": { title: "宠物食品品牌设计", desc: "IP 形象设计 产品包装 详情页一体化", deliverables: ecommerceDeliverables },
    "video-1": { title: "美妆品牌宣传片", desc: "30 秒产品展示 卖点可视化 多平台适配", deliverables: videoBrand },
    "video-2": { title: "食品信息流广告", desc: "多版本 AB 测试 高转化素材制作", deliverables: videoFeed },
    "video-3": { title: "3C 数码开箱视频", desc: "AI 生成脚本加剪辑 产品展示与教程", deliverables: videoShort },
    "video-4": { title: "女装穿搭展示视频", desc: "多套搭配展示 场景切换 节奏感剪辑", deliverables: videoShort },
    "video-5": { title: "家电使用演示视频", desc: "功能演示 场景还原 对比效果展示", deliverables: videoProduct },
    "video-6": { title: "运动品牌广告片", desc: "动感剪辑 高燃配乐 多场景切换", deliverables: videoProduct },
    "video-7": { title: "宠物用品主图视频", desc: "15 秒产品展示 使用演示 萌宠出镜", deliverables: videoShort },
    "video-8": { title: "企业品牌宣传片", desc: "企业形象展示 团队介绍 文化输出", deliverables: videoBrand },
    "social-1": { title: "美妆品牌小红书运营", desc: "3 个月粉丝增长 5 万 爆文 12 篇", deliverables: socialXHS },
    "social-2": { title: "健康行业公众号代运营", desc: "每周 3 篇深度文章 平均阅读量 5000", deliverables: socialWX },
    "social-3": { title: "母婴品牌全平台内容", desc: "公众号 小红书 抖音同步运营", deliverables: socialContent },
    "social-4": { title: "女装品牌种草运营", desc: "穿搭种草笔记 单篇阅读 10 万", deliverables: socialXHS },
    "social-5": { title: "美食博主内容策划", desc: "测评种草 探店内容 粉丝互动活动", deliverables: socialContent },
    "social-6": { title: "家居生活号运营", desc: "好物推荐内容 种草转化 月度数据复盘", deliverables: socialWX },
    "social-7": { title: "健身品牌社交运营", desc: "运动干货 打卡活动 社群用户维护", deliverables: socialFans },
    "social-8": { title: "宠物 IP 账号孵化", desc: "萌宠人设打造 日常内容 粉丝增长 5 万", deliverables: socialFans },
    "ai-1": { title: "电商团队 AI 工作流", desc: "选品到上架全流程自动化 效率提升 3 倍", deliverables: aiWorkflow },
    "ai-2": { title: "企业 AI 技能培训", desc: "20 人团队培训 全员 AI 工具实操", deliverables: aiTrain },
    "ai-3": { title: "企业 AI 定制方案", desc: "业务场景深度分析 原型开发与测试", deliverables: aiCustom },
    "ai-4": { title: "智能客服系统搭建", desc: "响应时间缩短 70 人力成本降低 50", deliverables: aiTools },
    "ai-5": { title: "文案团队 AI 落地", desc: "内容生产效率翻倍 AI 工具全流程部署", deliverables: aiTools },
    "ai-6": { title: "电商数据 AI 分析", desc: "销售预测 用户画像 AI 自动报表", deliverables: aiCustom },
    "ai-7": { title: "设计团队 AI 落地", desc: "AI 辅助设计 批量出图 效率提升 5 倍", deliverables: aiTools },
    "ai-8": { title: "营销团队 AI 部署", desc: "智能投放 内容生成 用户画像精准营销", deliverables: aiWorkflow }
  };

  var caseModal = document.getElementById("caseModal");
  var caseTitle = document.getElementById("caseModalTitle");
  var caseDesc = document.getElementById("caseModalDesc");
  var caseDeliverables = document.getElementById("caseDeliverables");

  function openCaseModal(eOrId, id) {
    var e = (eOrId instanceof Event) ? eOrId : null;
    var realId = id || eOrId;
    if (e) e.preventDefault();
    var data = caseData[realId];
    if (!data || !caseModal) return;
    caseTitle.textContent = data.title;
    caseDesc.textContent = data.desc;
    var icons = ["image", "layers", "scroll", "sparkles"];
    var html = "";
    for (var i = 0; i < data.deliverables.length; i++) {
      var d = data.deliverables[i];
      var icon = icons[i] || "check";
      html += '<div class="case-deliverable"><div class="del-icon"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div><div class="del-name">' + d.name + '</div><div class="del-count">' + d.count + '</div></div>';
    }
    caseDeliverables.innerHTML = html;
    caseModal.classList.add("active");
  }

  function closeCaseModal() {
    if (caseModal) caseModal.classList.remove("active");
  }

  // 点击案例卡片
  for (var c = 0; c < caseCards.length; c++) {
    caseCards[c].style.cursor = "pointer";
    caseCards[c].addEventListener("click", function () {
      var id = this.getAttribute("data-case-id");
      if (window.innerWidth < 768) {
        window.location.href = "contact.html";
      } else {
        openCaseModal(id);
      }
    });
  }

  // 点击弹窗背景关闭
  if (caseModal) {
    caseModal.addEventListener("click", function (e) {
      if (e.target === caseModal) closeCaseModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeCaseModal();
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
    for (var i = 0; i < 400; i++) {
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

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
    var t = Date.now();

    // 背景星星 — 呼吸闪烁
    for (var i = 0; i < bgStars.length; i++) {
      var s = bgStars[i];
      var a = s.alpha + Math.sin(t * s.speed + s.phase) * 0.2;
      a = Math.max(0.05, Math.min(1, a));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + a + ")";
      ctx.fill();
    }

    // 星座 — 整体呼吸 + 单星呼吸
    for (var i = 0; i < constellations.length; i++) {
      var c = constellations[i];
      var groupPulse = Math.sin(t * c.breatheSpeed + c.phase) * 0.5 + 0.5; // 0~1

      // 连线
      var lineAlpha = 0.04 + groupPulse * 0.08;
      ctx.strokeStyle = "rgba(180,190,220," + lineAlpha + ")";
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
        var dotAlpha = 0.1 + Math.sin(t * p.breatheSpeed + p.phase) * 0.15 + groupPulse * 0.15;
        dotAlpha = Math.max(0.05, Math.min(0.8, dotAlpha));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200,210,240," + dotAlpha + ")";
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

    requestAnimationFrame(draw);
  }

  draw();
})();
