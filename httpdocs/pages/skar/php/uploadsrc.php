<?php

// Directory for file storing filesystem path

$upload_dir = realpath( "../files" );

// Directory for file storing Web-Server dir

$web_upload_dir = str_replace( $_SERVER['DOCUMENT_ROOT'], '', realpath( "../files" ) );

/* upload_dir is filesystem path, something like
   /var/www/htdocs/files/upload or c:/www/files/upload
   web upload dir, is the webserver path of the same
   directory. If your upload-directory accessible under
   www.your-domain.com/files/upload/, then
   web_upload_dir is /files/upload
*/


// testing upload dir
// remove these lines if you're shure
// that your upload dir is really writable to PHP scripts

$tf = $upload_dir.'/'.md5(rand()).".test";

$f = @fopen($tf, "w");

if ($f == false)
    die ( "Fatal error! {$upload_dir} is not writable. Set 'chmod 777 {$upload_dir}' or something like this");

fclose($f);

unlink($tf);

// end up upload dir testing



// FILEFRAME section of the script
if (isset($_POST['fileframe']))
{
    $result = 'ERROR';
    $result_msg = 'No FILE field found';

    if (isset($_FILES['file']))  // file was send from browser
    {
        if ($_FILES['file']['error'] == UPLOAD_ERR_OK)  // no error
        {
            $filename = $_FILES['file']['name']; // file name

            // main action -- move uploaded file to $upload_dir
            move_uploaded_file($_FILES['file']['tmp_name'], $upload_dir.'/'.$filename);

            $result = 'OK';
        }
        elseif ($_FILES['file']['error'] == UPLOAD_ERR_INI_SIZE)
        {
            $result_msg = 'The uploaded file exceeds the upload_max_filesize directive in php.ini';
        }
        else
        {
            $result_msg = 'Unknown error';
        }

        // you may add more error checking
        // see http://www.php.net/manual/en/features.file-upload.errors.php
        // for details
    }

    // outputing trivial html with javascript code (return data to document)
    // This is a PHP code outputing Javascript code. Do not be so confused ;)

    echo '<html><head><title>-</title></head><body>';
    echo '<script language="JavaScript" type="text/javascript">'."\n";
    echo 'var parDoc = window.parent.document;';

    // this code is outputted to IFRAME (embedded frame) main page is a 'parent'

    if ($result == 'OK')
    {
        // Simply updating status of fields and submit button
        echo 'parDoc.getElementById("upload_status").value = "file successfully uploaded";';
        echo 'parDoc.getElementById("filename").value = "'.$filename.'";';
        echo 'parDoc.getElementById("filenamei").value = "'.$filename.'";';
        echo 'parDoc.getElementById("upload_button").disabled = false;';
    }
    else
    {
        echo 'parDoc.getElementById("upload_status").value = "ERROR: '.$result_msg.'";';
    }

    echo "\n".'</script></body></html>';

    exit(); // do not go futher
}
// FILEFRAME section END



// just useful functions which 'quotes' all HTML-tags and special symbols from user input

function safehtml($s)
{
    $s=str_replace("&", "&amp;", $s);
    $s=str_replace("<", "&lt;", $s);
    $s=str_replace(">", "&gt;", $s);
    $s=str_replace("'", "&apos;", $s);
    $s=str_replace("\"", "&quot;", $s);
    return $s;
}

