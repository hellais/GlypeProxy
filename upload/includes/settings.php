<?php
/*******************************************************************
* Glype Proxy Script
*
* Copyright (c) 2008, http://www.glype.com/
*
* Permission to use this script is granted free of charge
* subject to the terms displayed at http://www.glype.com/downloads
* and in the LICENSE.txt document of the glype package.
*******************************************************************
* Our settings file. Self-explanatory - stores the config values.
* Changelog:
*  - Prior to 1.0, settings were stored as constants. Now these are
*    in a $CONFIG array, which allows changes to be made by plugins.
******************************************************************/

/*****************************************************************
* Installation options
******************************************************************/

// Theme/skin to use. This should be the name of the appropriate folder
// inside the /themes/ folder.
$CONFIG['theme'] = 'default';

// Temporary directory used by the script. By default, the caching feature
// server-side cookie storage and logs use the temp dir. If using these features,
// ensure the directory is writable.
$CONFIG['tmp_dir'] = GLYPE_ROOT . '/tmp/';

// Use GZIP compression when sending pages back to the user. This reduces
// bandwidth usage but at the cost of increased CPU load.
$CONFIG['gzip_return'] = false;

// Warn users before browsing a secure site if on an unsecure connection
$CONFIG['ssl_warning'] = true;

// The fastest and most reliable method of ensuring javascript is
// properly proxified is to override the native javascript functions
// with our own. However, this may interfere with any other
// javascript added to the page, such as ad codes.
$CONFIG['override_javascript'] = false;

// Load limiter. This attempts to fetch the server load and the script stops
// serving pages whenever we go over the limit. Set to 0 to disable.
// Requires shell_exec() so safe_mode must be off.
$CONFIG['load_limit'] = 0;

// Censor content. Any text in the list below will be replaced with '####'
// in the returned parsed document.
$CONFIG['censor_words'] = array();

// Footer include. Anything specified here will be added to the bottom of all
// proxified pages just before the </body> tag.
$CONFIG['footer_include'] = '';

// License key for removing copyright link. Leave blank if you don't have a license.
$CONFIG['license_key'] = '';


/*****************************************************************
* URL encoding options
******************************************************************/

// Use PATH_INFO? Generates URL like: browse.php/aHr3i0fsde/33rds/dtd/
$CONFIG['path_info_urls'] = false;

// Generate unique URLs for each visitor
$CONFIG['unique_urls'] = false;


/*****************************************************************
* Hotlinking
******************************************************************/

// Protect against hotlinking - redirect users to index
$CONFIG['stop_hotlinking'] = true;

// Allow hotlinking from these domains
$CONFIG['hotlink_domains'] = array();


/*****************************************************************
* Caching options
******************************************************************/

// Enable or disable the cache feature
$CONFIG['use_cache'] = false;

// Apply caching to requests for resources with these file extensions
$CONFIG['cache_file_types'] = array('css', 'jpg', 'jpeg', 'png', 'gif', 'js', 'flv', 'zip', 'rar');

// Apply caching to all websites or only the sites explicitly listed?
$CONFIG['cache_all'] = false;

// Apply caching to the following websites (if above is FALSE)
$CONFIG['cache_sites'] = array('myspace.com', 'google.', 'facebook.com', 'bebo.com');

// URL to cache folder, e.g. http://www.yourproxy.com/cache/
$CONFIG['cache_url'] = GLYPE_URL . '/tmp/cache/';

// Path to cache folder, e.g. /home/proxy/public_html/cache/
$CONFIG['cache_path'] = $CONFIG['tmp_dir'] . 'cache/';

// Note: to share a cache folder between multiple proxies, simply set the
// above locations to the appropriate values on all proxies.


/*****************************************************************
* Logging options
******************************************************************/

// Enable the logging feature
$CONFIG['enable_logging'] = false;

// Destination for log files. Use an absolute path and ensure the
// specified destination (file or directory) is writable.
//  - set to a file to log everything to a single file
//  - set to a directory (with trailing slash) for one log file per day
$CONFIG['logging_destination'] = $CONFIG['tmp_dir'] . 'logs/';

// Log all requests? Set to false to log only HTML pages.
$CONFIG['log_all'] = false;


/*****************************************************************
* Website access control
* You can restrict access to websites through your proxy with either
* a whitelist or a blacklist:
*  - Whitelist: any site that IS NOT on the list will be blocked.
*  - Blacklist: any site that IS on the list will be blocked
******************************************************************/

// Block everything except these sites
$CONFIG['whitelist'] = array();

// Block the following sites
$CONFIG['blacklist'] = array();


/*****************************************************************
* User access control
* You can ban users from accessing your proxy by IP address.
* Bans can be set by adding strings to the array in the format:
*  - single IP addresses or ranges (using a hyphen separator) in dotted quad format
*  - IP address ranges in slash notation
* Examples of acceptable formats to use here:
*  127.0.0.1                          127.0.0.1-127.0.0.5
*  192.168.17.1/16                    127.0.0.1/255.255.255.255
*  189.128/11
******************************************************************/

