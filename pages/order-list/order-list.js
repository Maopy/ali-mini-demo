const app = getApp();

Page({
  data: {
    inputValue: '',
    orderList: [],
    originOrderList: [],
    statusMap: [
      '待领取', // '商户订单创建',
      '待领取', // '信用借还订单创建成功，等待取机',
      '待归还', // '用户已取机',
      '待支付', // '用户已还机, 尚未扣款',
      '已逾期',
      '已完成', // '已完结(扣款成功)',
      '已取消', // '用户自行取消',
      '已取消', // '超时未取机，自动取消',
      '已取消', // '管理员取消(投诉退款, 退款)'
    ],
    specialStatusClass: {
      6: 'cancel',
      7: 'cancel',
      4: 'late'
    },
    activeTab: 1,
  },
  onLoad() {
    app.getUserInfo().then((user) => {
      this.setData({
        user
      })
      my.httpRequest({
        url: `${app.globalData.apiHost}/api/order/list?userId=${this.data.user.userId}`, // 目标服务器 url
        success: (res) => {
          if (res.status === 200 && res.data.code === 10000) {
            const originOrderList = res.data.result
            originOrderList.map((item) => {
              item.dtString = this.convertTime(item.createDt)
              return item
            })
            this.setData({
              originOrderList
            })
            this.filterOrderList(0)
          }
        },
      })
    })
  },
  filterOrderList (activeStatus) {
    const orderList = this.data.originOrderList.filter((item) => {
      return Number(activeStatus) === 0 || item.status === Number(activeStatus)
    })
    this.setData({
      orderList
    })
  },
  convertTime (timeStamp) {
    const time = new Date(timeStamp)
    return `${time.getFullYear()}年${time.getMonth() + 1}月${time.getDate()}日 ${time.getHours() < 10 ? '0' + time.getHours() : time.getHours()}:${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()}:${time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()}`
  },
  changeTab (event) {
    this.setData({
      activeTab: event.target.dataset.tab
    })
    this.filterOrderList(event.target.dataset.status)
  },
  onBlur(e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },
  add() {
    app.todos = app.todos.concat([{
      text: this.data.inputValue,
      compeleted: false,
    }]);

    my.navigateBack();
  },
  goOrderDetail (event) {
    my.navigateTo({ url: `../order-cont/order-cont?orderId=${event.target.dataset.orderId}` });
  }
});
