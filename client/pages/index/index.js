Page({
  wx_face(){
    var myThis = this;
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        myThis.setData({
          imgsrc: res.tempFilePaths
        })
        wx.showLoading({
          title: '上传中……',
        })
        const uploadTask = wx.uploadFile({
          url: 'https://weixin.techeek.cn/', //替换为你自己的接口地址
          header:{
            'Content-Type': 'application/json'
          },
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            wx.hideLoading({
              title: '加载中',
            })
            var obj = JSON.parse(res.data)
            switch(true){
              case obj.data.face[0].mask <30:
                myThis.setData({
                  mask:"没有遮挡"
                });
                break;
              case 30 < obj.data.face[0].mask && obj.data.face[0].mask < 60:
                myThis.setData({
                  mask: "疑似遮挡"
                });
                break;
              case obj.data.face[0].mask > 60:
                myThis.setData({
                  mask: "遮挡"
                });
                break;
            }
            switch (true) {
              case obj.data.face[0].gender < 50:
                myThis.setData({
                  gender: "女"
                });
                break;
              case obj.data.face[0].gender > 60:
                myThis.setData({
                  gender: "男"
                });
                break;
            }
            switch (true) {
              case obj.data.face[0].hat < 30:
                myThis.setData({
                  hat: "没有戴帽子"
                });
                break;
              case 30 < obj.data.face[0].hat && obj.data.face[0].hat < 60:
                myThis.setData({
                  hat: "疑似戴帽子"
                });
                break;
              case obj.data.face[0].hat > 100:
                myThis.setData({
                  hat: "戴帽子"
                });
                break;
            }
            switch (obj.data.face[0].glasses) {
              case 1:
                myThis.setData({
                  glasses: "戴眼镜"
                });
                break;
              case 0:
                myThis.setData({
                  glasses: "没有戴眼镜"
                });
                break;
            }
            myThis.setData({
              age: obj.data.face[0].age,
              beauty: obj.data.face[0].beauty,
            })
          }
        })
        uploadTask.onProgressUpdate((res) => {
          myThis.setData({
            progress: res.progress
          })
        })
      }
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    imgsrc:"../../lib/img/imgsrc.jpg",
    age: "请上传照片",
    glasses: "请上传照片",
    beauty: "请上传照片",
    mask: "请上传照片",
    hat: "请上传照片",
    gender: "请上传照片"
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})