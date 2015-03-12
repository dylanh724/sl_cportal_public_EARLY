<?php 

if ($_SERVER['REMOTE_ADDR']) {
	$clientip = $_SERVER['REMOTE_ADDR'];
	echo $clientip;
}