$CONFIG['ip_bans'] = array();


/*****************************************************************
* Transfer options
******************************************************************/

// Time to wait for the connection (seconds) [0 for no limit]
$CONFIG['connection_timeout'] = 5;

// Time to allow for the entire transfer (seconds) [0 for no limit]
$CONFIG['transfer_timeout'] = 0;

// Allow resuming of transfers
$CONFIG['resume_transfers'] = false;

// Maximum filesize permitted for downloads through the proxy (bytes) [0 for no limit]
$CONFIG['max_filesize'] = 0;

// Speed limit for target to proxy downloads (bytes/second) [0 for no limit]
$CONFIG['download_speed_limit'] = 0;

// Queue transfers up so we only have one transfer running at a time per user
$CONFIG['queue_transfers'] = true;


/*****************************************************************
* Cookies
******************************************************************/

// All cookies must be sent to the proxy script. The script can then choose the
// correct cookies to forward to the target server. However there are finite limits
// in both the client's storage space and the size of the request Cookie: header that
// the server will accept. For prolonged browsing, you may wish to store cookies
// server side to avoid this problem.
// This has obvious privacy issues - if using this option, ensure your site clearly
// states how it handles cookies and protect the cookie data from unauthorised access.
$CONFIG['cookies_on_server'] = false;

// Path to folder to use for cookie storage. Default is "/{$CONFIG['tmp_dir']}/cookies/"
// but ideally this would be above the webroot to protect the data.
$CONFIG['cookies_folder'] = $CONFIG['tmp_dir'] . 'cookies/';

// If the cookies are being forwarded to the client (as by default they are), the
// name, the domain that set the cookie and value can be encoded.
// Note: increases load and increases cookie sizes by 33%
$CONFIG['encode_cookies'] = false;


/*****************************************************************
* Maintenance
******************************************************************/

// How often to clear the temporary files created by the script? [hours]
// Set to 0 to disable automated cleaning of the tmp directory.
// $CONFIG['tmp_dir'] must point to a writable folder to use this option.
$CONFIG['tmp_cleanup_interval'] = 0;

// When should old log files be deleted? [days]
// Set to 0 to never delete log files.
$CONFIG['tmp_cleanup_logs'] = 0;


/*****************************************************************
* User configurable options.
* These affect the user's browsing experience and are displayed on
* the index page and the mini-form.
*     title   = text displayed next to option
*     default = value to use unless/until overridden by user
*     desc    = lengthier description displayed as tooltip on default theme
*     force   = this allows you to remove the user choice and force default
******************************************************************/

$CONFIG['options'] = array(

   'encodeURL'    => array('title'	 => 'Encode URL',
                           'default' => true,
                           'desc'    => 'Encodes the URL of the page you are viewing so that it does not contain the target site in plaintext.',
                           'force'   => false),
   
   'encodePage'   =>	array('title'	 => 'Encode Page',
                           'default' => false,
                           'desc'    => 'Helps avoid filters by encoding the page before sending it and decoding it with javascript once received. This is not 100% reliable and may break functionality in some browsers.',
                           'force'   => false),
                           
   'showForm'     => array('title'   => 'Show Form',
                           'default' => true,
                           'desc'    => 'This provides a mini form at the top of each page to allow you to quickly jump to another site without returning to our homepage.',
                           'force'   => true),
                           
   'allowCookies'	=>	array('title'   => 'Allow Cookies',
                           'default' => true,
                           'desc'    => 'Cookies may be required on interactive websites (especially where you need to log in) but advertisers also use cookies to track your browsing habits.',
                           'force'   => false),
                           
   'tempCookies'	=>	array('title'   => 'Force Temporary Cookies',
                           'default' => true,
                           'desc'    => 'This option overrides the expiry date for all cookies and sets it to at the end of the session only - all cookies will be deleted when you shut your browser. (Recommended)',
                           'force'   => true),
                           
   'stripTitle'   =>	array('title'	 => 'Remove Page Titles',
                           'default' => false,
                           'desc'    => 'Removes titles from proxified pages.',
                           'force'   => true),
                           
   'stripJS'      =>	array('title'   => 'Remove Scripts',
                           'default' => true,
                           'desc'    => 'Remove scripts to protect your anonymity and speed up page loads. However, not all sites will provide an HTML-only alternative. (Recommended)',
                           'force'   => false),
                           
   'stripObjects'	=>	array('title'   => 'Remove Objects',
                           'default' => false,
                           'desc'    => 'You can increase page load times by removing unnecessary Flash, Java and other objects. If not removed, these may also compromise your anonymity.',
                           'force'   => false)
);


/*****************************************************************
* Do not edit this section manually!
******************************************************************/

// Settings file version for determining compatability with admin tool
$CONFIG['version'] = '1.1';


//---PRESERVE ME---
// Anything below this line will be preserved when the admin control panel rewrites
// the settings. Useful for storing settings that don't/can't be changed from the control panel
