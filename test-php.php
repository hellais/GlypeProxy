<?php


$test_url = "http://eqt5g4fuenphqinx.onion/";
$socks_host = "127.0.0.1";
$socks_port = 9050;

$curl = curl_init();

curl_setopt($curl, CURLOPT_URL, $test_url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);

curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
curl_setopt($curl, CURLOPT_PROXY, $socks_host);
curl_setopt($curl, CURLOPT_PROXYPORT, $socks_port);
curl_setopt($curl, CURLOPT_PROXYTYPE, CURLPROXY_SOCKS5);

$content = curl_exec($curl);

print curl_getinfo($curl, CURLINFO_HTTP_CODE);
if($content == false) {
  echo 'Curl error: '. curl_errno($curl) . curl_error($curl);
}

else {

  echo "<pre>" . htmlentities($content) . "</pre>";
  curl_close($curl);

}


?>
