const app = getApp()

Page({
  data: {
    rentalPoint: {},
    goodsList: [],
    totalDeposit: 0,
    totalCount: 0
  },
  onLoad(query) {
    app.getUserInfo().then(
      user => this.setData({
        user,
      }),
    )

    const extConfig = my.getExtConfigSync()
    my.httpRequest({
      url: `${app.globalData.apiHost}/api/scenery/${extConfig.sceneryUid}/store/${query.storeId || extConfig.storeUid}`,
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
      longitude: this.data.rentalPoint.longitude,
      latitude: this.data.rentalPoint.latitude,
      name: this.data.rentalPoint.name,
      address: this.data.rentalPoint.address
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
    const extConfig = my.getExtConfigSync()
    const param = {
      userId: this.data.user.userId,
      sceneryUid: extConfig.sceneryUid,
      toRentGoodsList: []
    }
    this.data.goodsList.forEach((item) => {
      param.toRentGoodsList.push({
        goodsUid: item.uid,
        count: item.count
      })
    })
    my.httpRequest({
      url: `${app.globalData.apiHost}/api/order`, // 目标服务器 url
      headers:  {'Content-Type': 'application/json'},
      method: 'POST',
      data: JSON.stringify(param),
      success: (res) => {
        if (res.status === 200 && res.data.code === 10000) {
          const order = res.data.result
          // console.log(JSON.stringify({
          //   "category":"ZMSC_2_1",
          //   "amount":"1.00",
          //   "out_order_no":"201803012002365987",
          //   "overdue_time":"2018-03-14 18:30:00",
          //   "order_process_url":"alipays://platformapi/startApp?appId=2018011901972888&page=pages%2Forder-cont%2Forder-cont%3ForderId%3D201803090043367583",
          //   "item_id":"2018022801000222123413360250",
          //   "subject":
          //   {"products":[
          //     {
          //       "name":encodeURIComponent("测试"),
          //       "counts":1,
          //     "amount":"1.00",
          //   }
          //   ]}
          // }))
          // my.startZMCreditRent({
          //   "category":"ZMSC_2_1",
          //   "amount":"1.00",
          //   "out_order_no":"201803012002365987",
          //   "overdue_time":"2018-03-14 18:30:00",
          //   "order_process_url":"alipays://platformapi/startApp?appId=2018011901972888&page=pages%2Forder-cont%2Forder-cont%3ForderId%3D201803090043367583",
          //   "item_id":"2018022801000222123413360250",
          //   "subject":
          //   {"products":[
          //     {
          //       "name":encodeURIComponent("测试"),
          //       "counts":1,
          //     "amount":"1.00",
          //   }
          //   ]},
          //     success: (res) => {
          //   console.log(JSON.stringfy(res))
          //   },
          //   fail: (res) => {
          //   console.log(JSON.stringfy(res))
          //   }
          // });
          // console.log(JSON.stringify({
          //   category: order.category,
          //   amount: order.amount,
          //   out_order_no: order.out_order_no,
          //   overdue_time: order.overdue_time,
          //   order_process_url: `alipays://platformapi/startApp?appId=${extConfig.appId}&page=${encodeURIComponent(`pages/order-cont/order-cont?orderId=${order.out_order_no}`)}`,
          //   item_id: order.item_id,
          //   subject: order.subject
          // }))
          my.startZMCreditRent({
            category: order.category,
            amount: order.amount,
            out_order_no: order.out_order_no,
            overdue_time: order.overdue_time,
            order_process_url: `alipays://platformapi/startApp?appId=${extConfig.appId}&page=${encodeURIComponent(`pages/order-cont/order-cont?orderId=${order.out_order_no}`)}`,
            item_id: order.item_id,
            subject: order.subject,
            success: (res) => {
            },
            fail: (error) => {
            }
          })
          // my.navigateTo({ url: res.result })
        } else {
          my.alert({
            title: `下单失败：${res.data.msg}`, // alert 框的标题
            success: (res) => {
              
            },
          });
        }
      }
    })
  }
});
