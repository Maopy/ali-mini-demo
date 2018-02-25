Page({
  data: {
    inputValue: '',
    goodsList: [{
      "uid": "m5txWMK7YPCVKXVvEG9mdbb",
      "name": "中文讲解器",
      "imgUrl": "../../images/img-01.png",
      "desc": "南京中山陵中文讲解器",
      "deposit": 100,
      "rent": 100,
      "stock": 38,
      count: 5
    }, {
      "uid": "m5txWMK7YPCVKXVvEG9mdbc",
      "name": "外文讲解器",
      "imgUrl": '../../images/img-01.png',
      "desc": "南京中山陵外文讲解器",
      "deposit": 100,
      "rent": 100,
      "stock": 9988,
      count: 5
    }]
  },
  onReady () {
    my.httpRequest({
      url: 'http://higuide.lightour.com/api/order?orderId=201801281605480250', // 目标服务器 url
      success: (res) => {
        console.log(res)
      }
    })
  },
  onBlur(e) {
    
  },
  confirmCancel () {
    my.confirm({
      title: '', // confirm 框的标题
      content: '你要取消该订单么？',
      confirmButtonText: '确认取消',
      cancelButtonText: '点错了',
      success: (res) => {
        
      },
    });
  }
});
