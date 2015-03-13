<!DOCTYPE html>
<html>
	<head>
        <!--
        ############################################################################################################
        # Created by Dylan Hunt @ Smartlaunch on 2/15/2015 v2
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

	</head>
	<body>
	<!-- Wrapper ================================================================================================-->
		<div id="wrapper">

			<!-- Login below -------------------------------------------------------------------------------------->
			<section class="loginform cf" id="loginformsection">
                <form name="login" id="loginform">
                    <div id="tos">
                        <h3>By signing in, you are agreeing with our TOS</h3>
                        <p>
                            By signing in via Smartlaunch WiFi Captive Portal, you agree to adhere to the residing
                            cafe rules and policies. Your computers IP and MAC addresses are kept on cafe servers
                            for the sole reason to be able to identify your WiFi account with your Smartlaunch
                            account. Rest assured, as we promise to NEVER sell/give away your information!
                            <!-- TODO: Add a comment about HTTPS encryption -->
                        </p>
                    </div>
                    <br>
                    <ul>
                        <li>
                            <label for="auth_user2">Username</label>
                            <input id="auth_user2" name="auth_user" type="text" placeholder="SL Username" required="true">
                            <br><br>
                        </li>
                        <li>
                            <label for="auth_pass">Password</label>
                            <input id="auth_pass" name="auth_pass" type="password" placeholder="SL Password">
                            <br><br>
                        </li>
                        <li>
                            <Label for="auth_voucher">Optional Voucher</label>
                            <input id="auth_voucher" name="auth_voucher" type="text" Placeholder="Optional Voucher Code">
                            <br><br>
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
                        </li>
                    </ul>
                </form>
			</section>
            <!-- /Login -->

			<!-- Logout below ------------------------------------------------------------------------------------->
			<section class="logoutform cf"      id="logoutsection">
				<form name="logoutform2"        id="logoutform2" method="POST" action="<?=$logouturl;?>">
					<input name="logout_id2"    id="logout_id2" type="hidden" value="<?=$sessionid;?>">
					<input name="zone2"         id="zone2"      type="hidden" value="<?=$cpzone;?>">
					<input name="logout2"       id="logout2"    type="button" value="Logout (js)" onclick="tryLogout()">
				</form>
			</section>
            <!-- /Logout -->

            <!-- DUMMY Logout below ------------------------------------------------------------------------------->
            <!-- Delete before release -->
            <section class="logoutform cf dummy" id="logoutdummysection">
                <form name="dummylogoutform"     id="dummylogoutform"   method="POST" action="<?=$logouturl;?>">
                    <input name="logout_id"      id="logout_id"         type="hidden" value="<?=$sessionid;?>">
                    <input name="zone"           id="zone"              type="hidden" value="<?=$cpzone;?>">
                    <input name="username"       id="username"          type="hidden" value="<?=$username;?>">
                    <input name="logout"         id="logout"            type="submit" value="Logout (orig)">
                </form>
            </section>
            <!-- /Logout -->

		</div>
	<!-- /Wrapper ===============================================================================================-->
	</body>
</html>