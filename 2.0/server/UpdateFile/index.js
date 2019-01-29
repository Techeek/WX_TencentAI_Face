const cloud = require('wx-server-sdk') //云函数入口文件
const tencentcloud = require("tencentcloud-sdk-nodejs"); //腾讯云API 3.0 SDK
cloud.init() //云开发初始化
var synDetectFace = function(url) { //人脸识别API
  const IaiClient = tencentcloud.iai.v20180301.Client; //API版本
  const models = tencentcloud.iai.v20180301.Models; //API版本

  const Credential = tencentcloud.common.Credential;
  const ClientProfile = tencentcloud.common.ClientProfile;
  const HttpProfile = tencentcloud.common.HttpProfile;
  let cred = new Credential("AKIDypUyGMo2czFdu0La5NSK0UlpiPtEAuLa", "BAxXw99wa5OUOJ3bw52mPq57wa2HKAoG"); //key
  let httpProfile = new HttpProfile();
  httpProfile.endpoint = "iai.tencentcloudapi.com";
  let clientProfile = new ClientProfile();
  clientProfile.httpProfile = httpProfile;
  let client = new IaiClient(cred, "ap-guangzhou", clientProfile); //地域

  let req = new models.DetectFaceRequest();
  let params = '{"Url":"' + url + '","NeedFaceAttributes":1}' //拼接API参数
  req.from_json_string(params);
  return new Promise(function(resolve, reject) { //构造函数
    client.DetectFace(req, function(errMsg, response) {
      if (errMsg) {
        reject(errMsg)
      } else {
        resolve(response);
      }
    })
  })
}


exports.main = async(event, context) => {
  const data = event
  const fileList = [data.fileID]
  const result = await cloud.getTempFileURL({
    fileList,
  })
  const url = result.fileList[0].tempFileURL  
  datas = await synDetectFace(url) //调用异步函数
  return datas //返回异步函数内容
}