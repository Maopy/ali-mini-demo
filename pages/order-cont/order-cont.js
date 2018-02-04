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
  onLoad() {
    
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
