/**
 * Created by Dylan @ Smartlaunch on 2/15/2015.
 */
// 0: Error catching >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
$.ajaxSetup({
    // Usually triggered by invalid server IP:Port
    // (or if captiveportal-sl_ip.js not found)
    "error":function() { alert("Unknown Error"); }
});

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

// TODO: Find Server IP & port

// 3: Main >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function tryLogin() {
    // Get User + pass (+voucher) from form
    var user = document.getElementById( 'auth_user' ).value;
    var pass = document.getElementById( 'auth_pass' ).value;
    var voucher = document.getElementById( 'auth_voucher' ).value;
    var voucherLogin = false;
    if (voucher !== "") { voucherLogin = true }
    if (initValidate(user, pass, voucher, voucherLogin)) {
        login(user, pass);
    }
}

// 4: Validate form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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

// 5: Set error on fail >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function setError(e, msg){
    // Trigger error
    $.error(msg + " @ " + e)
}

// 6: Success: Finally login the user >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function login(user, pass) {
    // http://localhost:7833/cportal/login?username=dylan&password=asdf
    console.log("User '" + user + "' attempting login @ " + ServerAddress + "..");
    var request = ServerAddress + "/cportal/login?username=" + user + "&password=" + pass;
    console.log("Attempting GET (Boolean) >> " + ServerAddress + "/cportal/login?username=" + user + "&password=***");
    $.getJSON(request, function (result) {
        if (result) {
            $(' <div id="dialog" title="Successful Login">Success! Logging in..</div>').dialog();
            console.log("Successfully logged into SL");
            finalEvents();
        } else {
            $(' <div id="dialog" title="Failed Login">Invalid Credentials<br>(or unavailable WiFi slot)</div>').dialog({
                modal: true,
                draggable: true,
                resizable: false,
            });
            console.log("Invalid credentials, or unavailable WiFi slot");
        }
    });
}

// 7: Final events after successful login (POST) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function finalEvents() {
    // Final events after login success
    console.log("Attempting final actions/POST..")
    try {
        // POST
        var form = document.createElement('loginform');
        form.setAttribute('method', 'post');
        form.setAttribute('action', '$PORTAL_ACTION$');
        form.style.display = 'hidden';
        document.body.appendChild(form)
        form.submit();
        //$.post( "$PORTAL_ACTION$" );
    }
    catch(e) {
        setError("POST", "Unknown Error");
    }
}