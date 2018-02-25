const app = getApp()

Page({
  data: {
    systemInfo: {},
    longitude: '',
    latitude: '',
    markers: [],
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

    my.httpRequest({
      url: `${app.globalData.apiHost}/api/scenery/${app.globalData.sceneryUid}`,
      success: (res) => {
        if (res.status === 200) {
          const stores = res.data && res.data.result && res.data.result.stores || []
          const goodsList = stores.length && stores[0].goodsList || []
          const markers = stores.map((item) => {
            return {
              id: item.uid,
              iconPath: '/images/headset.png',
              width: 30,
              height: 30,
              longitude: item.longitude,
              latitude: item.latitude
            }
          })
          console.log(markers, 1)
          this.setData({
            markers
          })
        }
      }
    })
  },
  setMapControls () {
    this.setData({
      controls: [{
        iconPath: '/images/scan_button.png',
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
  goRentalPoint (e) {
    my.navigateTo({ url: `../rental-point/rental-point?storeId=${e.markerId}` })
  },
  goTodos () {
    my.navigateTo({ url: '../todos/todos' });
  },
  goOrderList () {
    my.navigateTo({ url: '../order-list/order-list' });
  }
});
