const app = getApp();

Page({
  data: {
    goodsList: [{
      "uid": "m5txWMK7YPCVKXVvEG9mdbb",
      "name": "中文讲解器",
      "imgUrl": "http://ou2aev0ty.bkt.clouddn.com/image/nj_zsl.png",
      "desc": "南京中山陵中文讲解器",
      "deposit": 100,
      "rent": 100,
      "stock": 38,
      count: 0
    }, {
      "uid": "m5txWMK7YPCVKXVvEG9mdbc",
      "name": "外文讲解器",
      "imgUrl": '../../images/img-01.png',
      "desc": "南京中山陵外文讲解器",
      "deposit": 100,
      "rent": 100,
      "stock": 9988,
      count: 0
    }],
    totalDeposit: 0,
    totalCount: 0
  },
  onLoad() {
    app.getUserInfo().then(
      user => this.setData({
        user,
      }),
    );
  },
  onShow() {
    this.setData({ todos: app.todos });
  },
  showXuzhi () {
    my.alert({
      title: '租赁须知',
      content: '1.租机窗口取机，景区出口归还；2.半小时内可免费取消订单；3.请妥善使用物品，如发现损坏，需支付物品赔偿金。'
    })
  },
  changeCount (event) {
    const goodsList = Object.assign(this.data.goodsList)
    const {item, index, operate} = event.target.dataset
    if (operate === 'add') {
      goodsList[index].count++
    } else {
      goodsList[index].count--
    }
    this.setData({ goodsList })
    this.calTotalDepositAndCount()
  },
  calTotalDepositAndCount () {
    let totalDeposit = 0
    let totalCount = 0
    this.data.goodsList.forEach((item) => {
      if (item.count > 0) {
        totalDeposit += item.count * item.deposit
        totalCount++
      }
    })
    this.setData({ totalDeposit, totalCount })
  },
  goThere () {
    my.openLocation({
      longitude: '116.424056',
      latitude: '40.039485',
      name: '支付宝',
      address: '杨高路地铁站'
    })
  },
  onTodoChanged(e) {
    const checkedTodos = e.detail.value;
    app.todos = app.todos.map(todo => ({
      ...todo,
      completed: checkedTodos.indexOf(todo.text) > -1,
    }));
    this.setData({ todos: app.todos });
  },
  addTodo() {
    my.navigateTo({ url: '../order-list/order-list' });
  },
  goContent() {
    if (!this.data.totalCount) {
      return
    }
    my.navigateTo({ url: '../order-cont/order-cont' });
  }
});
