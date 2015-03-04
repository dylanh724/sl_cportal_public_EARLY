/**
 * Created by Dylan Hunt @ Smartlaunch on 2/15/2015.
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

// 1: Init >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
$(document).ready(function() {
    // 1: Fade in
    $('#wrapper').fadeIn(1200);
});

// 2: Globals >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var Prefix = "http://";
var ServerIP = server[0];   // local IP
var ServerPort = server[1]; // RESTful port
var ServerAddress = Prefix + ServerIP + ":" + ServerPort;

// 3: Main: Button just clicked>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function tryLogin() {
    // Get User + pass (+voucher) from form
    var user = document.getElementById( 'auth_user' ).value;
    var pass = document.getElementById( 'auth_pass' ).value;
    var voucher = document.getElementById( 'auth_voucher' ).value;
    var voucherLogin = false;
    if (voucher !== "") {
        voucherLogin = true
    }
    if (initValidate(user, pass, voucher, voucherLogin)) {
        loginSL(user, pass);
    }
}

// 4: Validate form BEFORE RESTful >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function initValidate(_user, _pass, _voucher, _voucherLogin) {
    if (_voucherLogin) {
        // Check for invalid voucher (ignore user+pass)
        if (_voucher == "" || _voucher.length !== 6) {
            setError("auth_voucher", "Invalid 6-Char Voucher");
            return false;
        }
    } else {
        // Check for bad user (ignore voucher)
        if (_user == "") {
            setError("auth_user", "Invalid Username");
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
function loginSL(user, pass) {
    // PHP:  http://localhost:7833/cportal/login&username=dylan&password=asdf
    // REST: http://localhost:7833/cportal/login?username=dylan&password=asdf
    console.log("User '" + user + "' attempting SL login @ " + ServerAddress + "..");
    console.log("Attempting GET (Boolean) >> " + ServerAddress + "/cportal/login?username=" + user + "&password=***");
    var request = "cportal/login&username=" + user + "&password=" + pass;
    SendAjaxPOST(request);
}

// 6: Get RESTful data via cross-domain ajax via PHP (POST) >>>>>>>>>>>>>>>>>>>>>>>>>>
function SendAjaxPOST(request) {
    // captiveportal-restquery.php?resturl=http://192.168.0.25:7833/cportal/login&username=dylan&password=asdf
    var baseURL = "captiveportal-restquery.php?resturl=" + ServerAddress + "/";
    var completeURL = baseURL + request;
	console.log(completeURL);
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
    alert(login);
    //alert ("=");
    //alert(login = true);
    //alert ("==");
    //alert(login == true);
    //alert ("===");
    //alert(login === true);

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
        console.log(msg);
    } else {
        alert("Unknown error during final validation");
        console.log("Unknown error during final validation");
    }
}

// 8: Already logged in SL, so now login to CPortal (POST) >>>>>>>>>>>>>>>>>>>>>>>>>>>
function loginCPortal() {
    // Final events after loginSL success
    console.log("Attempting final actions/POST..");
    try {
        // POST
        var form = document.createElement('loginform');
        form.setAttribute('method', 'post');
        form.setAttribute('action', '');
        form.style.display = 'hidden';
        document.body.appendChild(form);
        form.submit();
        $.post( "" );
    }
    catch(e) {
        setError("POST", "Unknown POST Error");
    }
}