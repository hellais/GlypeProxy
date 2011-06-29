<?php
/*****************************************************************
* Plugin: MySpace
* Description:
*    Fixes an issue with MySpace AJAX requests. The AJAX library
*    attempts to resolve all relative URLs to absolute URLs, using
*    data from the current URL when necessary. This results in requests
*    for URLs such as http://yourproxy.com/relative/myspace/url.html
*    This plugin targets the code that fetches the URL of the current
*    page and replaces it with references to our proxified page URL.
*    
*    Note: the replacement is not technically 100% accurate since
*    it returns only the host and path components of the current URI.
*    The rest of the 'real' URL (filename and querystring) are not
*    available to us dynamically and should not be added here to
*    ensure no caching of user-specific URLs.
******************************************************************/

/*****************************************************************
* Pre-parsing applied BEFORE main proxy parser.
******************************************************************/

function preParse($input, $type) {

   switch ( $type ) {
         
      // Apply changes to Javascript documents
      case 'javascript':

         global $URL;
         if ( $URL['href'] == 'http://x.myspacecdn.com/modules/common/static/js/myspacejs065.js' ) {
            $input = str_replace('var urls = document.URL', "var urls=ginf.target.h+ginf.target.p", $input);
            $input = str_replace('else a=document.URL}', "else a=ginf.target.h+ginf.target.p}", $input);
         }
      
         break;
      
   }
   
   // Return changed
   return $input;

}
