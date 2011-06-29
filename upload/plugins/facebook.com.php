<?php
/*****************************************************************
* Plugin: Facebook
* Description:
*  Masks the real user-agent so Facebook gives us a nicer page
*  that the proxy can parse more easily.
******************************************************************/

/**
 * Pre-request is called after all options are determined and
 * immediately before the request
 * @return void
 */
function preRequest() {

   global $toSet;
   $toSet[CURLOPT_USERAGENT] = '-';

}
