Page({
  data: {
    shuju:''
  },
  onLoad() {
    var myThis = this
    wx.cloud.init({
      env: 'test-f97abe'
    })
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'add',
      // 传给云函数的参数
      data: {
        url:"https://www.faceplusplus.com.cn/images/comparing/left_pic_two.jpg"
      },
      success(res) {
        console.log(res.result)
        myThis.setData({
          shuju: res.result.ImageHeight
        })
      },
    })
  }
})