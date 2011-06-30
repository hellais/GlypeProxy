<?php
if(
preg_match('#^((https?)://(?:([a-z0-9-.]+:[a-z0-9-.]+)@)?([a-z0-9-.]+)(?::([0-9]+))?)(?:/|$)((?:[^?/]*/)*)([^?]*)(?:\?([^\#]*))?(?:\#.*)?$#i', $_GET['url'], $tmp)
)
{
  $invalid = 0;
  $website = $_GET['url'];
}
else {
  $invalid = 1;
}
?>
<html>
<head>
   <title>Warning you are leaving tor2web</title>
</head>
<body>
<?php if($invalid == 1) {
?>
<h2>Invalid URL! (XSS Attempt?) </h2>
<?php
} else {
?>
<h2>Warning leaving tor2web for external website</h2>

<a href="<?php echo urldecode($website);?>">Click here to proceed to <?php echo htmlentities($website);?></a><br>
it is advised to not click on the link as it will leak the referer, the site you are comming from.<br>
For added privacy, you should copy the URL from the following textbox and paste it directly into your browser.
<br><br>
<textarea><?php echo urldecode($website);?></textarea>
<?php } ?>
</body>
</html>
