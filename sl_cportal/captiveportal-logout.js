/**
 * Created by Dylan Hunt @ Smartlaunch on 3/08/2015.
 * ALTERED 4/10/2015 to support 1.0.2x86
 * Updated 4/14/2015
 * captiveportal-logout.js
 */

// 0: Error catching >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
$.ajaxSetup({
    // Usually triggered by invalid server IP:Port
    // (or if captiveportal-sl_ip.js not found)
    "error":function() { 
		console.log("Unknown AJAX Error");
		alert("Unknown AJAX Error");
	}
});

function setError(e, msg) {
    // Trigger error
    $.error(msg + " @ " + e);
}

function isSLOnlineAndReachable() {
    var completeURL = ServerAddress + "/smartlaunchversion";
    console.log(completeURL);

    $.getJSON(completeURL, null, function(result) { // Note crucial ?callback=?
        var ver = result.ServerVersion;
        if (ver) {
            IsServerOnline = true;
            console.log("SL Server online and reachable, v" + ver);

            // Update server status
            $( '#serverStatus' ).css('color', 'green');
            $( '#serverStatus' ).html("Server Online");
        }
    });
}

// 1: Globals >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var Prefix = "http://";                                     // ## EXAMPLES ##
var ServerIP = server[0];                                   // local IP; 192.168.0.25
var ServerPort = server[1];                                 // RESTful port; 7833
var ServerAddress = Prefix + ServerIP + ":" + ServerPort;   // http://192.168.0.25:7833
var Username = "";                                          // <?=$username;?> @ #username
var LogoutURL = "";                                         // <?=$logouturl;?> @ #logout
var LogoutID = "";                                          // <?=$sessionid;?> (hash) @ #logout_id (or $sessionid)
var Viewport = "";                                          // .width, .height
var Zone = "";                                              // <?=$cpzone;?> (smartlaunch) @ #zone
var LogoutNowFlag = false;                                  // When just about to log out, disable things like redirect notice

// 2: Init >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
$(document).ready(function() {
    // Detect if portrait; flip wallpaper
    Viewport = {
        width  : $(window).width(),
        height : $(window).height()
    };

    if (Viewport.height < Viewport.width) {
        //$( '#wrapper' ).css('background', 'none');
    }

    // a) Fade in
    $( '#wrapper' ).fadeIn(1200);

    // b) Update LogoutURL (after PHP swaps values)
    //LogoutURL = document.getElementById( 'logoutform2' ).action;
    LogoutURL = $( '#logoutform2' ).attr( 'action' );

    // c) Update LogoutID (LogoutID) (after PHP swaps values)
    LogoutID = $( '#logout_id2' ).val();
    //alert( 'LogoutID: ' + LogoutID );

    // d) Update Zone (after PHP swaps values)
    Zone = $( '#zone2' ).val();
    //alert( 'Zone: ' + Zone );

    // e) Update User
    //Username = $( '#username' ).value;
    Username = $( '#username' ).val();
    //alert( 'Username: ' + Username );

    // f) HIDE ELEMENTS
    $( '.loginform, #browserFail, #tos' ).remove();

    // g) Send info to Smartlaunch (Onload?)
    // TODO

    // h) Set title
    document.title = "Smartlaunch WiFi - Logout";

    // i) Enable tooltips
    $(function () {
        $(document).tooltip();
    });

    //// j) Hover over/out the form
    //$("#logoutformsection").hover(
    //    function() {
    //        // IN - Swap image
    //        $("#logo").attr('src', "captiveportal-logo-glow.png").fadeIn(400);
    //    },
    //    function() {
    //        // OUT - Swap image
    //        $("#logo").attr('src', "captiveportal-logo.png");
    //    });

    // k) Is SL reachable/online?
    //isSLOnlineAndReachable();

    // l) On Unload -- warn if user leaves
    window.onbeforeunload = function(){
        // Only prompt if not pending immediate logout!
        if (!LogoutNowFlag) {
            return 'Are you sure you want to leave?';
        }
    };

    // READY
    console.log("Login scripts loaded and executed @ " + ServerAddress);

// ^^ End Init ^^
});

// 3: Main: Button just clicked>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function tryLogout() {
    // TODO
    // alert('trying to logout');
    logoutSL();
}

