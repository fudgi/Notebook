<?php
// $link = new mysqli("localhost:8889", "root", "root", "notebook");
// $array = array();
// mysqli_set_charset($link, "utf8");
// if (mysqli_connect_errno()) {
//     $array = [ "task" => "ERROR",
//                 "result" => "Соединение не установлено"]; 
//     echo json_encode($array);
//     exit();
// }
$user = 'root';
$password = 'root';
$db = 'notebook';
$host = 'localhost';
$port = 8889;

$link = mysqli_init();
$success = mysqli_real_connect(
   $link,
   $host,
   $user,
   $password,
   $db,
   $port
);

// $link = mysqli_init();
// if (!$link)
//   {
//   die("mysqli_init failed");
//   }

// if (!mysqli_real_connect($link,"localhost","my_user","my_password","my_db"))
//   {
//   die("Connect Error: " . mysqli_connect_error());
//   }



$gettedData = json_decode($HTTP_RAW_POST_DATA);
switch ($gettedData->task){
  case "NOTELIST UPDATE":
    $table = mysqli_query($link,"SELECT `note_id`, `note_name`, `note_date` FROM `note_data` WHERE `user_id`=".$gettedData->myjson->user_id.";");
        if ($table->num_rows > 0) {
            $array = ["task" => $gettedData->task];                   
            while( $row = mysqli_fetch_assoc($table) ) {
                  $array["result"][] = $row;
            }
        } 
        else {
          $array = [ "task" => "ERROR", "result" => "Нет записей"]; 
        }
      echo json_encode($array);
      break;
    
  // case "NOTE UPDATE":
  //     $array = ["task" => $gettedData->task]; 
  //     if(mysqli_query($link, "UPDATE `note_data` SET `note_name`='".$gettedData->myjson->note_name."', `note_content`='".$gettedData->myjson->note_content."' WHERE `note_id`= '".$gettedData->myjson->note_id."';")==TRUE){
  //       $array["result"][] = "TRUE";
  //     }
  //     else {
  //       $array["result"][] = "FALSE"; 
  //     }
  //     echo json_encode($array);
  //     break;   
    
    // case "INSERT":
    //   $array = ["task" => $gettedData->task]; 
    //   if(mysqli_query($link, "INSERT INTO `note_data`(`note_id`, `note_name`, `note_date`, `note_content`, `user_id`) VALUES (NULL,'".$gettedData->myjson->note_name."',CURRENT_TIMESTAMP,'".$gettedData->myjson->note_content."',".$gettedData->myjson->user_id.");")==TRUE){
    //     $array["result"][] = "Удачное добавление записи";
    //   }
    //   else {
    //     $array["result"][] = "Неудачное добавление записи"; 
    //   }
    //   echo json_encode($array);
    //   break;
    
  // case "DELETE":
  //   $array = ["task" => $gettedData->task];
  //   if(mysqli_query($link,"DELETE FROM note_data WHERE note_id = '".$gettedData->myjson->note_id."'")==TRUE){
  //         $array["result"][] = "TRUE";
  //         $array["prev_pos"][] = $gettedData->myjson->prev_pos;
  //     }
  //     else {
  //       $array["result"][] = "FALSE"; 
  //     }
  //     echo json_encode($array);
  //     break;
    
  // case "WF UPDATE":
  // case "EDIT":
  //   $table = mysqli_query($link,"SELECT `note_content` FROM `note_data` WHERE `note_id` LIKE ".$gettedData->myjson->note_id.";");
  //       if ($table->num_rows > 0) {
  //         $array = ["task" => $gettedData->task];                   
  //           while( $row = mysqli_fetch_assoc($table)) {
  //                 $array["result"][] = $row;
  //           }
  //       } else {
  //         $array = [ "task" => "ERROR", "result" => "Нет записей"]; 
  //     }
  //     echo json_encode($array);
  //     break;
  // case "SEARCH": 
  //   break;
}
?>