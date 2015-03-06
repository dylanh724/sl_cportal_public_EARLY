<?php
	$ip = '192.168.0.25'; 
	$port = 8080; 
	
	if ( isset( $_GET["ip"] ) ) {
		$ip = $_GET["ip"];
	}
	
	if ( isset( $_GET["port"] ) ) {
		$port = $_GET["port"];
	}

	$waitTimeoutInSeconds = 1; 
	if($fp = fsockopen($ip,$port,$errCode,$errStr,$waitTimeoutInSeconds)){   
	   echo "Server Connected @ " . $ip . ":" . $port;
	} else {
	   echo "Server Offline @ " . $ip . ":" . $port;
	} 
	fclose($fp);