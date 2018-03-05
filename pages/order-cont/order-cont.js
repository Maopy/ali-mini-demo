const QR = require('../../utils/qrcode.js')
const app = getApp()

Page({
  data: {
    inputValue: '',
    order: {},
    statusList: [
      '物品待领取', // '商户订单创建',
      '物品待领取', // '信用借还订单创建成功，等待取机',
      '物品待归还', // '用户已取机',
      '待支付', // '用户已还机, 尚未扣款',
      '已逾期',
      '已完成', // '已完结(扣款成功)',
      '已取消', // '用户自行取消',
      '已取消', // '超时未取机，自动取消',
      '已取消', // '管理员取消(投诉退款, 退款)'
      '逾期完成'
    ],
    totalCount: 0,
    canvasHidden:false,
    imagePath:''
  },
  onLoad (query) {
    var size = this.setCanvasSize() // 动态设置画布大小
    var initUrl = '{"storeId":"m5txWMK7YPCVKXVvEG9mdaa"}'
    this.createQrCode(initUrl, "mycanvas", size.w, size.h)
    this.drawQRCode()

    app.getUserInfo().then((user) => {
      this.setData({
        user
      })
    })
    my.httpRequest({
      url: `${app.globalData.apiHost}/api/order?orderId=${query.orderId}`, // 目标服务器 url
      success: (res) => {
        if (res.status === 200) {
          const order = res.data.result
          const autoCancelDate = new Date(order.autoCancelDt)
          let totalCount = 0
          let totalDeposit = 0
          let totalAmount = 0
          order.orderDetails.forEach((item) => {
            totalCount += item.count
            totalDeposit += item.deposit * item.count
            totalAmount += item.rent * item.count
          })
          this.setData({
            order,
            totalCount,
            totalDeposit,
            totalAmount,
            autoCancel: `${autoCancelDate.getFullYear()}年${autoCancelDate.getMonth() + 1}月${autoCancelDate.getDate()} ${autoCancelDate.getHours()}:${autoCancelDate.getMinutes() < 9 ? '0' + String(autoCancelDate.getMinutes()) : autoCancelDate.getMinutes()}`
          })
        }
      }
    })

    const extConfig = my.getExtConfigSync()
    my.httpRequest({
      url: `${app.globalData.apiHost}/api/scenery/${extConfig.sceneryUid}/stores`,
      success: (res) => {
        if (res.status === 200 && res.data.code === 10000) {
          const stores = res.data.result
          this.setData({
            stores
          })
        }
      }
    })
  },
  //适配不同屏幕大小的canvas
  setCanvasSize () {
    var size={};
    try {
        var res = my.getSystemInfoSync()
        var scale = 750/686;//不同屏幕下canvas的适配比例；设计稿是750宽
        var width = res.windowWidth/scale;
        var height = width;//canvas画布为正方形
        size.w = width;
        size.h = height;
      } catch (e) {
        // Do something when catch error
        console.log("获取设备信息失败"+e);
      } 
    return size;
  },
  createQrCode (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url,canvasId,cavW,cavH);
    QR.api.ctx.setFillStyle('#FFF');
    QR.api.ctx.fillRect(0, 0, 305, 305);
    QR.api.ctx.draw();
    // this.canvasToTempImage()
  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage () {
    console.log(QR.api.ctx)
    QR.api.ctx.toTempFilePath({
      // canvasId: 'mycanvas',
      success (res) {
        console.log(res, 1)
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath)
        this.setData({
            imagePath: tempFilePath
        });
      },
      fail (res) {
        console.log(res);
      }
    });
  },
  drawQRCode () {
    const url = '{"storeId":"m5txWMK7YPCVKXVvEG9mdaa"}'
    const size = this.setCanvasSize()
    //绘制二维码
    this.createQrCode(url, "mycanvas", size.w, size.h)
  },
  confirmCancel () {
    my.confirm({
      title: '', // confirm 框的标题
      content: '你要取消该订单么？',
      confirmButtonText: '确认取消',
      cancelButtonText: '点错了',
      success: (res) => {
        my.httpRequest({
          url: `${app.globalData.apiHost}/api/order/${this.data.order.orderId}/cancel?userUid=${this.user.userId}`, // 目标服务器 url
          success: (res) => {
            if (res.status === 200 && res.data.code === 10000) {
              my.alert({
                title: '取消成功', // alert 框的标题
                success: (res) => {
                  my.redirectTo(`/order-cont/order-cont?orderId=${this.data.order.orderId}`)
                }
              })
            }
          }
        })
      },
    });
  }
});
