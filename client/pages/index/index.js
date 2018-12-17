Page({
  wx_face(){
    var myThis = this;
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        const ctx = wx.createCanvasContext('myCanvas')
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
            var obj = JSON.parse(res.data) //将返回的数值转换为json
            var ctx_size = 250 / obj.data.image_height;
            // 获取图片与canvas的比值
            ctx.drawImage(tempFilePaths[0], 0, 0, obj.data.image_height * ctx_size, obj.data.image_width * ctx_size); //显示上传的照片内容，并乘以比例正常显示
            ctx.setStrokeStyle('red')
            ctx.strokeRect(obj.data.face[0].x * ctx_size, obj.data.face[0].y * ctx_size, obj.data.face[0].height * ctx_size, obj.data.face[0].width * ctx_size) //绘制人脸识别的矩形
            ctx.beginPath();
            ctx.moveTo(obj.data.face[0].face_shape.face_profile[0].x * ctx_size, obj.data.face[0].face_shape.face_profile[0].y * ctx_size)
            for (var i = 1; i < obj.data.face[0].face_shape.face_profile.length;i++){
              ctx.lineTo(obj.data.face[0].face_shape.face_profile[i].x * ctx_size, obj.data.face[0].face_shape.face_profile[i].y * ctx_size)
            } //绘制脸部轮廓
            ctx.moveTo(obj.data.face[0].face_shape.left_eye[0].x * ctx_size, obj.data.face[0].face_shape.left_eye[0].y * ctx_size)
            for (var i = 1; i < obj.data.face[0].face_shape.left_eye.length; i++) {
              ctx.lineTo(obj.data.face[0].face_shape.left_eye[i].x * ctx_size, obj.data.face[0].face_shape.left_eye[i].y * ctx_size)
            } //绘制左眼轮廓
            ctx.moveTo(obj.data.face[0].face_shape.right_eye[0].x * ctx_size, obj.data.face[0].face_shape.right_eye[0].y * ctx_size)
            for (var i = 1; i < obj.data.face[0].face_shape.right_eye.length; i++) {
              ctx.lineTo(obj.data.face[0].face_shape.right_eye[i].x * ctx_size, obj.data.face[0].face_shape.right_eye[i].y * ctx_size)
            } //绘制右眼轮廓
            ctx.moveTo(obj.data.face[0].face_shape.left_eyebrow[0].x * ctx_size, obj.data.face[0].face_shape.left_eyebrow[0].y * ctx_size)
            for (var i = 1; i < obj.data.face[0].face_shape.left_eyebrow.length; i++) {
              ctx.lineTo(obj.data.face[0].face_shape.left_eyebrow[i].x * ctx_size, obj.data.face[0].face_shape.left_eyebrow[i].y * ctx_size)
            } //绘制左边眉毛轮廓
            ctx.moveTo(obj.data.face[0].face_shape.right_eyebrow[0].x * ctx_size, obj.data.face[0].face_shape.right_eyebrow[0].y * ctx_size)
            for (var i = 1; i < obj.data.face[0].face_shape.right_eyebrow.length; i++) {
              ctx.lineTo(obj.data.face[0].face_shape.right_eyebrow[i].x * ctx_size, obj.data.face[0].face_shape.right_eyebrow[i].y * ctx_size)
            } //绘制右边眉毛轮廓
            ctx.moveTo(obj.data.face[0].face_shape.mouth[0].x * ctx_size, obj.data.face[0].face_shape.mouth[0].y * ctx_size)
            for (var i = 1; i < obj.data.face[0].face_shape.mouth.length; i++) {
              ctx.lineTo(obj.data.face[0].face_shape.mouth[i].x * ctx_size, obj.data.face[0].face_shape.mouth[i].y * ctx_size)
            } //绘制嘴部轮廓
            ctx.moveTo(obj.data.face[0].face_shape.nose[0].x * ctx_size, obj.data.face[0].face_shape.nose[0].y * ctx_size)
            for (var i = 1; i < obj.data.face[0].face_shape.nose.length; i++) {
              ctx.lineTo(obj.data.face[0].face_shape.nose[i].x * ctx_size, obj.data.face[0].face_shape.nose[i].y * ctx_size)
            } //绘制鼻子轮廓
            ctx.stroke();
            ctx.draw()
            switch(true){ //遮挡检测
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
            switch (true) { //性别检测
              case obj.data.face[0].gender < 50:
                myThis.setData({
                  gender: "女"
                });
                break;
              case obj.data.face[0].gender > 50:
                myThis.setData({
                  gender: "男"
                });
                break;
            }
            switch (true) { //帽子检测
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
            switch (obj.data.face[0].glasses) { //眼镜检测
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
              age: obj.data.face[0].age, //年龄
              beauty: obj.data.face[0].beauty, //颜值
            })
          }
        })
        uploadTask.onProgressUpdate((res) => {
          myThis.setData({
            progress: res.progress //上传进度
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
    const ctx = wx.createCanvasContext('myCanvas') //绘制基本图形
    const image = "../../lib/img/imgsrc.jpg";
    ctx.drawImage(image, 0, 0, 250, 250);
    ctx.draw()
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