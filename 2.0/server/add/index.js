const cloud = require('wx-server-sdk')
const tencentcloud = require("tencentcloud-sdk-nodejs");
var synDetectFace = function(url){
  const IaiClient = tencentcloud.iai.v20180301.Client;
  const models = tencentcloud.iai.v20180301.Models;

  const Credential = tencentcloud.common.Credential;
  const ClientProfile = tencentcloud.common.ClientProfile;
  const HttpProfile = tencentcloud.common.HttpProfile;
  let cred = new Credential("AKIDypUyGMo2czFdu0La5NSK0UlpiPtEAuLa", "BAxXw99wa5OUOJ3bw52mPq57wa2HKAoG");
  let httpProfile = new HttpProfile();
  httpProfile.endpoint = "iai.tencentcloudapi.com";
  let clientProfile = new ClientProfile();
  clientProfile.httpProfile = httpProfile;
  let client = new IaiClient(cred, "ap-guangzhou", clientProfile);

  let req = new models.DetectFaceRequest();
  let params = '{"Url":"' + url + '"}'
  req.from_json_string(params);
  return new Promise(function(resolve, reject){
    client.DetectFace(req, function(errMsg, response) {
      if (errMsg) {
        reject(errMsg)
      }else{
        resolve(response);
      }
    })
  })
}

cloud.init()

exports.main = async (event, context) => {
  const data = event
  datas = await synDetectFace(data.url)
  return datas
}