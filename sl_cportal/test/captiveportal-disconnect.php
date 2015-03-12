<?php 
require_once("config.inc");
require_once("functions.inc");
require_once("filter.inc");
require_once("radius.inc");
require_once("voucher.inc");
require_once("captiveportal.inc");

echo "TRYING..";
if ($_GET['logout_id']) {
	$sessionid = $_GET['logout_id'];
	echo "ok..";
	captiveportal_disconnect_client($sessionid);
	echo "ok.";
} else {
	echo 'no';
}