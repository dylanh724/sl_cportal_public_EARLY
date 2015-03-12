/**
 * Created by Dylan Hunt @ Smartlaunch on 3/08/2015.
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
// 1: Globals >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var Prefix = "http://";                                     // ## EXAMPLES ##
var ServerIP = server[0];                                   // local IP; 192.168.0.25
var ServerPort = server[1];                                 // RESTful port; 8080
var ServerAddress = Prefix + ServerIP + ":" + ServerPort;   // http://192.168.0.25:8080
var User = "";                                              // <?=$username;?> @ #username
var LogoutURL = "";                                         // <?=$logouturl;?> @ #logout
var LogoutID = "";                                          // <?=$sessionid;?> (hash) @ #logout_id (or $sessionid)
var Zone = "";                                              // <?=$cpzone;?> (smartlaunch) @ #zone

// 2: Init >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
$(document).ready(function() {
    // a) Fade in
    $('#wrapper').fadeIn(1200);

    // b) Update logout_URL (after PHP swaps values)
    LogoutURL = document.logout.action;
    alert("LogoutURL: " + LogoutURL);

    // c) Update logoutURL (after PHP swaps values)
    LogoutID = document.getElementById( 'logout_id' ).value;
    alert("LogoutID:" + LogoutID);

    // d) Update Zone (after PHP swaps values)
    Zone = document.getElementById( 'zone' );
    alert("Zone:" + Zone);

    // e) Update User
    var Username = $username;
    alert("Username:" + Username);

    // f) Hide login elements
    $( '.loginform' ).remove();

    // g) Remove #X from html since it's no longer needed
    //$( '.remove' ).remove();

    // h) Send info to Smartlaunch
    // TODO
});

// 3: Main: Button just clicked>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function tryLogout() {
    // TODO
    User = document.getElementById( 'auth_user2' ).value;
    var pass = document.getElementById( 'auth_pass' ).value;

   loginSL(pass);
}

// 4: Disconnect: Logout from SL >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function loginSL(pass) {
    // PHP:  http://localhost:8080/users/dylan/logout
    // REST: http://localhost:8080/users/dylan/logout
    console.log("User '" + User + "' attempting SL login @ " + ServerAddress + "..");
    console.log("Attempting GET (Boolean) >> " + ServerAddress + "/cportal/login?username=" + User + "&password=***");
    var request = "cportal/login&username=" + User + "&password=" + pass;
    SendAjaxPOST(request);
}

// 5: Get RESTful data via cross-domain ajax via PHP (POST) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function SendAjaxPOST(request) {
    // captiveportal-restquery.php?resturl=http://192.168.0.25:7833/cportal/login&username=dylan&password=asdf
    var baseURL = "captiveportal-restquery.php?resturl=" + ServerAddress + "/";
    var completeURL = baseURL + request;
	//console.log(completeURL); //PHP URL

    $.ajax({
        url: completeURL,
        type: 'POST',
        //dataType: 'json',
        cache: false,
        success: function (data) {
            //alert(data);
            var JSONdata = JSON.parse(data);
            var logout = JSONdata[0];
            var msg = JSONdata[1];
			finalValidate(logout, msg);
        }
    });
}

// 6: Final logout validation: True/False? >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function finalValidate(logout, msg) {
    if (logout) {
        // Logout Successful - logout now
        logoutCPortal();
    } else if (!login) {
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
    // Final events after SL successfully logged out user
    console.log("Attempting final actions/POST before logging out..");

    // Delete existing dummy form (because of name conflicts) for testing:
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
        input_sessionid.value = RedirURL; // Obtained from '<?=$sessionid;?>' form value
        submit_form.appendChild(input_sessionid);

        // c) zone input
        var input_auth_user = document.createElement('input');
        input_auth_user.name = 'zone';
        input_auth_user.class = 'hideMe';
        input_auth_user.type = 'HIDDEN';
        input_auth_user.value = Username; // Obtained from '<?=$cpzone;?>' form value
        submit_form.appendChild(input_auth_user);

        // d) logout submit btn
        var btnSubmit = document.createElement('input');
        btnSubmit.name = 'logout';
        btnSubmit.class = 'hideMe';
        btnSubmit.id = 'logout';
        btnSubmit.type = 'SUBMIT';
        btnSubmit.value = 'logout';
        submit_form.appendChild(btnSubmit);

        // Add form to body >> submit to logout
        document.body.appendChild(submit_form);
        $( '#accept' ).click()
    }
    catch(e) {
        setError("POST (loginCPortal)", "Unknown POST Error");
    }
}