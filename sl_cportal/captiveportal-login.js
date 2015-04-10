/**
 * captiveportal-login.js v2
 * Created by Dylan Hunt @ Smartlaunch on 2/15/2015.
 * ALTERED 4/10/2015 to support 1.0.2x86
 */
// LOGIN (Register @ bottom) #####################################################################################
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
var ServerPort = server[1];                                 // RESTful port; 7833
var ServerAddress = Prefix + ServerIP + ":" + ServerPort;   // http://192.168.0.25:7833
var RedirURL = "";                                          // logout.php
var PortalAction = "";                                      // #
var User = "";                                              // dylan
var Clientmac = "";                                         // aa:bb:cc:dd:ee:ff:gg
var Clientip = "";                                          // 192.168.0.100
//var Zone = "";                                              // <?=$cpzone;?> (smartlaunch) @ #zone

// 2: Init >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
$(document).ready(function() {
    // a) Fade in
    $( '#wrapper' ).fadeIn(1200);

    // b) Update redirurl (after PHP swaps values)
    RedirURL = $( '#redirurl' ).val();
    //alert(RedirURL);

    // c) Update portal action (after PHP swaps values)
    PortalAction = $( '#portalaction').val();
    //alert(PortalAction);

    // d) <ENTER> event
    $( '#auth_user, #auth_pass, #auth_voucher' ).keyup(function (event) {
        if (event.keyCode == 13) {
            $( '#accept2' ).click();
        }
    });

    // e) TOS accordion by ID
    $(function () {
        $( '#tos' ).accordion({
            collapsible: true,
            active: false
        });
    });

    // f) Set title
    document.title = "Smartlaunch WiFi - Login";

    // g) HIDE ELEMENTS
    $( '.logoutform' ).remove();
    $( '#browserFail' ).remove();

    // h) Transfer effect
    $( '#accept2' ).click(function () {
        // Button is clicked..
    });

    // i) Get clientmac
    Clientmac = $( '#clientmac' ).val();
    //alert("mac: " + Clientmac);

    // j) Get clientip
    Clientip = $( '#clientip' ).val();
    //alert("ip: " + Clientip);

    // k) Get zone
    //Zone = $( '#zone' ).val();
    //alert("zone: " + Zone);

    // l) Enable tooltips
    $(function () {
        $(document).tooltip();
    });

    // m) Focus 1st input field
    $( 'input:text:visible:first' ).focus();

    // READY
    //TODO: Add a $_GET cmd for a 'running!' boolean
    console.log("Login scripts loaded and executed @ " + ServerAddress);

// ^^ End init ^^
});

// 3: Main: Button just clicked>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function tryLogin() {
    // Get User + pass (+voucher) from form
    User = $( '#auth_user2' ).val();
    var pass = $( '#auth_pass' ).val();
    var voucher = $( '#auth_voucher' ).val();
    var voucherLogin = false;
    if (voucher !== "") {
        voucherLogin = true
    }
    if (initValidate(pass, voucher, voucherLogin)) {
        loginSL(pass);
    }
}

// 4: Validate form BEFORE RESTful >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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

// 5: Success: Finally login the user to SL>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function loginSL(pass) {
    // PHP:  captiveportal-restquery.php?resturl=http://localhost:7833/cportal/login&username=dylan&password=asdf&clientmac=aa:bb:cc:dd:ee:ff&clientip=192.168.0.100
    // REST: http://slserver:7833/cportal/login?username=dylan&password=asdf&clientmac=aa:bb:cc:dd:ee:ff&clientip=192.168.0.100
    console.log("User '" + User + "' (" + Clientmac + ", " + Clientip +  ") attempting SL login @ " + ServerAddress + "..");
    console.log("Attempting GET (Boolean) >> " + ServerAddress + "/cportal/login?username=" + User + "&password=***&clientmac=" + Clientmac + "&clientip=" + Clientip);
    var request = "cportal/login&username=" + User + "&password=" + pass + "&clientmac=" + Clientmac + "&clientip=" + Clientip;
    SendAjaxPOST(request);
}

