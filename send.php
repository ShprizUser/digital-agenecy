<?php
// Файлы phpmailer
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

// Переменные, которые отправляет пользователь
$name = $_POST['name'];
$phone = $_POST['phone']; 
$text = $_POST['text'];
$file = $_FILES['file'];
$token = "5661313696:AAGnW3ZPnGx8dB-pQed0_vzsGcwX3Mxh3ms";
$chat_id = "-745505578";


// Формирование самого письма
$title = "Заявка с Incore Agency";
$body = "
<b>Имя:</b> $name<br>
<b>Телефон:</b> $phone<br><br>
<b>Сообщение:</b><br>$text";



// Настройки PHPMailer
$mail = new PHPMailer\PHPMailer\PHPMailer();
    $mail->isSMTP();   
    $mail->CharSet = "UTF-8";
    $mail->SMTPAuth   = true;
    $mail->SMTPDebug = 2;
    $mail->Debugoutput = function($str, $level) {$GLOBALS['status'][] = $str;};

    // Настройки вашей почты
    $mail->Host       = 'smtp.mail.ru'; // SMTP сервера вашей почты
    $mail->Username   = 'production@incoreagency.ru'; // Логин на почте
    $mail->Password   = 'RORG41u&aogg'; // Пароль на почте
    $mail->SMTPSecure = 'ssl';
    $mail->Port       = 465;
    $mail->setFrom('production@incoreagency.ru', 'Владимир Поляков'); // Адрес самой почты и имя отправителя
    // Получатель письма
    $mail->addAddress('production@incoreagency.ru');  


// Прикрипление файлов к письму
if (!empty($file['name'][0])) {
	for ($ct = 0; $ct < count($file['tmp_name']); $ct++) {
			$uploadfile = tempnam(sys_get_temp_dir(), sha1($file['name'][$ct]));
			$filename = $file['name'][$ct];
			if (move_uploaded_file($file['tmp_name'][$ct], $uploadfile)) {
					$mail->addAttachment($uploadfile, $filename);
					$title = "Заявка с файлом, файл смотрите на почте";
			} 
	}   
}

$arr = array(
		'Имя: ' => $name,
		'Телефон: ' => $phone,
		'Сообщение:' => $text
);

foreach($arr as $key => $value) {
	$messageto .= "<b>".$key."</b> ".$value."%0A";
};
$messageto .= "$title";
$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$messageto}","r");

// Отправка сообщения
$mail->isHTML(true);
$mail->Subject = $title;
$mail->Body = $body;    


if($mail->send()) {
		die('OK');
}


