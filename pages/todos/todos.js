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
          my.startZMCreditRent({
            category: order.category,
            amount: order.amount,
            out_order_no: order.out_order_no,
            overdue_time: order.overdue_time,
            order_process_url: `../order-cont/order-cont?orderId=${order.out_order_no}`,
            item_id: order.item_id,
            subject: order.subject,
            success: (res) => {
              console.log(JSON.stringify(res), 'test')
              try {
                console.log(1)
                const {resultStatus, result} = res;
                switch (resultStatus) {
                  case 9000:
                    console.log(resultStatus)
                    const callbackData = res.result.callbackData;
                    const decodedCallbackData = decodeURIComponent(callbackData)
                    const json = JSON.parse(decodedCallbackData.match(/{.*}/));
                    const jsonStr = JSON.stringify(json, null, 4);
                    console.log(json)
                    if (json.success === true || json.success === 'true') {
                      // 创建订单成功, 此时可以跳转到订单详情页面
                      my.alert({content: '下单成功: ' + jsonStr})
                    } else {
                      // 创建订单失败, 请提示用户创建失败
                      my.alert({content: '下单失败: ' + jsonStr})
                    }
                    this.setData({
                      callbackData: callbackData,
                      decodedCallbackData: decodedCallbackData,
                      parsedJSON: jsonStr,
                    })
                    break;
                  case 6001:
                    // 用户点击返回, 取消此次服务, 此时可以给提示
                    my.alert({content: '取消'})
                    break;
                  default:
                    break;
                }
              } catch (error) {
                // 异常, 请在这里提示用户稍后重试
                my.alert({
                  content: '异常' + JSON.stringify(error, null, 4)
                });
              }
            },
            fail: (error) => {
              // 调用接口失败, 请在这里提示用户稍后重试
              my.alert({
                content: '调用失败' + JSON.stringify(error, null, 4)
              });
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
