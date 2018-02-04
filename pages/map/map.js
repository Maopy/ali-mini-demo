const app = getApp()

Page({
  data: {
    systemInfo: {},
    longitude: '',
    latitude: '',
    markers: [{
      iconPath: '../../images/headset.png',
      width: 30,
      height: 30,
      longitude: 116.424056,
      latitude: 40.039485
    }],
    controls: []
  },
  onLoad() {
    app.getUserInfo().then(
      user => this.setData({
        user,
      }),
    )
  },
  onReady (e) {
    this.mapCtx = my.createMapContext('shop-map')
    this.setData({
      systemInfo: my.getSystemInfoSync()
    })
    console.log(this.data.systemInfo)
    this.setMapControls()
    setTimeout(() => {
      this.mapCtx.moveToLocation()
    }, 1000)
  },
  setMapControls () {
    this.setData({
      controls: [{
        iconPath: '../../images/scan_button.png',
        position: {
          top: this.data.systemInfo.windowHeight - 220,
          left: this.data.systemInfo.windowWidth / 2 - 70,
          width: 141,
          height: 60
        },
        clickable: true
      }]
    })
  },
  goRentalPoint () {
    my.navigateTo({ url: '../rental-point/rental-point' });
  },
  goTodos () {
    my.navigateTo({ url: '../todos/todos' });
  },
  goOrderList () {
    my.navigateTo({ url: '../order-list/order-list' });
  }
});
