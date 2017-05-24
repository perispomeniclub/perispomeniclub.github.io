<?php

$file = fopen("data/text.test","r+");
fwrite($file,$_POST["val"]);
fclose($file);


?>