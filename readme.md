使用腾讯云[人脸识别](https://cloud.tencent.com/product/FaceRecognition)API在小程序上的基本演示demo，使用本demo能够快速搭建一个小程序人脸识别服务，效果如图。

![](https://techeek-cn-1251732175.cos.ap-chengdu.myqcloud.com/wx_AI_face/1542109707502.png)

具体demo使用及代码内容详见[如何在小程序中使用人脸识别](https://www.techeek.cn/wx-AI-face)这篇文章。

项目分为服务端及客户端，只需将服务端部署好，然后修改部分内容，即可实现完整项目。

**服务端**
- server文件夹

将`signature.php`文件中下面的内容替换为你自己的
> `$appid = "125********5";`  //这里替换成你在腾讯云申请到的appid  
> `$domain_url = "weixin.techeek.cn";`  //这里替换成你服务器的域名，不要加https://  
> `$secret_id = "A**************************a";`  //这里替换成你在腾讯云申请到的secret_id  
> `$secret_key = "B************************G"; ` //这里替换成你在腾讯云申请到的secret_key 

**客户端**
- client文件夹

将`index.js`文件中下面的内容替换为你自己的
> `url: 'https://weixin.techeek.cn/',` //替换为你自己的接口地址，要加https://

**更新日志**

> 2018年11月15日 优化代码，不需要在按照以前的教程查看`signature.php`文件后在修改`index.php`才能使用。现在直接按照上文修改相关内容，就可以使用本demo。 将以前多次有效签名变为单次，签名10s内过期，增加安全性。  
> 
> 2018年11月13日 创建项目