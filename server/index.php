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