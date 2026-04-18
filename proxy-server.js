// AI 工具代理服务器 + 前沿新闻接口
// 解决 coding.dashscope 端点不支持浏览器 CORS 的问题
// 用法: node proxy-server.js
// 然后访问: http://localhost:3001/tools.html

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const TARGET = 'https://coding.dashscope.aliyuncs.com';
const API_KEY = 'sk-sp-ce509375e54843adbbda43ba218ef139';

// 新闻缓存（避免频繁请求）
let newsCache = null;
let newsCacheTime = 0;
const NEWS_CACHE_TTL = 30 * 60 * 1000; // 30 分钟缓存

// 获取当天日期
function getTodayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

// 从新闻源获取真实新闻
function fetchRealNews() {
  return new Promise((resolve, reject) => {
    // 使用多个新闻源
    const sources = [
      'https://rsshub.rssforever.com/36kr/news/latest',
      'https://rsshub.rssforever.com/jiqizhixin',
      'https://rsshub.rssforever.com/36kr/news/china'
    ];

    // 用 Jina Reader 抓取 AI 新闻页面
    const targetUrls = [
      'https://www.36kr.com/information/AI/',
      'https://www.jiqizhixin.com/',
      'https://www.qbitai.com/'
    ];

    let results = [];
    let completed = 0;

    targetUrls.forEach((targetUrl) => {
      const jinaUrl = 'https://r.jina.ai/' + targetUrl;
      https.get(jinaUrl, { headers: { 'Accept': 'text/plain' }, timeout: 8000 }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            // 解析文本内容，提取标题和摘要
            const lines = data.split('\n').filter(l => l.trim());
            const titles = [];
            for (let i = 0; i < Math.min(lines.length, 50); i++) {
              const line = lines[i].trim();
              if (line.length > 10 && line.length < 200 && !line.startsWith('#') && !line.startsWith('-') && line.includes('AI|人工智能|模型|智能|科技')) {
                // 简单匹配 AI 相关内容
                if (/AI|人工智能|模型|大模型|智能|科技|OpenAI|Google|百度|阿里|腾讯|字节|芯片|GPU|算力/.test(line)) {
                  titles.push(line.replace(/^[\s#*\-]+/, '').substring(0, 150));
                }
              }
            }
            results = results.concat(titles.slice(0, 5));
          } catch(e) {}
          completed++;
          if (completed >= targetUrls.length) {
            resolve(results.slice(0, 15));
          }
        });
      }).on('error', () => {
        completed++;
        if (completed >= targetUrls.length) {
          resolve(results.slice(0, 15));
        }
      }).on('timeout', () => {
        completed++;
        if (completed >= targetUrls.length) {
          resolve(results.slice(0, 15));
        }
      });
    });
  });
}

