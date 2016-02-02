<?php

error_reporting(-1);
ini_set('display_errors', 'On');

$DEBUG = false;

session_start() ;

require_once __DIR__ . '/../facebook/src/Facebook/autoload.php';

$SITE_URL = "http://tinhngheviet.com/zone1/";

$FB_PERMISSIONS = ['email', 'user_likes', 'user_about_me', 'user_photos', 'user_friends'];

$fb = new Facebook\Facebook([
  'app_id'                => '523680331135122',
  'app_secret'            => '130610d4491f84f6ab291c18519c4d8d',
  'default_graph_version' => 'v2.5',
]);

$fb_session_key = 'facebook_access_token';

if (isset ($_GET['logout'])) {
  unset($_SESSION[$fb_session_key]);
  $accessToken = "";
  $logged = false;
} else if (isset($_GET['login'])) {
  $helper = $fb->getJavaScriptHelper();

  try {
    $accessToken = $helper->getAccessToken();
  } catch(Facebook\Exceptions\FacebookResponseException $e) {
    // When Graph returns an error
    if ($DEBUG) {
      echo 'Graph returned an error: ' . $e->getMessage();
      exit;
    }
  } catch(Facebook\Exceptions\FacebookSDKException $e) {
    // When validation fails or other local issues
    if ($DEBUG) {
      echo 'Facebook SDK returned an error: ' . $e->getMessage();
      exit;
    }
  }

  if  (! isset($accessToken)) {
    if ($DEBUG) {
      exit();
    }
  } else {
    $_SESSION['facebook_access_token'] = (string) $accessToken;
  }
}

$logged = false;

if (isset ($_SESSION[$fb_session_key])) {
  $accessToken = $_SESSION[$fb_session_key];
  $logged = true;
}
