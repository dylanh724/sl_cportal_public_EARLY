<?php
// filename: myAjaxFile.php
// some PHP
    $data = array(
        'login' => 'True',
        'advert' => $row['adverts'],
     );
    echo json_encode(data);
?>