// 4: Disconnect: Logout from SL >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function logoutSL() {
    // JS >> PHP:  captiveportal-restquery.php?resturl=http://localhost:7833/cportal/logout&username=dylan&logout_id=1234567890123456
    // PHP >> REST: http://slserver:7833/cportal/logout?username=dylan&logout_id=1234567890123456
    console.log("User '" + Username + "' attempting SL logout @ " + ServerAddress + "..");
    console.log('Attempting POST (bool, "str") >> ' + ServerAddress + "/cportal/logout?username=" + Username + "&logout_id=" + LogoutID);
    var request = "cportal/logout&username=" + Username + "&logout_id=" + LogoutID;
    SendAjaxPOST(request);


}

// 5: POST RESTful data via cross-domain ajax via PHP (POST) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function SendAjaxPOST(request) {
    // captiveportal-restquery.php?resturl=http://192.168.0.25:7833/cportal/
    // logout&username=dylan&logout_id=1234567890123456
    var baseURL = "captiveportal-restquery.php?resturl=" + ServerAddress + "/";
    var completeURL = baseURL + request;
	console.log(completeURL); //PHP URL

    $.ajax({
        url: completeURL,
        type: 'POST',
        //dataType: 'json',
        cache: false,
        success: function (data) {
            var JSONData = JSON.parse(data);
            var logout = JSONData.ReturnSuccess;
            var msg = JSONData.FailReason;
            //alert(logout);
            //alert(typeof logout);
            finalValidate(logout, msg);
        }
    });
}

// 6: Final logout validation: True/False? >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function finalValidate(logout, msg) {
    console.log("Trying to finalValidate");
    if (logout) {
        // Logout Successful - logout now
        logoutCPortal();
    } else if (!logout) {
        // Login Failed - show fancy alert
        $(' <div id="dialog" title="Failed to Logout"><span id="msg"></span></div>').dialog({
            modal: true,
            draggable: false,
            resizable: false
        });
        $(' #msg ').html(msg);
        console.log("SL Server Logout Fail Reason: " + msg);
    } else {
        alert("Unknown error during final logout validation");
        console.log("Unknown error during final logout validation");
    }
}

// 7: Already logged in SL, so now login to CPortal (POST) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function logoutCPortal() {
    // captiveportal_disconnect_client($_POST['logout_id']);
    // Final events after SL successfully logged out user
    console.log("Attempting final actions/POST before logging out..");

    // Delete existing dummy form (because of name conflicts) for testing, if they exist:
    $( '.dummy' ).remove();

    // Create dummy logout form and submit
    try {
        // Create dummy form and submit
        // a) Form with Logouturl
        var submit_form = document.createElement('form');
        submit_form.method = 'POST';
        submit_form.class = 'hideMe';
        submit_form.action = LogoutURL; // Obtained from '<?=$logouturl;?>' temp element
        submit_form.display =  'hidden';

        // b) sessionid input
        var input_sessionid = document.createElement('input');
        input_sessionid.name = 'logout_id';
        input_sessionid.class = 'hideMe';
        input_sessionid.type = 'HIDDEN';
        input_sessionid.value = LogoutID; // Obtained from '<?=$sessionid;?>' form value, AKA "logout_id"
        submit_form.appendChild(input_sessionid);

        // c) zone input
        var input_zone = document.createElement('input');
        input_zone.name = 'zone';
        input_zone.class = 'hideMe';
        input_zone.type = 'HIDDEN';
        input_zone.value = Zone; // Obtained from '<?=$cpzone;?>' form value
        submit_form.appendChild(input_zone);

        // d) logout submit btn
        var btnSubmit = document.createElement('input');
        btnSubmit.name = 'logout';
        btnSubmit.class = 'hideMe';
        btnSubmit.id = 'logout';
        btnSubmit.type = 'SUBMIT';
        btnSubmit.value = 'logout';
        submit_form.appendChild(btnSubmit);

        // Add form to body >> submit to logout
        LogoutNowFlag = true; // This is to prevent "Are you sure you want to leave?" prompts, etc
        document.body.appendChild(submit_form);
        $( '#logout' ).click()
    }
    catch(e) {
        setError("POST (LogoutCPortal())", "Unknown POST Error");
    }
}