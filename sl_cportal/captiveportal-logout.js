/**
 * captiveportal-logout.js
 * Created by Dylan Hunt @ Smartlaunch on 3/08/2015.
 */

// 0: Error catching >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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
// 1: Globals >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var Prefix = "http://";
var ServerIP = server[0];   // local IP
var ServerPort = server[1]; // RESTful port
var ServerAddress = Prefix + ServerIP + ":" + ServerPort;
var RedirURL = "";
var PortalAction = "";
var User = "";
var logoutID = "";
var zone = "";

// 2: Init >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
$(document).ready(function() {
    // 1: Fade in
    $('#wrapper').fadeIn(1200);

    // 2: Update logout_id (after PHP swaps values)
    logoutID = document.getElementById( 'redirurl').value;
    //alert(RedirURL);

    // 3: Update portal action (after PHP swaps values)
    PortalAction = document.getElementById( 'portalaction').value;
    //alert(PortalAction);

    // 4: Remove #2 & #3 from html since it's no longer needed
    $( '.remove' ).remove();
});

// 3: Main: Button just clicked>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function tryLogin() {
    // Get User + pass (+voucher) from form
    User = document.getElementById( 'auth_user2' ).value;
    var pass = document.getElementById( 'auth_pass' ).value;
    var voucher = document.getElementById( 'auth_voucher' ).value;
    var voucherLogin = false;

    if (voucher !== "") {
        voucherLogin = true
    }
    if (initValidate(pass, voucher, voucherLogin)) {
        loginSL(pass);
    }
}

// 4: Validate form BEFORE RESTful >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function initValidate(_pass, _voucher, _voucherLogin) {
    if (_voucherLogin) {
        // Check for invalid voucher (ignore user+pass)
        if (_voucher == "" || _voucher.length !== 6) {
            setError("auth_voucher", "Invalid 6-Char Voucher");
            return false;
        }
    } else {
        // Check for bad user (ignore voucher)
        if (User == "") {
            setError("auth_user2", "Invalid Username");
            return false;
        }
        // Check for bad pass (ignore voucher)
        if (_pass == "") {
            setError("auth_pass", "Invalid Password");
            return false;
        }
        // Success
        return true;
    }
}

// 5: Success: Finally login the user to SL>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function loginSL(pass) {
    // PHP:  http://localhost:7833/cportal/login&username=dylan&password=asdf
    // REST: http://localhost:7833/cportal/login?username=dylan&password=asdf
    console.log("User '" + User + "' attempting SL login @ " + ServerAddress + "..");
    console.log("Attempting GET (Boolean) >> " + ServerAddress + "/cportal/login?username=" + User + "&password=***");
    var request = "cportal/login&username=" + User + "&password=" + pass;
    SendAjaxPOST(request);
}

// 6: Get RESTful data via cross-domain ajax via PHP (POST) >>>>>>>>>>>>>>>>>>>>>>>>>>
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
            var login = JSONdata[0];
            var msg = JSONdata[1];
			finalValidate(login, msg);
        }
    });
}

// 7: Final login validation: True/False? >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function finalValidate(login, msg) {
    if (login) {
        // Login Successful - show fancy alert
        $(' <div id="dialog" title="Smartlaunch">Successful Login<br><em>Please wait..</em></div>').dialog({
            modal: true,
            draggable: false,
            resizable: false
        });
        console.log(msg);
        loginCPortal();
    } else if (!login) {
        // Login Failed - show fancy alert
        $(' <div id="dialog" title="Failed Login"><span id="msg"></span></div>').dialog({
            modal: true,
            draggable: false,
            resizable: false
        });
        $(' #msg ').html(msg);
        console.log("SL Server Fail Reason: " + msg);
    } else {
        alert("Unknown error during final validation");
        console.log("Unknown error during final validation");
    }
}

// 8: Already logged in SL, so now login to CPortal (POST) >>>>>>>>>>>>>>>>>>>>>>>>>>>
function loginCPortal() {
    // Final events after loginSL success
    console.log("Attempting final actions/POST..");

    // Create dummy form and submit
    try {
        // Create dummy form and submit
        var submit_form = document.createElement('form');
        submit_form.method = 'POST';
        submit_form.class = 'hideMe';
        submit_form.action = PortalAction; // Obtained from $PORTAL_ACTION$ temp element
        submit_form.display =  'hidden';

        // redirurl
        var input_redirurl = document.createElement('input');
        input_redirurl.name = 'redirurl';
        input_redirurl.class = 'hideMe';
        input_redirurl.type = 'HIDDEN';
        input_redirurl.value = RedirURL; // Obtained from $PORTAL_REDIRURL$ temp element
        submit_form.appendChild(input_redirurl);

        // auth_user
        var input_auth_user = document.createElement('input');
        input_auth_user.name = 'auth_user';
        input_auth_user.class = 'hideMe';
        input_auth_user.type = 'HIDDEN';
        input_auth_user.value = User; // Obtained from 'auth_user2' form value
        submit_form.appendChild(input_auth_user);

        // submit btn
        var btnSubmit = document.createElement('input');
        btnSubmit.name = 'accept';
        input_redirurl.class = 'hideMe';
        btnSubmit.id = 'accept';
        input_redirurl.type = 'HIDDEN';
        btnSubmit.type = 'SUBMIT';
        btnSubmit.value = 'accept';
        submit_form.appendChild(btnSubmit);

        // Add to form and submit
        document.body.appendChild(submit_form);
        $( '#accept' ).click()
    }
    catch(e) {
        setError("POST (loginCPortal)", "Unknown POST Error");
    }
}