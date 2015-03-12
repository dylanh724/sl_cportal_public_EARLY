<?php 
require_once("config.inc");
require_once("captiveportal.inc");

global $cpzone;

$cpzone = $_REQUEST['zone'];
$cpcfg = $config['captiveportal'][$cpzone];
echo $cpcfg;