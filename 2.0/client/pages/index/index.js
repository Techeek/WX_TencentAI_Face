Page({
  data: {
    Beauty: ''
  },
  UploadImage() {
    var myThis = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        wx.cloud.uploadFile({
          cloudPath: 'UploadImage.png',
          filePath: res.tempFilePaths[0],
          success: res => {
            wx.cloud.callFunction({
              name: 'UpdateFile',
              data: {
                fileID: res.fileID
              },
              success(res) {
                console.log(res.result)
                myThis.setData({
                  Beauty: res.result.FaceInfos[0].FaceAttributesInfo.Beauty
                })
              },
            })
          },
          fail: err => {
            console.log(err)
          }
        })
      }
    })
  },
  onLoad() {
    wx.cloud.init({
      env: 'test-f97abe'
    })
  }
})