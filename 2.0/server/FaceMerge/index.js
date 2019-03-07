const cloud = require('wx-server-sdk') //小程序云开发SDK
const tencentcloud = require("tencentcloud-sdk-nodejs"); //腾讯云API 3.0 SDK
const secret = require('./config.js');
cloud.init({
  env: 'YourwxcloudID'
}) //云开发初始化
var synDetectFace = function(imgbase64) { //人脸识别API
  const FacefusionClient = tencentcloud.facefusion.v20181201.Client; //API版本
  const models = tencentcloud.facefusion.v20181201.Models; //API版本

  const Credential = tencentcloud.common.Credential;
  const ClientProfile = tencentcloud.common.ClientProfile;
  const HttpProfile = tencentcloud.common.HttpProfile;

  let cred = new Credential(secret.SecretId, secret.SecretKey); //腾讯云的SecretId和SecretKey，打开config.js文件配置
  let httpProfile = new HttpProfile();
  httpProfile.endpoint = "facefusion.tencentcloudapi.com"; //腾讯云人脸识别API接口
  let clientProfile = new ClientProfile();
  clientProfile.httpProfile = httpProfile;
  let client = new FacefusionClient(cred, "", clientProfile); //调用就近地域

  let req = new models.FaceFusionRequest();
  let params = '{"ProjectId":"101000","ModelId":"qc_101000_113732_2","Image":"' + imgbase64 + '","RspImgType":"url"}' //拼接参数
  req.from_json_string(params);
  return new Promise(function(resolve, reject) { //构造异步函数
    client.FaceFusion(req, function(errMsg, response) {
      if (errMsg) {
        reject(errMsg)
      } else {
        resolve(response);
      }
    })
  })
}

exports.main = async(event, context) => {
  const imgbase64 = [event.base64] //读取来自客户端图片base64
  datas = await synDetectFace(imgbase64) //调用异步函数，向腾讯云API发起人脸融合请求
  return datas //返回腾讯云API的数据到客户端
}