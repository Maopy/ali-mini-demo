App({
  globalData: {
    apiHost: 'http://higuide.lightour.com'
  },
  userInfo: null,
  getUserInfo() {
    return new Promise((resolve, reject) => {
      if (this.userInfo) {
        resolve(this.userInfo)
        return
      }
      my.getAuthCode({
        scopes: ['auth_userinfo'],
        success: (authcode) => {
          my.httpRequest({
            url: `${this.globalData.apiHost}/api/user?auth_code=${authcode.authCode}`, // 目标服务器 url
            success: (res) => {
              if (res.status === 200 && res.data.code === 10000) {
                this.userInfo = res.data.result
                resolve(this.userInfo)
              }
            },
            fail: (err) => reject(err)
          })
        },
        fail: (err) => reject(err)
      });
    })
      .catch((err) => {
        my.alert({
          title: `用户信息读取失败：${JSON.stringify(err)}`, // alert 框的标题
        })
      })
  }
})
