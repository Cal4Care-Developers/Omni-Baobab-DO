<html>
<head>
</head>
<body>
<?php

 $inc_wp_response = file_get_contents('php://input',true);
 $log = file_put_contents('email_test.txt', $inc_wp_response.PHP_EOL , FILE_APPEND | LOCK_EX);
   // file_put_contents('email_test.txt', json_encode($_REQUEST).PHP_EOL , FILE_APPEND | LOCK_EX);



//$inc_wp_response='EventType=READ&SmsSid=SMd5cfa9e002d043c18defc777668b08c1&SmsStatus=read&MessageStatus=read&ChannelToAddress=%2B91848951XXXX&To=whatsapp%3A%2B918489514086&ChannelPrefix=whatsapp&MessageSid=SMd5cfa9e002d043c18defc777668b08c1&AccountSid=ACd2b8754af33c55da6e4ec1e00e429266&From=whatsapp%3A%2B14155238886&ApiVersion=2010-04-01';
 //$inc_wp_response='SmsSid=SM97654ba462114de7a8d9c064e343f9c5&SmsStatus=sent&MessageStatus=sent&ChannelToAddress=%2B91848951XXXX&To=whatsapp%3A%2B918489514086&ChannelPrefix=whatsapp&MessageSid=SM97654ba462114de7a8d9c064e343f9c5&AccountSid=ACd2b8754af33c55da6e4ec1e00e429266&From=whatsapp%3A%2B14155238886&ApiVersion=2010-04-01&ChannelInstallSid=XEcc20d939f803ee381f2442185d0d5dc5';

//$inc_wp_response='SmsSid=SM142c825396a64bf980ae7f12593fc3f0&SmsStatus=sent&MessageStatus=sent&ChannelToAddress=%2B91848951XXXX&To=whatsapp%3A%2B918489514086&ChannelPrefix=whatsapp&MessageSid=SM142c825396a64bf980ae7f12593fc3f0&AccountSid=ACd2b8754af33c55da6e4ec1e00e429266&From=whatsapp%3A%2B14155238886&ApiVersion=2010-04-01&ChannelInstallSid=XEcc20d939f803ee381f2442185d0d5dc5';



//$inc_wp_response = json_decode(json_encode($inc_wp_response), true);
//$inc_wp_response = json_decode($inc_wp_response, TRUE);

//print_r($inc_wp_response); exit;

$inc_wp_response = explode('&',$inc_wp_response);



if( $inc_wp_response[0] == 'EventType=READ' || $inc_wp_response[0] == 'EventType=DELIVERED' || $inc_wp_response[1] == 'SmsStatus=sent'){

	if($inc_wp_response[1] == 'SmsStatus=sent'){
		$message_id = str_replace("MessageSid=","",$inc_wp_response[6]);
		$message_status = 'SENT';
	} else {
		$message_id = str_replace("MessageSid=","",$inc_wp_response[7]);
		$message_status = str_replace("EventType=","",$inc_wp_response[0]);
	}


	$element_data = array('action' => 'change_wp_status','MessageId'=>$message_id,'status'=>$message_status);
	$fields = array('operation' =>'wpchat','moduleType' => 'wpchat','api_type' => 'web', 'element_data' => $element_data);


} else {


$inc_message = str_replace("Body=","",$inc_wp_response[4]);
$inc_message = str_replace("+"," ",$inc_message);
$inc_message = urldecode($inc_message);
$inc_message = str_replace("%0","\n",$inc_message);
$from_num = str_replace("From=whatsapp%3A%2B","+",$inc_wp_response[9]);
$to_num = str_replace("To=whatsapp%3A%2B","+",$inc_wp_response[5]);
$message_id = str_replace("MessageSid=","",$inc_wp_response[7]);

$element_data = array('action' => 'generate_incoming_wp','From'=>$from_num,'message'=>$inc_message,'To'=>$to_num,'MessageId'=>$message_id);
$fields = array('operation' =>'wpchat','moduleType' => 'wpchat','api_type' => 'web', 'element_data' => $element_data);

}


//print_r($fields); exit;


$post = http_build_query($fields);
$url = 'https://baobabbfaso.mconnectapps.com/api/v1.0/index_new.php';

$ch = curl_init();

//set the url, number of POST vars, POST data
curl_setopt($ch,CURLOPT_URL, $url);
curl_setopt($ch,CURLOPT_POST, 1);
curl_setopt($ch,CURLOPT_POSTFIELDS, $post);
$result = curl_exec($ch);
curl_close($ch);

print_r($result);
$tnewchat = '[{"from":"whatsapp"}]';


?>

    <script src="http://code.jquery.com/jquery-1.9.1.js"></script>

	<script>

	var websocket = new WebSocket("wss://socket.mconnectapps.com:5013/");
			websocket.onopen = function(event) {
            console.log('open');
            Type();
		}
		websocket.onmessage = function(event) {
			console.log(event.data);
		};

		websocket.onerror = function(event){
			console.log('error');
		};
		websocket.onclose = function(event){
			console.log('close');
		};

		function Type(){
		var myVariable = <?php echo(json_encode($tnewchat)); ?>;
		websocket.send(myVariable);
		}

	</script>


	</body>
    <html>


