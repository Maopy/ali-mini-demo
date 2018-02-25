const app = getApp()

Page({
  data: {
    rentalPoint: {}
  },
  onLoad (query) {
    my.httpRequest({
      url: `${app.globalData.apiHost}/api/scenery/${app.globalData.sceneryUid}/store/${query.storeId}`,
      success: (res) => {
        if (res.status === 200) {
          const rentalPoint = res.data.result
          this.setData({
            rentalPoint
          })
        }
      }
    })
  },
  goThere () {
    my.openLocation({
      longitude: this.data.rentalPoint.longitude,
      latitude: this.data.rentalPoint.latitude,
      name: this.data.rentalPoint.name,
      address: this.data.rentalPoint.address
    })
  }
})
