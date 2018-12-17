使用腾讯云[人脸识别](https://cloud.tencent.com/product/FaceRecognition)API在小程序上的基本演示demo，使用本demo能够快速搭建一个小程序人脸识别服务，效果如图。

![](https://techeek-cn-1251732175.cos.ap-chengdu.myqcloud.com/wx_AI_face/Snipaste_2018-12-14_17-02-37.png)

具体demo使用及代码内容详见[如何在小程序中使用人脸识别](https://www.techeek.cn/wx-AI-face)这篇文章。

项目分为服务端及客户端，只需将服务端部署好，然后修改部分内容，即可实现完整项目。

# 服务端
- server文件夹

请打开`server`文件夹，查看 *readme.md* 文件，有详细的部署教程。

# 客户端
- client文件夹

将`index.js`文件中下面的内容替换
> `url: 'https://weixin.techeek.cn/',` //替换为你自己的接口地址，要加https://

# 更新日志
> 2018年12月17日 修改服务端为Docker服务，部署更加便捷。小程序端代码增加备注  
> 
> 2018年12月14日 新增人脸识别框及标记  
> 
> 2018年11月29日 修复小程序端遮挡及戴帽子误报BUG  
> 
> 2018年11月15日 优化代码，不需要在按照以前的教程查看`signature.php`文件后在修改`index.php`才能使用。现在直接按照上文修改相关内容，就可以使用本demo。 将以前多次有效签名变为单次，签名10s内过期，增加安全性。  
> 
> 2018年11月13日 创建项目