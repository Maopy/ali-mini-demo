App({
  globalData: {
    apiHost: 'http://higuide.lightour.com',
    sceneryUid: 'm5txWMK7YPCVKXVvEG9mdg',
    storeUid: 'm5txWMK7YPCVKXVvEG9mdaa'
  },
  userInfo: null,
  getUserInfo() {
    return new Promise((resolve, reject) => {
      if (this.userInfo) resolve(this.userInfo);

      my.getAuthCode({
        scopes: ['auth_user'],
        success: (authcode) => {
          console.info(authcode);

          my.getAuthUserInfo({
            success: (res) => {
              this.userInfo = res;
              resolve(this.userInfo);
            },
            fail: () => {
              reject({});
            },
          });
        },
        fail: () => {
          reject({});
        },
      });
    });
  },
});
