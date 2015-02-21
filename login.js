/**
 * Created by Smartlaunch on 2/15/2015.
 */
// Error catching >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
$.ajaxSetup({
    "error":function() { alert("error"); }
});

// Init >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
$(document).ready(function() {
    // Fade in
    $('#wrapper').fadeIn(1200);
});

// Globals >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var Prefix = "http://";
var ServerIP = "localhost";
var ServerPort = "7833";
var ServerAddress = Prefix + ServerIP + ":" + ServerPort;

// TODO: Find Server IP & port

// Main >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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

function setError(e, msg){
    // Trigger error
    $.error(msg + " @ " + e);
}

function login(user, pass) {
    // http://localhost:7833/cportal/login?username=dylan&password=asdf
    console.log("User '" + user + "' attempting login @ " + ServerAddress + "..");
    var request = ServerAddress + "/cportal/login?username=" + user + "&password=" + pass;
    console.log("GET (Boolean) >> " + ServerAddress + "/cportal/login?username=" + user + "&password=***");
    $.getJSON(request, function (result) {
        if (result) {
            $(' <div id="dialog" title="Successful Login">Success! Logging in..</div>').dialog();
            console.log("Success! Logging in..");
            document.getElementById("submit").onclick = finalEvents();
        } else {
            $(' <div id="dialog" title="Failed Login">Invalid Credentials<br>(or unavailable WiFi slot)</div>').dialog();
            console.log("Invalid credentials, or unavailable WiFi slot");
        }
    });
}

function finalEvents() {
    // Post-login
}