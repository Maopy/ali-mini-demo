Page({
  data: {
    inputValue: '',
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