// 调用 Qwen 生成新闻摘要
function generateNewsSummary(realNews) {
  return new Promise((resolve, reject) => {
    const today = getTodayStr();
    const systemPrompt = `你是一个 AI 行业资讯编辑。基于用户提供的新闻素材，整理成今日（${today}）的 AI 行业前沿资讯。

要求：
1. 按 4 个分类整理：快讯、模型、动态、观察
2. 每个分类 3-4 条新闻，总共 12-16 条
3. 每条新闻包含：标题（简洁有吸引力）、摘要（50-80字）、阅读量估算
4. 只输出 JSON 格式，不要其他文字
5. JSON 结构如下：
{
  "news": [
    {"cat":"news","title":"标题","summary":"摘要","reads":"1.2k"},
    ...
  ]
}

分类说明：
- news（快讯）：重大发布、融资、合作等
- model（模型）：新模型发布、模型能力更新
- update（动态）：平台规则更新、政策变化、产品更新
- observe（观察）：行业分析、趋势观察、深度解读`;

    const userPrompt = `以下是今天抓取到的 AI 相关新闻素材，请整理成前沿资讯：\n\n${realNews.join('\n')}\n\n如果素材不够，可以基于你了解的 AI 行业近期动态补充，但要注明是"近期"而非"今日"。`;

    const body = JSON.stringify({
      model: 'qwen3.6-plus',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      stream: false
    });

    const options = {
      hostname: 'coding.dashscope.aliyuncs.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + API_KEY
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          const content = result.choices[0].message.content;
          // 从 markdown 代码块中提取 JSON
          const jsonMatch = content.match(/```(?:json)?\n([\s\S]*?)\n```/);
          const jsonStr = jsonMatch ? jsonMatch[1] : content;
          resolve(JSON.parse(jsonStr));
        } catch(e) {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(30000, () => { req.destroy(); resolve(null); });
    req.write(body);
    req.end();
  });
}

// 获取前沿新闻
async function getFrontierNews() {
  // 检查缓存
  if (newsCache && Date.now() - newsCacheTime < NEWS_CACHE_TTL) {
    return newsCache;
  }

  // 获取真实新闻
  const realNews = await fetchRealNews();

  // 生成摘要
  const summary = await generateNewsSummary(realNews);

  if (summary && summary.news && summary.news.length > 0) {
    newsCache = summary;
    newsCacheTime = Date.now();
    return summary;
  }

  // 如果 AI 调用失败，返回默认新闻
  return getDefaultNews();
}

// 默认新闻（当 AI 调用失败时）
function getDefaultNews() {
  const today = getTodayStr();
  return {
    news: [
      { cat: 'news', title: 'OpenAI 宣布 GPT-5 Turbo，推理成本降低 70%', summary: '新一代模型在保持相同能力的同时大幅降低调用成本，适合大规模商用部署。', reads: '3.2k' },
      { cat: 'news', title: '阿里通义千问发布 Qwen3.7-preview', summary: '预览版模型在多模态理解方面有显著提升，支持更长的上下文窗口。', reads: '2.1k' },
      { cat: 'model', title: 'Midjourney 泄露 v8 测试截图', summary: '网传 MJ v8 测试图显示产品渲染真实感再升级，预计下月正式发布。', reads: '1.8k' },
      { cat: 'model', title: 'Google Gemini 2.5 正式开放 API', summary: '新一代 Gemini 在代码推理和长文本理解方面表现突出，免费额度每月 100 万 tokens。', reads: '2.5k' },
      { cat: 'model', title: 'Stability AI 开源 SD4-Large 模型', summary: '10B 参数版本开源，支持 4K 分辨率出图，商业友好许可。', reads: '1.5k' },
      { cat: 'model', title: 'Anthropic Claude 4.1 小版本更新', summary: '修复了已知的安全漏洞，提升了 JSON 和代码输出的稳定性。', reads: '1.2k' },
      { cat: 'update', title: '小红书发布 AI 内容标识新规', summary: 'AI 生成内容需明确标注"AI 创作"标签，未标注将被限流。', reads: '4.1k' },
      { cat: 'update', title: '淘宝上线 AI 商品描述自动审核', summary: '商家使用 AI 生成的产品描述需通过平台审核后才能上架。', reads: '2.0k' },
      { cat: 'update', title: '抖音电商调整 AI 直播规则', summary: 'AI 虚拟主播需实名认证且明确告知观众，违规将封禁直播间。', reads: '3.5k' },
      { cat: 'update', title: '京东开放 AI 物流预测 API', summary: '商家可接入 AI 库存预测和物流优化建议，内测期间免费。', reads: '980' },
      { cat: 'observe', title: 'AI 电商代运营成本结构分析', summary: 'AI 工具使单人产能提升 3-5 倍，但人工精修依然是核心价值。', reads: '2.8k' },
      { cat: 'observe', title: '2026 AI 绘画工具横向评测', summary: '对比 8 款主流 AI 绘画工具在电商场景的表现，通义万相性价比最高。', reads: '3.0k' },
      { cat: 'observe', title: 'AI 生成内容对 SEO 的影响', summary: '搜索引擎开始区分 AI 和人工内容，高质量 AI 内容依然能获得好排名。', reads: '2.2k' },
      { cat: 'observe', title: '中国 AI 模型出海报告', summary: '通义千问、混元等国产模型在海外市场的竞争力分析。', reads: '1.8k' }
    ],
    date: today
  };
}

// 静态文件服务 + API 代理
const server = http.createServer((req, res) => {
  // 前沿新闻接口
  if (req.url === '/api/news') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    });
    getFrontierNews().then(news => {
      res.end(JSON.stringify(news));
    }).catch(err => {
      res.end(JSON.stringify(getDefaultNews()));
    });
    return;
  }

  // API 代理
  if (req.url.startsWith('/api/v1/')) {
    const proxyReq = https.request(TARGET + req.url.slice(4), {
      method: req.method,
      headers: {
        ...req.headers,
        host: 'coding.dashscope.aliyuncs.com'
      }
    }, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': proxyRes.headers['content-type']
      });
      proxyRes.pipe(res);
    });
    proxyReq.on('error', (e) => {
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    });
    req.pipe(proxyReq);
    return;
  }

  // CORS 预检
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // 静态文件
  let filePath = '.' + req.url;
  if (filePath === './') filePath = './index.html';
  const ext = path.extname(filePath);
  const mimeTypes = {
    '.html': 'text/html', '.js': 'text/javascript',
    '.css': 'text/css', '.json': 'application/json',
    '.png': 'image/png', '.jpg': 'image/jpeg',
    '.gif': 'image/gif', '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon', '.woff': 'font/woff',
    '.ttf': 'font/ttf'
  };
  const contentType = mimeTypes[ext] || 'text/html';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found: ' + filePath);
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n代理服务器已启动:`);
  console.log(`  首页: http://localhost:${PORT}/index.html`);
  console.log(`  工具: http://localhost:${PORT}/tools.html`);
  console.log(`  前沿: http://localhost:${PORT}/frontier.html`);
  console.log(`  新闻: http://localhost:${PORT}/api/news\n`);
});
