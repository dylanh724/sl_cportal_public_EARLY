<!DOCTYPE html>
<html>
	<head>
        <!--
        ############################################################################################################
        # Created by Dylan Hunt @ Smartlaunch on 2/15/2015 v2
        # ALTERED 4/10/2015 to support 1.0.2x86
        # Updated 4/15/2015
        # captiveportal-login-logout.php
        #########################################################################################################-->
        <title>Smartlaunch WiFi</title>
            <!-- Favicon 196x196 -------------------------------------------------------------------------------------->
            <link rel="icon" href="captiveportal-favicon.png">

            <!-- jQuery-UI Style -------------------------------------------------------------------------------------->
            <link rel="stylesheet" href="captiveportal-jquery-ui.css">

            <!-- Main Style ------------------------------------------------------------------------------------------->
            <link type="text/css" rel="stylesheet" href="captiveportal-normalize.css">
            <link type="text/css" rel="stylesheet" href="captiveportal-style.css">

            <!-- jQuery Scripts --------------------------------------------------------------------------------------->
            <script src="captiveportal-jquery-2.1.3.js"></script>

            <!-- jQuery-UI Scripts ------------------------------------------------------------------------------------>
            <script src="captiveportal-jquery-ui.js"></script>

            <!-- Smartlaunch Scripts ---------------------------------------------------------------------------------->
            <script type="text/javascript" charset="utf-8" src="captiveportal-sl_ip.js"></script><?php

            if (!isset($sessionid)) {
            echo '
            <script type="text/javascript" charset="utf-8" src="captiveportal-login.js"></script>';
            echo '
            <script>';
            echo '  var sid = "";';
            echo '
            </script>';
        } else {
            echo '
            <script type="text/javascript" charset="utf-8" src="captiveportal-logout.js"></script>';
            echo '
            <script>';
            echo "  var sid = \"$sessionid\";";
            echo '
            </script>';
        }

            ?>
            <script language="text/javascript">
            // Extra js here
            </script>
        <style>
            // Override css here
        </style>
	</head>
	<body>
	<span id="browserFail"><h3>Your browser does not support Javascript:
	<br><br>
	Try <a href="http://www.google.com/chrome/">Chrome</a> or <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a></h3></span>
	<!-- Wrapper ================================================================================================-->
		<div id="wrapper">

            <!-- TOS ---------------------------------------------------------------------------------------------->
            <div id="tos">
                <h3>By signing in, you are agreeing to abide by our <em>Terms of Service</em></h3>
                <p>
                    <br>
                    1. By signing in via Smartlaunch WiFi Captive Portal, you agree to adhere to the residing
                    cafe rules and policies.
                    <br>
                    2. Your computers IP and MAC addresses are kept on cafe servers
                    for the sole reason to be able to identify your WiFi account with your Smartlaunch
                    account.
                     <br>
                    3. Rest assured, as we promise to <em>never</em> sell or give away your information.
                    <!-- TODO: Add a comment about HTTPS encryption -->
                </p>
            </div>

			<!-- Login below -------------------------------------------------------------------------------------->
			<section class="loginform cf" id="loginformsection">
                <form name="login" id="loginform">
                    <ul>
                        <li>
                            <img src="captiveportal-logo.png" id="logo">
                        </li>
                        <li>
                            <div id="serverStatus">Server Offline</div>
                        </li>
                        <li>
                            <input id="auth_user2" name="auth_user" type="text" placeholder="SL Username" required="true">
                            <br><br>
                        </li>
                        <li>
                            <input id="auth_pass" name="auth_pass" type="password" placeholder="SL Password">
                            <br><br>
                        </li>
                        <li>
                            <input id="auth_voucher" name="auth_voucher" type="text" Placeholder="Optional Ticket #">
                        </li>
                        <li>
                            <div class="removeMe">
                                <input name="redirurl2"     id="redirurl"       type="hidden" value="$PORTAL_REDIRURL$">
                                <input name="portalaction2" id="portalaction"   type="hidden" value="$PORTAL_ACTION$">
                                <input name="clientmac"     id="clientmac"      type="hidden" value="$CLIENT_MAC$">
                                <input name="clientip"      id="clientip"       type="hidden" value="$CLIENT_IP$">
                                <input name="logouturl2"    id="logouturl2"     type="hidden" value="?=$logouturl;?">
                            </div>
                            <input name="logouturl" id="logouturl"  type="hidden" value="$PORTAL_ACTION$">
                            <input name="accept2"   id="accept2"    type="button" value="Login WiFi"    onclick="tryLogin()">
                            <input name="register"  id="register"   type="button" value="Register"      onclick="tryRegister()">
                            <br><br>
                            <span id="help"><a href='javascript:tryRequestAssistance()'>:: Request Assistance ::</a></span>
                        </li>
                    </ul>
                </form>
			</section>
			</section>
            <!-- /Login -->

			<!-- Logout below ------------------------------------------------------------------------------------->
			<section class="logoutform cf"      id="logoutsection">
				<form name="logoutform2"        id="logoutform2" method="POST" action="<?=$logouturl;?>">
				    <img src="captiveportal-logo.png" id="logo">
					<input name="logout_id2"    id="logout_id2" type="hidden" value="<?=$sessionid;?>">
					<input name="zone2"         id="zone2"      type="hidden" value="<?=$cpzone;?>">
                    <input name="username"      id="username"   type="hidden" value="<?=$username;?>">
                    <p id="userText">Welcome, <?=$username;?>!</p>
                    <!-- Put timer here ? -->
                    <div class="timeLeft">
                        <label for="status">Status:</label>
                    <p><input name="status"     id="status"     type="text" placeholder="..." readonly="true" value="Logged In"></p>
					<input name="logout2"       id="logout2"    type="button" value="Logout WiFi" onclick="tryLogout()">
					</div>
					<br><p id="keepOpen">:: Keep This Window Open ::</p>
				</form>
			</section>
            <!-- /Logout -->

		</div>
	<!-- /Wrapper ===============================================================================================-->
	</body>
</html>