// 6: Get RESTful data via cross-domain ajax via PHP (POST) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function SendAjaxPOST(request) {
    // captiveportal-restquery.php?resturl=http://192.168.0.25:7833/cportal/
    // login&username=dylan&password=asdf&clientmac=C4:6E:1F:04:9B:29&clientip=192.168.0.25
    var baseURL = "captiveportal-restquery.php?resturl=" + ServerAddress + "/";
    var completeURL = baseURL + request;
	console.log(completeURL); //PHP URL; shows plaintext password! Comment out before release
    $.ajax({
        url: completeURL,
        type: 'POST',
        //dataType: 'json',
        cache: false,
        success: function (data) {
            var JSONData = JSON.parse(data);
            var login = JSONData.ReturnSuccess;
            var msg = JSONData.FailReason;
            //alert(msg);
            finalValidate(login, msg);
        }
    });
}

// 7: Final login validation: True/False? >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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
        $(' <div id="dialog" title="Failed Login"><span class="msg"></span></div>').dialog({
            modal: true,
            draggable: false,
            resizable: false
        });
        $(' .msg ').html(msg);
        console.log("SL Server Login Fail Reason: " + msg);
    } else {
        alert("Unknown error during final login validation");
        console.log("Unknown error during final login validation");
    }
}

// 8: Already logged in SL, so now login to CPortal (POST) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function loginCPortal() {
    // Final events after loginSL success
    console.log("Attempting final actions/POST before logging in..");

    // Create dummy form and submit
    try {
        // Create dummy login form and submit
        // a) Form with portal action
        var submit_form = document.createElement('form');
        submit_form.method = 'POST';
        submit_form.class = 'hideMe';
        submit_form.action = PortalAction; // Obtained from $PORTAL_ACTION$ temp element
        submit_form.display =  'hidden';

        // b) redirurl input
        var input_redirurl = document.createElement('input');
        input_redirurl.name = 'redirurl';
        input_redirurl.class = 'hideMe';
        input_redirurl.type = 'HIDDEN';
        input_redirurl.value = RedirURL; // Obtained from $PORTAL_REDIRURL$ temp element
        //input_redirurl.value = ''; // Obtained from $PORTAL_REDIRURL$ temp element
        submit_form.appendChild(input_redirurl);

        // c) auth_user input
        var input_auth_user = document.createElement('input');
        input_auth_user.name = 'auth_user';
        input_auth_user.class = 'hideMe';
        input_auth_user.type = 'HIDDEN';
        input_auth_user.value = User; // Obtained from 'auth_user2' form value
        submit_form.appendChild(input_auth_user);

        // d) accept submit btn
        var btnSubmit = document.createElement('input');
        btnSubmit.name = 'accept';
        btnSubmit.class = 'hideMe';
        btnSubmit.id = 'accept';
        btnSubmit.type = 'SUBMIT';
        btnSubmit.value = 'accept';
        submit_form.appendChild(btnSubmit);

        // Add form to body >> submit to login
        document.body.appendChild(submit_form);
        $( '#accept' ).click()
    }
    catch(e) {
        setError("POST (loginCPortal)", "Unknown POST Error");
    }
}

// REGISTER (login @ top)#########################################################################################
// 1: Register button was pressed
function tryRegister() {
    // TODO
    $( '#register' ).tooltip({ items: "#register", content: "Coming Soon!"});
    $( '#register' ).tooltip("open");
    showRegister();
    validateRegister();
}

function showRegister(){
    // TODO
}

function validateRegister() {
    // TODO
}

function sendToSL() {
    // TODO
    // TODO: Also add to restquery.php to expect this
    finalizeRegistration();
}

function finalizeRegistration() {
    // TODO
    // Fill in username from POST
}