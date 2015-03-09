<!DOCTYPE html>
<html>
<head>
	<!-- Created by Dylan Hunt @ Smartlaunch -->
	<title>Smartlaunch WiFi Login</title>
	<!-- Favicon 196x196 -->
	<link rel="icon" href="captiveportal-favicon.png">
	<!-- jQuery-UI Style -->
	<link rel="stylesheet" href="captiveportal-jquery-ui.css">
	<!-- Main Style -->
	<link type="text/css" rel="stylesheet" href="captiveportal-normalize.css">
	<link type="text/css" rel="stylesheet" href="captiveportal-style.css">
	<!-- jQuery Scripts -->
	<script src="captiveportal-jquery-2.1.3.js"></script>
	<!-- jQuery-UI Scripts -->
	<script src="captiveportal-jquery-ui.js"></script>
	<!-- Smartlaunch Scripts -->
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
<div id="wrapper">  <!-- Wrapper -->

	<!-- Logout below -->
	<section class="loginform cf" id="loginform">
		<div id="status">
			<ul>
				<li>Status:</li></li><br>
				<li></li><br>
				<br><br>
			</ul>
		</div>
		<form name="logout" id="logout" method="POST" action="<?=$logouturl;?>">
			<input name="logout_id" type="hidden" value="<?=$sessionid;?>">
			<input name="zone" type="hidden" value="<?=$cpzone;?>">
			<input name="logout" type="submit" value="Logout">
		</FORM>
	</section>
	<!-- /Logout above -->

	<!-- Test -->
	<span>TEST:</span><br>
	<?php echo ("<span>" . $_POST['test'] . "</span>"); ?>
	<?php if (isset($_POST['logout_id'])) echo ("<span>" . $_POST['logout_id'] . "</span>"); ?>
	<!-- /Test -->

</div> <!-- /Wrapper -->
</body>
</html>
