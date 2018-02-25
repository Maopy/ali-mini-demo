const app = getApp();

Page({
  data: {
    inputValue: '',
    orderList: [{
      name: '南区租赁点',
      status: 1,
      contentTitle: '共租赁 2 件物品',
      contentText: '请你于2017年11月24日 09:30前领取物品'
    }, {
      name: '南区租赁点',
      status: 2,
      contentTitle: '共租赁 2 件物品',
      contentText: '已由买家取消'
    }, {
      name: '南区租赁点',
      status: 3,
      contentTitle: '共租赁 2 件物品',
      contentText: '将在2017年12月10日 18:00前再次扣款，请…'
    }, {
      name: '南区租赁点',
      status: 4,
      contentTitle: '共租赁 2 件物品',
      contentText: '将在2017年12月10日 18:00前再次扣款，请…'
    }, {
      name: '南区租赁点',
      status: 5,
      contentTitle: '共租赁 2 件物品',
      contentText: '截止 2017年12月10日18:00 ，支付宝仍自动...'
    }, {
      name: '南区租赁点',
      status: 6,
      contentTitle: '共租赁 2 件物品',
      contentText: '棒！你已归还物品并完成付款'
    }, {
      name: '南区租赁点',
      status: 7,
      contentTitle: '共租赁 2 件物品',
      contentText: '棒！你已归还物品并完成付款'
    }],
    statusMap: ['', '待领取', '已取消', '待归还', '待支付', '已逾期', '已完成', '逾期完成'],
    specialStatusClass: {
      2: 'cancel',
      5: 'late'
    },
    activeTab: 2,
  },
  onLoad() {
    // this.setData({
    //   orderList: []
    // })
  },
  changeTab (event) {
    this.setData({
      activeTab: event.target.dataset.tab
    })
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
  goOrderDetail () {
    my.navigateTo({ url: '../order-cont/order-cont' });
  }
});
