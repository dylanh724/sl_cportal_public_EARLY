/**
 * captiveportal-login.js
 * Created by Dylan Hunt @ Smartlaunch on 2/15/2015.
 * ALTERED 4/10/2015 to support 1.0.2x86
 * Updated 4/15/2015
 */
// LOGIN (Register @ bottom) #####################################################################################
// 0: Error catching >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
$.ajaxSetup({
    // Usually triggered by invalid server IP:Port
    // (or if captiveportal-sl_ip.js not found)
    "error":function() { 
		console.log("Unknown AJAX Error: Server probably offline, or firewall issue for RESTful port");
	}
});

function setError(e, msg) {
    // Trigger error
    $.error(msg + " @ " + e);
}

function setTooltip(id, content) {
    $( id ).tooltip({ items: id, content: content});
    $( id ).tooltip("open");
}

function isSLOnlineAndReachable() {
    var completeURL = ServerAddress + "/smartlaunchversion";
    console.log(completeURL);

    $.getJSON(completeURL, null, function(result) { // Note crucial ?callback=?
        var ver = result.ServerVersion;
        if (ver) {
            IsServerOnline = true;
            console.log("SL Server online and reachable, v" + ver);

            // Success -- Update server status
            $( '#serverStatus').css('color', 'green');
            $( '#serverStatus').html("Server Online");

            // READY
                console.log("Login scripts loaded and executed @ " + ServerAddress);
        } else {
            IsServerOnline = false;
            console.log("Login scripts LOCAL ONLY, SL Server unreachable @ " + ServerAddress);
        }
    });
}

// 1: Globals >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var Prefix = "http://";                                     // ## EXAMPLES ##
var ServerIP = server[0];                                   // local IP; 192.168.0.25
var ServerPort = server[1];                                 // RESTful port; 7833
var ServerAddress = Prefix + ServerIP + ":" + ServerPort;   // http://192.168.0.25:7833
var IsServerOnline = false;                                 // from isSLOnlineAndReachable()
var RedirURL = "";                                          // logout.php
var PortalAction = "";                                      // #
var User = "";                                              // dylan
var Clientmac = "";                                         // aa:bb:cc:dd:ee:ff:gg
var Clientip = "";                                          // 192.168.0.100
var Viewport = "";                                          // .width, .height
//var Zone = "";                                            // <?=$cpzone;?> (smartlaunch) @ #zone
var Debug = true;                                           // Disables certain things

// 2: Init >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
$(document).ready(function() {
    // TESTS HERE >>

    // Language
    //$("[data-translate]").jqTranslate('index');

    //$.playSound('captiveportal-welcome-back');

    // /TESTS <<

    // Detect debug mode
    if (Debug) {
        console.log("** DEBUG MODE ON -- SOME OPTIONS DISABLED **");
    }

    // Detect if portrait; flip wallpaper
    Viewport = {
        width  : $(window).width(),
        height : $(window).height()
    };

    if (Viewport.height < Viewport.width) {
        //$( '#wrapper' ).css('background', 'none');
    }

    // HIDE ELEMENTS
    $( '.logoutform' ).remove();
    $( '#browserFail' ).remove();

    // Fade in
    $( '#wrapper' ).fadeIn(1200);

    // Update redirurl (after PHP swaps values)
    RedirURL = $( '#redirurl' ).val();
    //alert(RedirURL);

    // Update portal action (after PHP swaps values)
    PortalAction = $( '#portalaction').val();
    //alert(PortalAction);

    // <ENTER> event
    $( '#auth_user, #auth_pass, #auth_voucher' ).keyup(function (event) {
        if (event.keyCode == 13) {
            $( '#accept2' ).click();
        }
    });

    // TOS accordion by ID
    $(function () {
        $( '#tos' ).accordion({
            collapsible: true,
            active: false
        });
    });

    // Set title
    document.title = "Smartlaunch WiFi - Login";

    // Get clientmac
    if (!Debug) {
        Clientmac = $( '#clientmac' ).val();
        //alert("mac: " + Clientmac);

        // Get clientip
        Clientip = $( '#clientip' ).val();
        //alert("ip: " + Clientip);

        // Get zone
        //Zone = $( '#zone' ).val();
        //alert("zone: " + Zone);
    }

    // Enable tooltips
    $(function () {
        $(document).tooltip();
    });

    // Focus 1st input field
    $( 'input:text:visible:first' ).focus();

    // Select all text when focus
    $("input[type='text']").click(function () {
        $(this).select();
    });

    // Hover over/out the form
    $("#loginformsection").hover(
        function() {
            // IN - Swap image
            $("#logo").attr('src', "captiveportal-logo-glow.png").fadeIn(400);
    },
        function() {
            // OUT - Swap image
            $("#logo").attr('src', "captiveportal-logo.png");
    });

    // Is SL reachable/online?
    isSLOnlineAndReachable();

// ^^ End init ^^
});

// 3: Main: Button just clicked>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function tryLogin() {
    // Server offline?
    if (!IsServerOnline) {
        $( '#serverStatus' ).delay(100).fadeOut().fadeIn('slow');
        // Let the scripts continue for console debugging
    }
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
    // JS >> PHP:  captiveportal-restquery.php?resturl=http://localhost:7833/cportal/login&username=dylan&password=asdf&clientmac=aa:bb:cc:dd:ee:ff&clientip=192.168.0.100
    // PHP >> REST: http://slserver:7833/cportal/login?username=dylan&password=asdf&clientmac=aa:bb:cc:dd:ee:ff&clientip=192.168.0.100
    console.log("User '" + User + "' (" + Clientmac + ", " + Clientip +  ") attempting SL login @ " + ServerAddress + "..");
    console.log("Attempting POST (Boolean) >> " + ServerAddress + "/cportal/login?username=" + User + "&password=***&clientmac=" + Clientmac + "&clientip=" + Clientip);
    var request = "cportal/login&username=" + User + "&password=" + pass + "&clientmac=" + Clientmac + "&clientip=" + Clientip;
    SendAjaxPOST(request, true);
}

// 6: POST RESTful data via cross-domain ajax via PHP (POST) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function SendAjaxPOST(request, loginNow) {
    var baseURL = "captiveportal-restquery.php?resturl=" + ServerAddress + "/";
    var completeURL = baseURL + request;
	//console.log(completeURL); //PHP URL; shows plaintext password! Comment out before release

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

            if (loginNow) {
                // Login SL after final validation
                finalValidate(login, msg);
            } else {
                // Placeholder for other AJAX
            }
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

        if (!Debug) {
            loginCPortal();
        } else {
            console.log("DEBUG: Stopped @ LoginCPortal()");
        }

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

// REGISTER (login @ top) #########################################################################################
// 1: Register button was pressed
function tryRegister() {
    //
    setTooltip("#register", "Coming Soon");
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

// REQUEST ASSISTANCE ##############################################################################################
// 1: User clicks 'request assistance' link at bottom
function tryRequestAssistance() {
    //
    setTooltip("#help", "Coming Soon!");
}