const app = getApp()

Page({
  data: {
    rentalPoint: {},
    goodsList: [],
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
  onReady () {
    my.httpRequest({
      url: `${app.globalData.apiHost}/api/scenery/${app.globalData.sceneryUid}/store/${app.globalData.storeUid}`,
      success: (res) => {
        if (res.status === 200) {
          const rentalPoint = res.data.result
          const goodsList = rentalPoint.goodsList
          goodsList.map((item) => {
            item.count = 0
            return item
          })
          this.setData({
            rentalPoint,
            goodsList
          })
        }
      }
    })
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
