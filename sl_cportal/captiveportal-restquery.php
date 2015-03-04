<?php

	####################
	# --SMARTLAUNCH--  #
	# Created by Edwin #	
	# Altered by Dylan #
	####################

	# GET >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    # http://localhost/sl_cportal_test/captiveportal-restquery.php?resturl=http://localhost:7833/cportal/login&username=dylan&password=asdf
    $url = "restquery.php";

	# 1: resturl=http://192.168.0.25:7833/cportal/
	# $url=http://192.168.0.25:7833/cportal/
	if ( isset( $_GET["resturl"] ) ) {
		#$url = urldecode($_GET["resturl"]);
		$url = $_GET["resturl"];
		
		# 2: username=dylan
		# $url=http://192.168.0.25:7833/cportal/login?username=dylan
		if ( isset( $_GET["username"] ) ) {
			$url .= "?username=" . $_GET["username"];

			# 3: password=asdf
			# $url=http://192.168.0.25:7833/cportal/login?username=dylan&password=asdf
			if ( isset( $_GET["password"] ) ) {
				$url .= "&password=" . $_GET["password"];

				# Successful input: GET response/output
				$curl = curl_init ( $url );
				curl_setopt ( $curl, CURLOPT_RETURNTRANSFER, true );
				$curl_response = curl_exec ( $curl );

				if ( $curl_response === false ) {
					$info = curl_getinfo ( $curl );
					curl_close ( $curl );
					die ( 'Server Offline or Unknown Error: ' . var_export($info) );
				}
				curl_close ( $curl );
				
	# FAILED >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
			} else {
				# Fail 3: password
                #echo $url . "....";
				$curl_response = '{"login":false,"msg":"Invalid Password"}';
			}
		} else {
			# Fail 2: username
            #echo $url . "....";
			$curl_response = '{"login":false,"msg":"Invalid Username"}';
		}	
	} else {
		# Fail 1: resturl
        #echo $url . "....";
		$curl_response = '{"login":false,"msg":"Invalid RestURL"}';
	}
		
	# OUTPUT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	echo ( $curl_response );
	#echo(json_encode($curl_response));
	#echo(json_encode($curl_response, true));