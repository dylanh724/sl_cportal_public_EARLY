<?php

####################
# --SMARTLAUNCH--  #
# Created by Edwin #
# Altered by Dylan #
####################


#################################      INIT      ##############################################
# http://localhost/sl_cportal_test/captiveportal-restquery.php?resturl=http://localhost:7833/cportal/login&username=dylan&password=asdf
$url = "restquery.php";
$curl_response = "Unknown curl_response error";

################################# GENERAL/SHARED ##############################################
# 1: resturl=http://192.168.0.25:7833/cportal/
# $url=http://192.168.0.25:7833/cportal/
if (isset($_GET["resturl"])) {
    $url = $_GET["resturl"];

    # 2: username=dylan
    # a) $url=http://192.168.0.25:7833/cportal/login?username=dylan
    # b) $url=http://192.168.0.25:7833/cportal/logout?username=dylan
    if (isset($_GET["username"])) {
        $url .= "?username=" . $_GET["username"];


################################  CPortalLogin() ##############################################
        # 3: password=asdf (LOGIN)
        # a) $url=http://192.168.0.25:7833/cportal/login?username=dylan&password=asdf
        if (isset($_GET["password"])) {
            $url .= "&password=" . $_GET["password"];
            # End of Login -- SEND!
            SendCurl($url);


################################ CPortalLogoutSL() ############################################
        # 3: logout_id={16-digit-hash} (LOGOUT)
        # b) $url=http://192.168.0.25:7833/cportal/logout?username=dylan&logout_id={1..2..16}
        } else if (isset($_GET["logout_id"])) {
            $url .= "&logout_id=" . $_GET["logout_id"];
            # End of Logout -- SEND!
            SendCurl($url);


################################      FAILED       ############################################
        } else {
            # Fail 3: password (a) OR logout_id (b)
            #echo $url . "....";
            if (isset($_GET['password'])) {
                # Login fail (3a)
                $curl_response = '{"login":false,"msg":"Invalid Password"}';
            } else if (isset($_GET['logout_id'])) {
                # Logout fail (3b)
                $curl_response = '{"logout":false,"msg":"Invalid LogoutID"}';
            } else {
                # Logout fail - didn't finish
                $curl_response = '{"action":"none","msg":"Incomplete URL"}';
            }
            # (Shared)
            DisplayOutput($curl_response);
        }
    } else {
        # Fail 2: username
        #echo $url . "....";
        $curl_response = '{"login":false,"msg":"Invalid Username"}';
        DisplayOutput($curl_response);
    }
} else {
    # Fail 1: resturl
    #echo $url . "....";
    $curl_response = '{"login":false,"msg":"Invalid RestURL"}';
    DisplayOutput($curl_response);
}


################################     SUCCESS      ############################################
# Successful input: GET response/output
function SendCurl($url) {
    $curl = curl_init ($url);
    curl_setopt ($curl, CURLOPT_RETURNTRANSFER, true);
    $curl_response = curl_exec ($curl);

    if ( $curl_response === false ) {
        $info = curl_getinfo ($curl);
        curl_close ($curl);
        die ('Server Offline or Unknown Error: ' . var_export($info));
    }
    curl_close ($curl);
    //echo ($url);
    DisplayOutput($curl_response);
}


################################     OUTPUT      #############################################
function DisplayOutput ($curl_response) {
    // Raw Output -- already JSON encoded from SL Server!
    echo $curl_response;

    // Other uses
    #echo json_encode($curl_response); // json string?
    #echo json_encode($curl_response, true); // json....?
    #echo json_encode($curl_response, JSON_PRETTY_PRINT); // Formatted json
    #echo json_encode($curl_response, JSON_FORCE_OBJECT);

}