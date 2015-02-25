<!DOCTYPE html>
<html>
	<head>
		 <meta charset="utf-8">
		 <title>Smartlaunch SMS Payment System</title>
		 <script type="text/javascript" src="https://www.centili.com/widget/js/c-mobile-payment-scripts.js"></script>
	</head>
	<body>
		<?php
			
			$service_url = 'http://192.168.0.10:7833/users/buloy';
			$curl = curl_init ( $service_url );
			curl_setopt ( $curl, CURLOPT_RETURNTRANSFER, true );
			$curl_response = curl_exec ( $curl );
			if ( $curl_response === false ) {
				$info = curl_getinfo ( $curl );
				curl_close ( $curl );
				die ( 'error occured during curl exec. Additioanl info: ' . var_export($info) );
			}
			curl_close ( $curl );
			
			echo ( 'response ok!' );
			echo ( $curl_response );
			
			$strResponse = json_decode ( $curl_response );
			echo ( '<pre>' );
			print_r ( $strResponse );
			echo ( '</pre>' );
			
		?>
	</body>
</html>