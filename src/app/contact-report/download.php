<?php
$filename = 'chat-ratings.csv';
$export_data = unserialize($_POST['export_data']);

// file creation
$file = fopen($filename,"w");

$delimiter = ",";
$fields = array('Chat ID', 'Name', 'Ratings');


fputcsv($file, $fields, $delimiter);

foreach ($export_data as $line){
 fputcsv($file,$line);
}

fclose($file);

// download
header("Content-Description: File Transfer");
header("Content-Disposition: attachment; filename=".$filename);
header("Content-Disposition: inline; filename=".$filename);
header("Content-Type: application/csv; "); 
header("Content-Transfer-Encoding: Binary"); 
header("Content-length: ". filesize($filename)); 



readfile($filename);

// deleting file
unlink($filename);
exit();