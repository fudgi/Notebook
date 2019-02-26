<?php
   $link = new mysqli("localhost", "root", "codio", "notebook");
   $array = array();
   mysqli_set_charset($link, "utf8");
   if (mysqli_connect_errno()) {
        $array = [ "task" => "ERROR",
                   "result" => "Соединение не установлено"]; 
        echo json_encode($array);
        exit();
   }

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
      
    case "NOTE UPDATE":
        $array = ["task" => $gettedData->task]; 
        if(mysqli_query($link, "UPDATE `note_data` SET `note_name`='".$gettedData->myjson->note_name."', `note_content`='".$gettedData->myjson->note_content."' WHERE `note_id`= '".$gettedData->myjson->note_id."';")==TRUE){
          $array["result"][] = "TRUE";
        }
        else {
          $array["result"][] = "FALSE"; 
        }
        echo json_encode($array);
        break;   
      
     case "INSERT":
        $array = ["task" => $gettedData->task]; 
        if(mysqli_query($link, "INSERT INTO `note_data`(`note_id`, `note_name`, `note_date`, `note_content`, `user_id`) VALUES (NULL,'".$gettedData->myjson->note_name."',CURRENT_TIMESTAMP,'".$gettedData->myjson->note_content."',".$gettedData->myjson->user_id.");")==TRUE){
          $array["result"][] = "TRUE";
        }
        else {
          $array["result"][] = "FALSE"; 
        }
        
        $prev_note_id = mysqli_insert_id($link);
        $table = mysqli_query($link,"SELECT `note_date` FROM `note_data` WHERE `note_id` LIKE ".$prev_note_id.";");
         if ($table->num_rows > 0) {                
             while( $row = mysqli_fetch_assoc($table)) {
                   $array["result"][] = $row["note_date"];
                   $array["result"][] = $prev_note_id;
             }
         } else {
            $array["result"][] = "FALSE"; 
        }
        echo json_encode($array);
        break;
      
    case "DELETE":
      $array = ["task" => $gettedData->task];
      if(mysqli_query($link,"DELETE FROM note_data WHERE note_id = '".$gettedData->myjson->note_id."'")==TRUE){
           $array["result"][] = "TRUE";
           $array["prev_pos"][] = $gettedData->myjson->prev_pos;
        }
        else {
          $array["result"][] = "FALSE"; 
        }
        echo json_encode($array);
        break;
      
    case "WF UPDATE":
    case "EDIT":
      $table = mysqli_query($link,"SELECT `note_content` FROM `note_data` WHERE `note_id` LIKE ".$gettedData->myjson->note_id.";");
         if ($table->num_rows > 0) {
           $array = ["task" => $gettedData->task];                   
             while( $row = mysqli_fetch_assoc($table)) {
                   $array["result"][] = $row;
             }
         } else {
            $array = [ "task" => "ERROR", "result" => "Нет записей"]; 
        }
        echo json_encode($array);
        break;
    case "SEARCH": 
      break;
  }
?>