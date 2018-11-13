在[如何在小程序中实现文件上传下载](https://cloud.tencent.com/developer/article/1362728)文章中，我们介绍了小程序的上传基本使用教程，文末我们留下了一个引子。本文将介绍在小程序端，使用腾讯云云智AI应用服务来进行[人脸识别](https://cloud.tencent.com/product/FaceRecognition)检测分析，实现人脸识别等功能。

腾讯云人脸识别服务每月为各个接口提供 **1 万次** 的**免费**调用，我们可以利用腾讯云人脸识别服务所提供的API来实现我们一些简单的demo实验。目前腾讯云人脸识别服务所提供**人脸检测与分析、五官定位、人脸比对与验证、人脸检索、多脸检索、静态活体检测**等功能，为了方便演示，本教程只介绍**人脸检测与分析**API的使用，更多接口使用请参考[腾讯云人脸识别文档](https://cloud.tencent.com/document/product/867/17636)。

在教程开始之前，需要搭建搭建好小程序的基础开发环境，关于如何配置，大家可以参考[如何入门小程序开发](https://cloud.tencent.com/developer/article/1360040)这篇文章的**入门**教程。

## 人脸识别API申请

如果要使用人脸识别API，必须在腾讯云进行实名认证，实名认证后，您可以登录腾讯云 [控制台](https://console.cloud.tencent.com/ai) 进行使用。如果没有账号，请参考账号 [注册教程](https://cloud.tencent.com/document/product/378/9603)。注册完成后，需要创建相关开发密钥，不然无法使用API。

### 创建密钥

您需要在 [访问管理](https://console.cloud.tencent.com/cam/capi) 创建密钥，点击图中的新建密钥，即可创建密钥。

![1542095339804](https://techeek-cn-1251732175.cos.ap-chengdu.myqcloud.com/wx_AI_face/1542095339804.png)

创建完成后，点击SecretKey的显示按钮，显示当前SecretKey，然后将`APPID`、`SecretId`、`SecretKey`记录下了，后面教程中使用。人脸识别服务通过签名来验证请求的合法性，所以接下来的步骤，我们将介绍如何进行签名。

### 生成签名

签名步骤[官方文档](https://cloud.tencent.com/document/product/867/17719)写的非常详细，本文仅作简单介绍。签名方法非常简单，就两个步骤，拼接签名、生成签名。

拼接签名主要需要`APPID`、`Secret ID` 、`bucket`、`expiredTime`、`currentTime`、`rand`、`fileid`这几个参数，`APPID`、`Secret ID` 、在上一步骤中我们已经介绍。`Bucket`是图片资源的组织管理单元，历史遗留字段，可不填。`expiredTime`为签名的有效期。`currentTime`为当前时间。`rand`为随机串，需要自己生成。`fileid`资源存储的唯一标识，如果你的签名想使用多次，可不填。

当拼接完成后，需要HMAC-SHA1 算法对拼接签名进行加密，之后在将签名结果放在末尾，在进行base64编码。最终生成签名，是不是签名生成过程看蒙了？没关系，官方提供了相关签名代码，我们直接使用。我们只需要`APPID`、`Secret ID`、`SecretKey`这三个参数即可生成签名。首先，根据[如何在小程序中实现文件上传下载](https://cloud.tencent.com/developer/article/1362728)文章，搭建好上传文件所需环境，然后在服务器端，网站根目录，新建一个名为`signature.php`的文件。

```
cd /usr/share/nginx/html
sudo nano signature.php
```

然后写入下面的代码

```
<?php
$appid = "YOUR APPID_ID";
$bucket = "tencentyun";
$secret_id = "YOUR SECRET_ID";
$secret_key = "YOUR SECRET_KEY";
$expired = time() + 2592000;
$onceExpired = 0;
$current = time();
$rdm = rand();
$userid = "0";
$fileid = "tencentyunSignTest";
$srcStr = 'a='.$appid.'&b='.$bucket.'&k='.$secret_id.'&e='.$expired.'&t='.$current.'&r='.$rdm.'&f=';
$srcWithFile = 'a='.$appid.'&b='.$bucket.'&k='.$secret_id.'&e='.$expired.'&t='.$current.'&r='.$rdm.'&f='.$fileid;
$srcStrOnce= 'a='.$appid.'&b='.$bucket.'&k='.$secret_id.'&e='.$onceExpired .'&t='.$current.'&r='.$rdm
.'&f='.$fileid;
$signStr = base64_encode(hash_hmac('SHA1', $srcStr, $secret_key, true).$srcStr);
$srcWithFile = base64_encode(hash_hmac('SHA1', $srcWithFile , $secret_key, true).$srcWithFile );
$signStrOnce = base64_encode(hash_hmac('SHA1',$srcStrOnce,$secret_key, true).$srcStrOnce);
echo $signStr."\n"; 
echo $srcWithFile ."\n";
echo $signStrOnce."\n";
?>
```

注意，将`YOUR APPID_ID`替换为你的`APPID`，将`YOUR SECRET_ID`替换为你的`Secret ID`，将`YOUR SECRET_KEY`替换为你的`SecretKey`，如图。

![1542097262286](https://techeek-cn-1251732175.cos.ap-chengdu.myqcloud.com/wx_AI_face/1542097262286.png)

保存后，在浏览器访问你配置服务器的地址，比如我的签名地址是`https://weixin.techeek.cn/signature.php`，如图。

![1542097397192](https://techeek-cn-1251732175.cos.ap-chengdu.myqcloud.com/wx_AI_face/1542097397192.png)

这里会输出三行数据，第一行为可多次使用的签名，第二行验证与当前操作的文件路径是否一致才能使用的签名，第三行为单次使用签名，为了方便演示，我这里将介绍多次使用的签名使用，**复制第一行全部内容**，保存下来，后续使用。

到这里，我们所有的签名工作就完成了，建议签名完成后删除该文件，以防止其他人访问。

## 服务器端配置

在[如何在小程序中实现文件上传下载](https://cloud.tencent.com/developer/article/1362728)文章的教程中，我们已经配置好了上传服务器，没有配置好的同学请参考[这篇教程](https://cloud.tencent.com/developer/article/1362728)。接下来，需要在服务器端增加人脸识别API。

后续小程序将图片传输到服务器，由服务器向腾讯云的服务器发起HTTP请求，并将返回的请求数据返回给小程序。我们修改`index.php`文件为下面的内容。注意，将`YOUR SIGNATURE`修改为你在上一步中保存的一长串内容。将`YOUR APPID_ID`替换为你的`APPID`。将`YOUR DOMAIN`替换为你的域名，不要加`https://`。

```
<?php
move_uploaded_file($_FILES["file"]["tmp_name"], "upload/" . $_FILES["file"]["name"]);
$curl = curl_init();
$appid = "YOUR APPID_ID";
$domain_url = "YOUR DOMAIN";
$signature = "YOUR SIGNATURE";
$face_url = "------WebKitFormBoundary\r\nContent-Disposition: form-data; name=\"appid\"\r\n\r\n" . $appid . "\r\n------WebKitFormBoundary\r\nContent-Disposition: form-data; name=\"url\"\r\n\r\nhttps://". $domain_url ."/upload/" . $_FILES["file"]["name"] . "\r\n------WebKitFormBoundary--";
curl_setopt_array($curl, array(
  CURLOPT_URL => "https://recognition.image.myqcloud.com/face/detect",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => $face_url,
  CURLOPT_HTTPHEADER => array(
    "authorization:" . $signature ."",
    "cache-control: no-cache",
    "content-type: multipart/form-data; boundary=----WebKitFormBoundary",
    "host: recognition.image.myqcloud.com"
  ),
));
$response = curl_exec($curl);
curl_close($curl);
echo $response;
?>
```

修改完成后如图。注意，这里上传完图片路径存储在`/upload/`目录下，如果你没有按照我的教程去做，请修改你存储图片的目录。

![1542100334833](https://techeek-cn-1251732175.cos.ap-chengdu.myqcloud.com/wx_AI_face/1542100334833.png)

现在，访问你的配置的小程序域名`https://weixin.techeek.cn/`如果看到如图的内容，证明服务器已经搭建，这里报错正常，因为我们没有传输图片到这个接口，所以会报错。

![1542098798197](https://techeek-cn-1251732175.cos.ap-chengdu.myqcloud.com/wx_AI_face/1542098798197.png)

到这一步，我们的服务器搭建步骤就完成了。我解释一下服务端代码的作用吧，首先将图片上传到刚刚创建的`weixin.techeek.cn`（注意域名，需要改成你自己的）接口，该接口将上传的文件复制到`upload/`目录下，之后，服务器向`https://recognition.image.myqcloud.com/face/detect`接口发起HTTP请求，将你的图片的url地址及签名信息发送给腾讯云人脸识别接口，人脸识别接口识别图片后，返回相关数据，然后你的服务器将这些数据原封不动返回给前端，接下来的步骤中，我们将这些数据导入到小程序中处理。

## 小程序端配置

服务器端已经配置完成，接下来，我们需要配置小程序端的代码，首先，我们配置后端代码，打开`index.js`文件，修改代码如下。

```
Page({
  wx_face(){
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'https://weixin.techeek.cn/', //替换为你自己的接口地址
          header:{
            'Content-Type': 'application/json'
          },
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            console.log(res.data)
          }
        })
      }
    })
  },
})
```

这里就是[如何在小程序中实现文件上传下载](https://cloud.tencent.com/developer/article/1362728)文章中上传文件的代码，只不`success`这里，我们将返回的内容改为了`res.data`，有了这段代码，我们就可以实现将服务器端的数据展示出来。接下来，我们撰写前端，修改`index.wxml`代码如下。

```
<button type="primary" bindtap="wx_face">上传</button>
```

这里我们调用`wx_face`上传图片到服务器，等待服务器返回数据。点击控制台的`Network`按钮，然后点击我们前端界面的`上传`按钮，选择一张带人脸的照片，看看会发生什么。

![1542101790739](https://techeek-cn-1251732175.cos.ap-chengdu.myqcloud.com/wx_AI_face/1542101790739.png)

图片上传到服务器，我们看到小程序返回了一个json数组，这里返回的数组是腾讯云人脸识别接口返回的数据，证明人脸已经识别成功，这是请求成功返回的数据，这里的数组到底是什么意思呢？我们看看腾讯云[人脸检测与分析API](https://cloud.tencent.com/document/product/867/17588)的文档，如下表。

**请求头 header**

| 参数名         | 必选 | 值                                      | 描述                                                         |
| -------------- | ---- | --------------------------------------- | ------------------------------------------------------------ |
| host           | 是   | recognition.image.myqcloud.com          | 腾讯云人脸识别服务器域名                                     |
| content-length | 否   | 包体总长度                              | 整个请求包体内容的总长度，单位：字节（Byte）                 |
| content-type   | 是   | application/json 或 multipart/form-data | 据不同接口选择： 1. 使用 application/json 格式，参数为 url，其值为图片的 url ； 2. 使用 multipart/form-data 格式，参数为 image，其值为图片的二进制内容。 |
| authorization  | 是   | 鉴权签名                                | 多次有效签名，用于鉴权，生成方式见 [鉴权签名](https://cloud.tencent.com/document/product/867/17719) |

**请求参数**

使用 application/json 格式，参数选择 url ；使用 multipart/form-data 格式，参数选择 image。

| **参数名** | 必选 | 类型   | 参数说明                                                     |
| ---------- | ---- | ------ | ------------------------------------------------------------ |
| appid      | 是   | String | 接入项目的唯一标识，可在 [账号信息](https://console.cloud.tencent.com/developer) 或 [云 API 密钥](https://console.cloud.tencent.com/cam/capi) 中查看 |
| mode       | 否   | Int    | 检测模式：0-所有人脸，1-最大的人脸                           |
| image      | 否   | Binary | 图片内容                                                     |
| url        | 否   | String | 图片的 url、image提供一个即可；如果都提供，只使用url         |

**返回内容**

| 字段              | 类型            | 说明                                      |
| ----------------- | --------------- | ----------------------------------------- |
| data.session_id   | String          | 相应请求的 session 标识符，可用于结果查询 |
| data.image_width  | Int             | 请求图片的宽度                            |
| data.image_height | Int             | 请求图片的高度                            |
| data.face         | Array(faceItem) | 检测出的人脸信息列表                      |
| code              | Int             | 返回状态码                                |
| message           | String          | 返回错误消息                              |

**FaceItem 说明**

| 字段       | 类型   | 说明                                 |
| ---------- | ------ | ------------------------------------ |
| face_id    | String | 人脸标识                             |
| x          | Int    | 人脸框左上角 x                       |
| y          | Int    | 人脸框左上角 y                       |
| width      | Float  | 人脸框宽度                           |
| height     | Float  | 人脸框高度                           |
| gender     | Int    | 性别 [0(female)~100(male)]           |
| age        | Int    | 年龄 [0~100]                         |
| expression | Int    | 微笑[0(normal)~50(smile)~100(laugh)] |
| glass      | Bool   | 是否有眼镜 [true,false]              |
| pitch      | Int    | 上下偏移[-30,30]                     |
| yaw        | Int    | 左右偏移[-30,30]                     |
| roll       | Int    | 平面旋转[-180,180]                   |
| Beauty     | Int    | 魅力[0~100]                          |

我们先看看**请求头 header**和**请求参数**这里的内容眼熟嘛？这里的内容大部分参数我已经将其写在了我们服务器的请求文件`index.php`中，大家只需使用即可。撰写小程序时用不到。

我在再看看**返回内容**和**FaceItem 说明**，这里的数据是服务器返回的数据，参考这两个表格，我们才能知道当前返回的数据到底是什么意思。为了方便讲解，我将返回的json数组格式化后放在下方。

**服务器返回的json数组**

```
{
    "code":0,
    "message":"OK",
    "data":{
        "session_id":"",
        "image_height":500,
        "image_width":500,
        "face":[
            {
                "face_id":"2843632291225292737",
                "x":149,
                "y":118,
                "height":202,
                "width":202,
                "pitch":14,
                "roll":0,
                "yaw":0,
                "age":22,
                "gender":0,
                "glass":false,
                "expression":35,
                "glasses":0,
                "mask":0,
                "hat":0,
                "beauty":81,
                "face_shape":{
                    "face_profile":Array[21],
                    "left_eye":Array[8],
                    "right_eye":Array[8],
                    "left_eyebrow":Array[8],
                    "right_eyebrow":Array[8],
                    "mouth":Array[22],
                    "nose":Array[13]
                }
            }
        ]
    }
}
```

因为源文件较长，我将`face_shape`中几个数组隐藏掉了。我们对照表格，看看返回的数组到底是什么意思。`face_id`为人脸标识，每张图片返回的标识不同，我们可以不用在意。`x`、`y`为人脸框的坐标标记，返回的数组中为`149`和`118`。`width`和`height`为人脸的宽高，返回的数据为`202`和`202`。接下来`pitch`和`yaw`为人脸的偏移量，返回的数据为`14`和`0`证明这张脸基本在中心位置。之后的数据`age`为年龄，人脸识别结果为`22`岁。`gender`为性别，这里的数值为`0`根据表格判断为男性。`glass`为`false`表明不戴眼镜。`mask`为当前是否面部被遮挡。这里返回值为`0`证明未被遮挡。`hat`这里的数值为`0`证明没有带帽子。`beauty`为魅力，根据表格，这里的魅力为`81`。根据这些信息，我们可以判断，这是一个没有戴眼镜，帽子等遮挡物，一个比较帅的小伙子。

但是这里的数据仅仅是给程序员看的，我们能不能把它转换成正常人能读懂的数据呢？当然可以，修改`index.wxml`代码如下。

```
<button type="primary" bindtap="wx_face">上传</button>
<text>上传状态：{{message}}</text>
<text>年龄：{{age}}</text>
<text>是否带眼镜：{{glasses}}</text>
<text>是否带帽子：{{glasses}}</text>
<text>脸部是否被遮挡：{{glasses}}</text>
<text>颜值：{{beauty}}</text>
```

这段代码中，我们判断其是否带帽子，是否戴眼镜，年龄和颜值是多少。接下来，修改后端代码，打开`index.js`文件，代码如下。

```
Page({
  wx_face(){
    var myThis = this;
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'https://weixin.techeek.cn/', //替换为你自己的接口地址
          header:{
            'Content-Type': 'application/json'
          },
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            var obj = JSON.parse(res.data)
            myThis.setData({
              message: obj.message,
              age: obj.data.face[0].age,
              glasses: obj.data.face[0].glasses,
              beauty: obj.data.face[0].beauty,
              mask: obj.data.face[0].mask,
              hat: obj.data.face[0].hat
            })
          }
        })
      }
    })
  },
})
```

这段代码中，我们将返回的的数据通过`JSON.parse()`方法转为json数据，然后将返回的数据通过`setData`方法赋予相关变量，然后前端显示相关变量，比如`age: obj.data.face[0].age`这段代码的意思是将json数组中data数组内的face数组中age数组赋予`age`变量。然后在前端显示，如图。

![1542103497852](https://techeek-cn-1251732175.cos.ap-chengdu.myqcloud.com/wx_AI_face/1542103497852.png)

现在上传任意带人脸的图片，就能识别用户的颜值等信息。这里的信息还是较少，并且界面不太好看，我们优化下前端代码。

![](https://techeek-cn-1251732175.cos.ap-chengdu.myqcloud.com/wx_AI_face/1542109645925.png)

现在试试能不能正常使用。

![](https://techeek-cn-1251732175.cos.ap-chengdu.myqcloud.com/wx_AI_face/1542109707502.png)

已经能够正常使用了！这个小程序的代码我将其分享在了github，感兴趣的小伙伴可以去[这里](https://github.com/Techeek/WX_TencentAI_Face)下载。