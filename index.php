<?php
if (isset($_POST['submit'])) {
    $key = file_get_contents('g-captcha/private.key');
    $url = 'https://www.google.com/recaptcha/api/siteverify';
    $data = array('secret' => $key, 'response' => $_POST['g-recaptcha-response'], 'remoteip' => $_SERVER['REMOTE_ADDR']);
    $options = array(
            'http' => array(
                    'header' => '*/*',
                    'method' => 'POST',
                    'content' => http_build_query($data)
            )
    );
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    if ($result['success'] == true) {
        $email = $_POST['email'];
        $first_name = $_POST['firstname'];
        $second_name = '';
        if (isset($_POST['second_name'])) {
            $second_name = $_POST['second_name'];
        }
        $message = $_POST['message'];
        $sendTo = 'einsjannis@gmail.com';
        mail(
            ''.$sendTo,
            'Message from '.$first_name.' '.$second_name,
            'Message from '.$first_name.' '.$second_name.':\n\n'.$message,
            'Sender: '.$email
        );
    } else {
        header('Location: http://localhost/?error=recaptcha_failed&scrollTo=contact');
        exit(0);
    }
}
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>null</title>
        <script rel="script" type="application/javascript" src="/js/apis/platform.js"></script>
        <script rel="script" type="application/javascript" src="/js/startup.js"></script>
    </head>
    <body>
        <h1>Please enable scripts for this website</h1>
        <p><a href="/scripts/why">Why do we want you to enable scripts on this site?</a> | <a href="/scripts/how">How can I enable scripts on this website</a></p>
        <script rel="script" type="application/javascript">loadSite()</script>
        <footer>
            <a href="/imprint.html">Imprint and Privacy</a>
        </footer>
    </body>
</html>