if (isset($_POST['description']))
{
    $filename = $_POST['filename'];
    $size = filesize($upload_dir.'/'.$filename);
    $date = date('r', filemtime($upload_dir.'/'.$filename));
    $description = safehtml($_POST['description']);

// Let's generate file information page
$html =<<<END
<html><head><title>{$filename} [uploaded by IFRAME Async file uploader]</title></head>
<body>
<h1>{$filename}</h1>
<p>This is a file information page for your uploaded file. Bookmark it, or send to anyone...</p>
<p>Date: {$date}</p>
<p>Size: {$size} bytes</p>
<p>Description:
<pre>{$description}</pre>
</p>
<p><a href="{$web_upload_dir}/{$filename}" style="font-size: large;">download file</a><br>
<a href="{$PHP_SELF}" style="font-size: small;">back to file uploading</a><br>
<a href="{$web_upload_dir}/upload-log.html" style="font-size: small;">upload-log</a></p>
<br><br>Example by <a href="http://www.anyexample.com/">AnyExample</a>
</body></html>
END;
    // save HTML
    $f = fopen($upload_dir.'/'.$filename.'-desc.html', "w");
    fwrite($f, $html);
    fclose($f);
    $msg = "File {$filename} uploaded,
           <a href='{$web_upload_dir}/{$filename}-desc.html'>see file information page</a>";

    // Save to file upload-log
    $f = fopen($upload_dir."/upload-log.html", "a");
    fwrite($f, "<p>$msg</p>\n");
    fclose($f);

    // setting result message to cookie
    setcookie('msg', $msg);
    // redirecting to the script main page
    // we're doing so, to avoid POST form reposting
    // this method of outputting messages is called 'flash' in Ruby on Rails
    header("Location: http://".$_SERVER['HTTP_HOST'].$PHP_SELF);
    exit();
    // redirect was send, so we're exiting now
}

// retrieving message from cookie
if (isset($_COOKIE['msg']) && $_COOKIE['msg'] != '')
{
    if (get_magic_quotes_gpc())
        $msg = stripslashes($_COOKIE['msg']);
    else
        $msg = $_COOKIE['msg'];

    // clearing cookie, we're not going to display same message several times
    setcookie('msg', '');
}
?>
<!-- Beginning of main page -->
<html><head>
<title>IFRAME Async file uploader example</title>
</head>
<body>
<?php
if (isset($msg)) // this is special section for outputing message
    echo '<p style="font-weight: bold;">'.$msg.'</p>';
?>
<h1>Upload file:</h1>
<p>File will begin to upload just after selection. </p>
<p>You may write file description, while you file is being uploaded.</p>

<form action="<?=$PHP_SELF?>" target="upload_iframe" method="post" enctype="multipart/form-data">
<input type="hidden" name="fileframe" value="true">
<!-- Target of the form is set to hidden iframe -->
<!-- From will send its post data to fileframe section of this PHP script (see above) -->

<label for="file">text file uploader:</label><br>
<!-- JavaScript is called by OnChange attribute -->
<input type="file" name="file" id="file" onChange="jsUpload(this)">
</form>
<script type="text/javascript">
/* This function is called when user selects file in file dialog */
function jsUpload(upload_field)
{
    // this is just an example of checking file extensions
    // if you do not need extension checking, remove
    // everything down to line
    // upload_field.form.submit();

    var re_text = /\.txt|\.xml|\.zip/i;
    var filename = upload_field.value;

    /* Checking file type */
    if (filename.search(re_text) == -1)
    {
        alert("File does not have text(txt, xml, zip) extension");
        upload_field.form.reset();
        return false;
    }

    upload_field.form.submit();
    document.getElementById('upload_status').value = "uploading file...";
    upload_field.disabled = true;
    return true;
}
</script>
<iframe name="upload_iframe" style="width: 400px; height: 100px; display: none;">
</iframe>
<!-- For debugging purposes, it's often useful to remove "display: none" from style="" attribute -->

<br>
Upload status:<br>
<input type="text" name="upload_status" id="upload_status"
       value="not uploaded" size="64" disabled>
<br><br>

File name:<br>
<input type="text" name="filenamei" id="filenamei" value="none" disabled>

<form action="<?=$PHP_SELF?>" method="POST">
<!-- one field is "disabled" for displaying-only. Other, hidden one is for
    sending data -->
<input type="hidden" name="filename" id="filename">
<br><br>

<label for="photo">File description:</label><br>
<textarea rows="5" cols="50" name="description"></textarea>

<br><br>
<input type="submit" id="upload_button" value="save file" disabled>
</form>
<br><br>
<a href="<?=$web_upload_dir?>/upload-log.html">upload-log</a>
<br><br><br>

Example by <a href="http://www.anyexample.com/">AnyExample</a>
</body>
</html>