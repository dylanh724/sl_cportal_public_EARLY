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

// 3: Main >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function tryLogin() {
    // Get User + pass (+voucher) from form
    var data = "<?php echo json_encode($var); ?>";
    alert(data);
    var user = document.getElementById( 'auth_user' ).value;
    var pass = document.getElementById( 'auth_pass' ).value;
    var voucher = document.getElementById( 'auth_voucher' ).value;
    var voucherLogin = false;
    if (voucher !== "") { voucherLogin = true }
    if (initValidate(user, pass, voucher, voucherLogin)) {
        login(user, pass);
    }
}

// RESTful query
function getData (request) {
    var data = [];
    $.ajax({
        url : 'query.php',
        type : 'POST',
        data : data,
        dataType : 'json',
        success : function (result) {
            alert(result['ajax']); // "Hello world!" alerted
            console.log(result['advert']) // The value of your php $row['adverts'] will be displayed
        },
        error : function () {
            alert("error");
        }
    })
}


// asdf2
function asdf(){
    $.ajax({
        url:'query.php',
        type:'POST',
        // get the selected values from 3 form fields
        data:'color=' + $('#color').val() +
        '&age=' + $('#age').val() +
        '&name=' + $('#name').val(),
        success:function(data) {
            // ...
        }
    });
    return false;
}

// handles the click event, sends the query
function asdf2() {
    $.ajax({
        url:'query.php',
        complete: function (response) {
            $('#output').html(response.responseText);
        },
        error: function () {
            $('#output').html('Bummer: there was an error!');
        }
    });
    return false;
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
            // Login Successful - show fancy alert
            $(' <div id="dialog" title="Successful Login">Success! Logging in..</div>').dialog();
            console.log("Successfully logged into SL");
            finalEvents();
        } else {
            // Login Failed - show fancy alert
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
        $.post( "" );
    }
    catch(e) {
        setError("POST", "Unknown Error");
    }
}