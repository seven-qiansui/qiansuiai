// ===== 来点好水 · 共享数据层 =====
// 三端通过 localStorage 共享订单数据，storage 事件跨标签页实时同步

const STORE_KEY = 'water_app_data';

// 商品数据（固定）
const PRODUCTS = [
  {id:1,name:'农夫山泉 饮用天然水',brand:'农夫山泉',spec:'18.9L/桶',price:20,orig:25,sold:3826,em:'🏔️',cat:'桶装水'},
  {id:2,name:'百岁山 天然矿泉水',brand:'百岁山',spec:'18.9L/桶',price:22,orig:28,sold:2914,em:'💎',cat:'桶装水'},
  {id:3,name:'怡宝 纯净水',brand:'怡宝',spec:'18.9L/桶',price:18,orig:22,sold:4210,em:'🌊',cat:'桶装水'},
  {id:4,name:'娃哈哈 纯净水',brand:'娃哈哈',spec:'18.9L/桶',price:16,orig:20,sold:5102,em:'💧',cat:'桶装水'},
  {id:5,name:'景田 百岁山矿泉水',brand:'景田',spec:'18.9L/桶',price:24,orig:30,sold:1856,em:'🌿',cat:'桶装水'},
  {id:6,name:'昆仑山 雪山矿泉水',brand:'昆仑山',spec:'18.9L/桶',price:28,orig:35,sold:1320,em:'⛰️',cat:'桶装水'},
  {id:7,name:'农夫山泉 饮用水',brand:'农夫山泉',spec:'550ml×24瓶',price:32,orig:38,sold:1560,em:'🏔️',cat:'瓶装水'},
  {id:8,name:'怡宝 纯净水',brand:'怡宝',spec:'555ml×24瓶',price:28,orig:35,sold:2100,em:'🌊',cat:'瓶装水'},
  {id:9,name:'百岁山 矿泉水',brand:'百岁山',spec:'348ml×24瓶',price:36,orig:42,sold:980,em:'💎',cat:'瓶装水'},
  {id:10,name:'农夫山泉 5L装',brand:'农夫山泉',spec:'5L×4瓶',price:38,orig:45,sold:860,em:'🏔️',cat:'瓶装水'},
  {id:11,name:'美的 饮水机 立式',brand:'美的',spec:'冷热双用',price:399,orig:599,sold:320,em:'🚰',cat:'饮水设备'},
  {id:12,name:'饮水机深度清洗',brand:'专业清洗',spec:'上门服务',price:68,orig:98,sold:560,em:'🧹',cat:'饮水设备'}
];

const CATEGORIES = [{n:'桶装水',ic:'🪣'},{n:'瓶装水',ic:'🍶'},{n:'饮水设备',ic:'🚰'}];

const DRIVERS = [
  {id:'d1',name:'小陈',phone:'158****1234'},
  {id:'d2',name:'老周',phone:'159****5678'},
  {id:'d3',name:'小李',phone:'157****9012'}
];

// 默认初始订单（演示用）
const DEFAULT_ORDERS = [
  {id:'WO20260324001',customer:'张先生',phone:'138****8888',addr:'翠苑一区18号楼3单元502',items:[{pid:1,qty:3}],amount:60,time:'17:05',status:'pending',driver:null,note:'放门口即可',bottles:0,createAt:Date.now()-3600000},
  {id:'WO20260324002',customer:'李女士',phone:'139****6666',addr:'翠苑二区5号楼1单元301',items:[{pid:2,qty:2}],amount:44,time:'16:48',status:'pending',driver:null,note:'',bottles:0,createAt:Date.now()-4200000},
  {id:'WO20260324003',customer:'杭州XX科技',phone:'0571-88****',addr:'文三路478号华星大厦8楼',items:[{pid:3,qty:8},{pid:2,qty:2}],amount:180,time:'16:30',status:'delivering',driver:'d1',note:'送到前台联系行政小王',bottles:0,createAt:Date.now()-5400000},
  {id:'WO20260324004',customer:'王先生',phone:'137****5555',addr:'古荡新村西区12幢201',items:[{pid:4,qty:2}],amount:32,time:'15:20',status:'done',driver:'d2',note:'',bottles:2,createAt:Date.now()-7200000},
  {id:'WO20260324005',customer:'陈先生',phone:'135****3333',addr:'翠苑四区2号楼5-601',items:[{pid:5,qty:4}],amount:96,time:'14:10',status:'done',driver:'d1',note:'',bottles:4,createAt:Date.now()-9000000}
];

// ===== 数据读写 =====
function loadData() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  // 首次使用，初始化
  const init = { orders: DEFAULT_ORDERS, cart: [], ticketBalance: 0, nextOrderNum: 6 };
  saveData(init);
  return init;
}

function saveData(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

function resetData() {
  localStorage.removeItem(STORE_KEY);
  return loadData();
}

// ===== 订单操作 =====
function createOrder(customer, phone, addr, cartItems, note) {
  const data = loadData();
  const num = String(data.nextOrderNum).padStart(3, '0');
  const now = new Date();
  const time = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
  let amount = 0;
  const items = cartItems.map(c => {
    const p = PRODUCTS.find(x => x.id === c.id);
    amount += p ? p.price * c.qty : 0;
    return { pid: c.id, qty: c.qty };
  });
  const order = {
    id: 'WO' + now.toISOString().slice(0,10).replace(/-/g,'') + num,
    customer, phone, addr, items, amount, time,
    status: 'pending', driver: null, note: note || '', bottles: 0,
    createAt: Date.now()
  };
  data.orders.unshift(order);
  data.nextOrderNum++;
  saveData(data);
  return order;
}

function updateOrderStatus(orderId, status, extra) {
  const data = loadData();
  const order = data.orders.find(o => o.id === orderId);
  if (!order) return;
  order.status = status;
  if (extra) Object.assign(order, extra);
  saveData(data);
  return order;
}

// ===== 工具函数 =====
function getProduct(id) { return PRODUCTS.find(p => p.id === id); }
function getDriver(id) { return DRIVERS.find(d => d.id === id); }
function getOrderProducts(order) {
  return order.items.map(i => {
    const p = getProduct(i.pid);
    return { ...p, qty: i.qty };
  });
}
function formatTime(ts) {
  const d = new Date(ts);
  return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
}

// ===== 跨标签页同步 =====
function onDataChange(callback) {
  window.addEventListener('storage', function(e) {
    if (e.key === STORE_KEY) callback(loadData());
  });
}
