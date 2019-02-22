Page({
  data: {
    age: "请上传照片",
    glasses: "请上传照片",
    beauty: "请上传照片",
    mask: "请上传照片",
    hat: "请上传照片",
    gender: "请上传照片",
    hair_length: "请上传照片",
    hair_bang: "请上传照片",
    hair_color: "请上传照片",
    image_src: "../../libs/img/user.svg"
  },
  UploadImage() {
    var myThis = this
    var random = Date.parse(new Date()) + Math.ceil(Math.random() * 1000) //随机数
    wx.chooseImage({ //图片上传接口
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(chooseImage_res) {
        wx.showLoading({
          title: '加载中...',
        });
        myThis.setData({
          image_src: chooseImage_res.tempFilePaths[0] //上传文件临时地址
        });
        console.log("临时地址:" + chooseImage_res.tempFilePaths[0])
        const uploadTask = wx.cloud.uploadFile({
          cloudPath: random + '.png',
          filePath: chooseImage_res.tempFilePaths[0], //将临时地址中的图片文件上传到云函数文件服务器
          success(uploadFile_res) {
            console.log("fileID:" + uploadFile_res.fileID),
              wx.cloud.callFunction({
                name: 'DetectFace',
                data: {
                  fileID: uploadFile_res.fileID //上传成功文件的fileID
                },
                success(cloud_callFunction_res) {
                  wx.hideLoading()
                  wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 500
                  })
                  console.log("FaceInfos:" + JSON.stringify(cloud_callFunction_res.result))
                  myThis.setData({
                    age: cloud_callFunction_res.result.FaceInfos[0].FaceAttributesInfo.Age, //年龄
                    glasses: cloud_callFunction_res.result.FaceInfos[0].FaceAttributesInfo.Glass, //是否带眼镜
                    beauty: cloud_callFunction_res.result.FaceInfos[0].FaceAttributesInfo.Beauty, //颜值数据
                    mask: cloud_callFunction_res.result.FaceInfos[0].FaceAttributesInfo.Mask, //是否遮挡
                    hat: cloud_callFunction_res.result.FaceInfos[0].FaceAttributesInfo.Hat, //是否带帽子
                  })
                  if (cloud_callFunction_res.result.FaceInfos[0].FaceAttributesInfo.Gender < 50) {
                    myThis.setData({
                      gender: "女"
                    });
                  } else {
                    myThis.setData({
                      gender: "男"
                    });
                  }
                  switch (cloud_callFunction_res.result.FaceInfos[0].FaceAttributesInfo.Hair.Length) {
                    case 0:
                      myThis.setData({
                        hair_length: "光头"
                      });
                      break;
                    case 1:
                      myThis.setData({
                        hair_length: "短发"
                      });
                      break;
                    case 2:
                      myThis.setData({
                        hair_length: "中发"
                      });
                      break;
                    case 3:
                      myThis.setData({
                        hair_length: "长发"
                      });
                      break;
                    case 4:
                      myThis.setData({
                        hair_length: "绑发"
                      });
                      break;
                  }
                  switch (cloud_callFunction_res.result.FaceInfos[0].FaceAttributesInfo.Hair.Bang) {
                    case 0:
                      myThis.setData({
                        hair_bang: "有刘海"
                      });
                      break;
                    case 1:
                      myThis.setData({
                        hair_bang: "无刘海"
                      });
                      break;
                  }
                  switch (cloud_callFunction_res.result.FaceInfos[0].FaceAttributesInfo.Hair.Color) {
                    case 0:
                      myThis.setData({
                        hair_color: "黑色"
                      });
                      break;
                    case 1:
                      myThis.setData({
                        hair_color: "金色"
                      });
                      break;
                    case 0:
                      myThis.setData({
                        hair_color: "棕色"
                      });
                      break;
                    case 1:
                      myThis.setData({
                        hair_color: "灰白色"
                      });
                      break;
                  }
                },
                fail(err) {
                  wx.hideLoading()
                  wx.showModal({
                    title: '失败',
                    content: "人脸检测失败，请重试！"
                  })
                }
              }),
              wx.cloud.callFunction({
                name: 'AnalyzeFace',
                data: {
                  fileID: uploadFile_res.fileID,
                },
                success(cloud_callFunction_res) {
                  wx.hideLoading()
                  console.log("AnalyzeFace:" + JSON.stringify(cloud_callFunction_res.result))
                },
                fail(err) {
                  wx.hideLoading()
                  wx.showModal({
                    title: '失败',
                    content: "五官定位失败，请重试！"
                  })
                }
              })
          }
        })
        uploadTask.onProgressUpdate((uploadFile_res) => {
          myThis.setData({
            progress: uploadFile_res.progress //上传进度
          })
        })
      }
    })
  },
  onLoad() {
    wx.cloud.init({
      env: 'release-a33bce'
    })
  }
})