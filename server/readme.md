# 简介
服务端项目分为普通的php服务环境和docker服务环境，推荐尝鲜小白用户使用docker服务，直接按照docker命令部署即可，若想使用php服务端，则需要搭建Nginx+PHP环境，比较麻烦，不推荐小白使用。
# docker端（推荐）
## 安装docker
本文将以Ubuntu 16.04系统为例，其他系统请自行搜索如何安装Docker。执行下面的命令安装docker运行环境。  
```shell
sudo apt update
sudo apt install docker.io
sudo apt install docker-compose
```
## 修改配置
clone本项目，进入`Server`文件夹，修改`nginx`配置、复制SSl证书到`ssl`目录，然后修改`PHP`运行代码。
### 上传SSL证书
打开`ssl`文件夹，将你自己申请到的SSL证书复制到这个目录下，记住SSL证书的名称。
### 修改Nginx配置
打开`nginx-config`目录中的`nginx.conf`配置文件，将`weixin.techeek.cn`改为你自己的域名。将`techeek.cn.crt`和`techeek.cn.key`改为你自己的密钥名称。
### 修改PHP代码
打开`php-server`文件夹，找到`signature.php`文件，按照文件内描述，修改下面的内容。
```php
$appid = "125********5";  //这里替换成你在腾讯云申请到的appid  
$domain_url = "weixin.techeek.cn";  //这里替换成你服务器的域名，不要加https://  
$secret_id = "A**************************a";  //这里替换成你在腾讯云申请到的secret_id  
$secret_key = "B************************G";  //这里替换成你在腾讯云申请到的secret_key  
```
## 部署服务
修改完这三个文件，就可以开始部署了，在`server`目录下，运行下面代码。
```shell
sudo docker-compose up -d
```
服务端搭建完成
# php服务端（不推荐）
需要安装`Nginx`和`PHP`，只需将`php-server`文件内容部署到你自己搭建的环境即可。这里只提供php文件，其他请自行摸索。