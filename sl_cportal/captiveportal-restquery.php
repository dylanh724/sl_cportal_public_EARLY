<?php

##################################################
# SMARTLAUNCH--
# Created by Dylan with special thanks to Edwin
# ALTERED 4/10/2015 to support 1.0.2x86
# Updated 4/15/2015
##################################################


#################################        INIT        ###############################################
# http://localhost/sl_cportal_test/captiveportal-restquery.php?resturl=http://localhost:7833/cportal/login&username=dylan&password=asdf
$url = "captiveportal-restquery.php";
$curl_response = "Unknown curl_response error (bad formatting?)";
$fail = false;


################################    GENERAL/SHARED    ##############################################
# 1: resturl=http://192.168.0.25:7833/cportal/
# $url=http://192.168.0.25:7833/cportal/
if (isset($_GET["resturl"])) {
    //echo "resturl OK; ";
    $url = $_GET["resturl"];

    # 2: username=dylan
    # a) $url=http://192.168.0.25:7833/cportal/login?username=dylan
    # b) $url=http://192.168.0.25:7833/cportal/logout?username=dylan
    if (isset($_GET["username"])) {
        //echo "username OK; ";
        $url .= "?username=" . $_GET["username"];


################################    CPortalLogin()   #################################################
        # 3: password=asdf (LOGIN)
        # 3a) $url=http://192.168.0.25:7833/cportal/login?username=dylan&password=asdf
        if (isset($_GET["password"])) {
            //echo "pass OK; ";
            $url .= "&password=" . $_GET["password"];

            # 4a) $url=http://192.168.0.25:7833/cportal/login?username=dylan&password=asdf&clientmac=aa:bb:cc:dd:ee:ff
            if (isset($_GET["clientmac"])) {
              //echo "clientmac OK; ";
                $url .= "&clientmac=" . $_GET["clientmac"];

                # 5a) $url=http://192.168.0.25:7833/cportal/login?username=dylan&password=asdf&clientmac=aa:bb:cc:dd:ee:ff&ip=192.168.0.100
                if (isset($_GET["clientip"])) {
                    //echo "clientip OK; ";
                    $url .= "&clientip=" . $_GET["clientip"];


#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   CPortalLogin() FAIL  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                } else {
                    # Fail (5a)
                    $fail = true;
                    $curl_response = '{"login":false,"msg":"Invalid login: clientip"}';
                }
            } else {
                # Fail (4a)
                $fail = true;
                $curl_response = '{"login":false,"msg":"Invalid login: clientmac"}';
            }

            ## RESULT ##
            if ($fail)
                DisplayOutput($curl_response);
            else
                SendCurl($url);


#################################     CPortalLogoutSL()  ############################################
        # If password is NOT set, chances are it's logout:
        # 3: logout_id={16-digit-hash} (LOGOUT)
        # 3b) $url=http://192.168.0.25:7833/cportal/logout?username=dylan&logout_id={1..2..16}
        } else if (isset($_GET["logout_id"])) {
            $url .= "&logout_id=" . $_GET["logout_id"];

            if (isset($_GET["idonly"])) {
                // 3c) OPTIONAL $url=http://192.168.0.25:7833/cportal/logout?username=dylan&logout_id={1..2..16}&idonly=true
                $url .= "&idonly=true";
            }

            # End of Logout -- SEND!
            SendCurl($url);


#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!      General  Fail      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        } else {
            # Logout Fail >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            if (strpos($url, 'logout') !== false) {

                if (!isset($_GET['logout_id'])) {
                    # Logout fail (3b)
                    $curl_response = '{"logout":false,"msg":"Invalid logout: logout_id"}';
                }

            # Login Fail >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            } else  if (strpos($url, 'login') !== false) {
                # Login Fail >>
                if (!isset($_GET["password"])) {
                    # Login fail (3a)
                    $curl_response = '{"login":false,"msg":"Invalid login: password"}';
                } else if (!isset($_GET['username'])) {
                    $curl_response = '{"action":"none","msg":"Invalid login: username, password, clientmac, clientip"}';
                } else if (!isset($_GET['password'])) {
                    $curl_response = '{"action":"none","msg":"Invalid login: password, clientmac, clientip"}';
                } else if (!isset($_GET['clientmac'])) {
                    $curl_response = '{"action":"none","msg":"Invalid login: clientip"}';
                } else {
                    $curl_response = '{"action":"none","msg":"Invalid command: Invalid login resturl?"}';
                }
            } else {
                $curl_response = '{"action":"none","msg":"Invalid command: Invalid resturl?"}';
            }
            # (Shared)
            DisplayOutput($curl_response);
        }
    } else {
        # Fail 2: username
        if (strpos($url,'logout') !== false) {
            # Logout attempt >>
            $curl_response = '{"login":false,"msg":"Invalid logout: username"}';
        } else if (strpos($url, 'login') !== false) {
            # Login attempt >> 
            $curl_response = '{"login":false,"msg":"Invalid login: username"}';
        } else {
            $curl_response = '{"login":false,"msg":"Invalid resturl: Try /cportal/login or /cportal/logout"}';
        }

        DisplayOutput($curl_response);
    }
} else {
    # Fail 1: resturl
    #echo $url . "....";
    $curl_response = '{"login":false,"msg":"Invalid RestURL"}';
    DisplayOutput($curl_response);
}


#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@     SUCCESS      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# Successful input: GET response/output
function SendCurl($url) {
    $curl = curl_init ($url);
    curl_setopt ($curl, CURLOPT_RETURNTRANSFER, true);
    $curl_response = curl_exec ($curl);

    if ( $curl_response === false ) {
        $info = curl_getinfo ($curl);
        curl_close ($curl);
        die ("Server Offline or Unknown Error: " . var_export($info));
    }
    curl_close ($curl);
    DisplayOutput($curl_response);
}


##################################       OUTPUT      ##################################################
function DisplayOutput ($curl_response) {
    // Raw Output -- already JSON encoded from SL Server!
    echo $curl_response;

    // Other uses
    #echo json_encode($curl_response); // json string?
    #echo json_encode($curl_response, true); // json....?
    #echo json_encode($curl_response, JSON_PRETTY_PRINT); // Formatted json
    #echo json_encode($curl_response, JSON_FORCE_OBJECT);
}