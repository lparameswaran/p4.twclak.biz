<?php
class game_controller extends base_controller {

    public function __construct() {
        parent::__construct();
    } 

   public function getwords() {
        $_POST = DB::instance(DB_NAME)->sanitize($_POST);
        
        if (isset($_POST['numwords'])) {
           $numwords = $_POST['numwords'];
        }
        if (isset($_POST['minwords'])) {
           $minwords = $_POST['minwords'];
        }
        #echo "NUMWORDS=$numwords MINWORDS=$minwords\n";

        #$data =  "{ \"chars\": [ \"a\", \"a\", \"l\", \"v\" ], \"lenwords\": [ 3, 3, 4 ], \"words\": [ \"val\", \"lav\", \"lava\" ] }";
        $randomtable = chr(mt_rand(0,25) + 65) . "words";
        #$data = "{" . " \"numw\":" . $numwords . ", \"minw\":" . $minwords . ", \"rand\":" . $randomtable;
        #echo $data . "}";
        $q = "SELECT *
                     FROM " . $randomtable .
                   " WHERE len=" . $numwords .
                   " ORDER BY RAND()
                     LIMIT 1";
        $wordentry = DB::instance(DB_NAME)->select_row($q);
        #echo $wordentry['word'] . ":" . $wordentry['sword'] . ":" . $wordentry['len'];
        $word = $wordentry['word'];
        $sorted_word = $wordentry['sword'];
        $wordlen = $wordentry['len'];
        
        $sorted_arr = str_split($sorted_word);
        $data = "{ \"chars\": [ ";
        $data = $data . "\"" . $sorted_arr[0] . "\"";
        $regexp = "^" . $sorted_arr[0] . "?";
        for ($i = 1;$i < count($sorted_arr);$i ++) {
            $data = $data . ", \"" . $sorted_arr[$i] . "\"";
            $regexp = $regexp . $sorted_arr[$i] . "?";
        }
        $regexp = $regexp . "$";
        $data = $data . " ] ";

        $data = $data . ", \"word\": \"" . $word . "\", \"rand\": \"" . $randomtable . "\", \"regexp\": \"" . $regexp . "\"";

        $where = " WHERE len >=" . $minwords . " AND len <=" . $numwords . " AND sword RLIKE \"" . $regexp . "\"";

        $lenout = "";
        $wordsout = "";
        $oldchar = "";
        $maxpoints = 0;
        for ($i = 0;$i < count($sorted_arr);$i ++) {
           if ($oldchar == $sorted_arr[$i]) continue;
           $oldchar = $sorted_arr[$i];
           $select = "SELECT word,len FROM " . strtoupper($sorted_arr[$i]) . "words" . $where;
           $matchentries = DB::instance(DB_NAME)->select_rows($select);
           foreach ($matchentries as $matchentry) {
              $maxpoints = $maxpoints + (int)$matchentry['len'];
              if (strlen($lenout) == 0) {
                 $lenout = $matchentry['len'];
                 $wordsout = "\"" . $matchentry['word'] . "\"";
              } else {
                 $lenout = $lenout . "," . $matchentry['len'];
                 $wordsout = $wordsout . ", \"" . $matchentry['word'] . "\"";
              }
           }
        }
        $data = $data . ", \"maxpoints\": " . $maxpoints . ", \"lens\": [ " . $lenout . "], \"words\": [" . $wordsout . "]";
        $data = $data . " } ";
        echo $data;
        return;
    }

} # end of the class
?>
