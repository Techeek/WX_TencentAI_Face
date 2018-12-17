<?php
$appid = "125********5";  //这里替换成你在腾讯云申请到的appid  
$domain_url = "weixin.techeek.cn";  //这里替换成你服务器的域名，不要加https://  
$secret_id = "A**************************a";  //这里替换成你在腾讯云申请到的secret_id  
$secret_key = "B************************G";  //这里替换成你在腾讯云申请到的secret_key  
$bucket = "tencentyun";
$expired = time() + 10;
$current = time();
$rdm = rand();
$srcStrOnce= 'a='.$appid.'&b='.$bucket.'&k='.$secret_id.'&e='.$expired.'&t='.$current.'&r='.$rdm.'&f=';
$signStrOnce = base64_encode(hash_hmac('SHA1',$srcStrOnce,$secret_key, true).$srcStrOnce);
?>