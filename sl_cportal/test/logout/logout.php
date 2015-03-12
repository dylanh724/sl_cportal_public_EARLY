<!DOCTYPE html>
<html>
	<head>
		<!--
		#############################################################################################################
		# Created by Dylan Hunt @ Smartlaunch on 2/15/2015
		# logout.php
		#############################################################################################################
		-->
		<title>Smartlaunch WiFi Login</title>
		<!-- Favicon 196x196 --------------------------------------------------------------------------------------->
		<link rel="icon" href="captiveportal-favicon.png">
		<!-- jQuery-UI Style --------------------------------------------------------------------------------------->
		<link rel="stylesheet" href="captiveportal-jquery-ui.css">
		<!-- Main Style -------------------------------------------------------------------------------------------->
		<link type="text/css" rel="stylesheet" href="captiveportal-normalize.css">
		<link type="text/css" rel="stylesheet" href="captiveportal-style.css">
		<!-- jQuery Scripts ---------------------------------------------------------------------------------------->
		<script src="captiveportal-jquery-2.1.3.js"></script>
		<!-- jQuery-UI Scripts ------------------------------------------------------------------------------------->
		<script src="captiveportal-jquery-ui.js"></script>
		<!-- Smartlaunch Scripts ----------------------------------------------------------------------------------->
		<script type="text/javascript" charset="utf-8" src="captiveportal-sl_ip.js"></script>
		<script>
			// Initialization - load main script
			$.getScript("captiveportal-logout.js", function(){
				console.log("Logout scripts loaded and executed.");
				// Use anything defined in the loaded script...
			});
		</script>
	</head>
	<body>
	<div id="wrapper">
	<!-- Wrapper --------------------------------------------------------------------------------------------------->

		<!-- Logout below ------------------------------------------------------------------------------------------>
		<section class="loginform cf" id="loginform">
			<div id="status">
				<ul>
					<li>Status:</li></li><br>
					<li></li><br>
					<br><br>
				</ul>
			</div>

			<form name="logout" id="logout" method="POST" action="<?=$logouturl;?>">
				<input name="logout_id" id ="logout_id" type="hidden" value="<?=$sessionid;?>">
				<input name="zone" id="zone" type="hidden" value="<?=$cpzone;?>">
				<div class="remove">
					<input name="redirurl2" id="redirurl" type="hidden" value="$PORTAL_REDIRURL$">
					<input name="portalaction2" id="portalaction" type="hidden" value="$PORTAL_ACTION$">
					<input name="portalmsg" id="portalmsg" type="hidden" value="$PORTAL_MESSAGE$">
					<input name="clientmac" id="clientmac" type="hidden" value="$CLIENT_MAC$">
					<input name="clientip" id="clientip" type="hidden" value="$CLIENT_IP$">
					<input name="username" id="username" type="hidden" value="$USERNAME$">
				</div>
				<input name="logout" id="btnLogout" type="submit" value="Logout">
			</FORM>
		</section>
		<!-- /Logout above ----------------------------------------------------------------------------------------->

		<!-- Test -------------------------------------------------------------------------------------------------->
		<span>TEST:</span><br>
		<?php echo ("<span>" . $_POST['test'] . "</span>"); ?>
		<?php if (isset($_POST['logout_id'])) echo ("<span>" . $_POST['logout_id'] . "</span>"); ?>
		<!-- /Test ------------------------------------------------------------------------------------------------->

	<!-- /Wrapper -------------------------------------------------------------------------------------------------->
	</div>
	</body>
</html>
