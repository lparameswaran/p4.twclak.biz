<!DOCTYPE html>
<html>
<head>
	<title><?php if(isset($title)) echo $title; ?></title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />	

        <!-- Global JS/CSS includes -->
        <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="css/bootstrap-theme.min.css"> 
        <link href="/css/main.css" rel="stylesheet" type="text/css">

					
	<!-- Controller Specific JS/CSS -->

        <!-- Global JS/CSS head -->
</head>

<body>	
     <table style="width:100%">
        <tr>
           <td><a href='javascript:level(3)' id="btn3" class="btn btn-default btn-lg" role="button">Easy 3</a></td>
           <td><a href='javascript:level(4)' id="btn4" class="btn btn-default primary btn-lg" role="button">Easy 4</a></td>
           <td><a href='javascript:level(5)' id="btn5" class="btn btn-default primary btn-lg" role="button">Medium 5</a></td>
           <td><a href='javascript:level(6)' id="btn6" class="btn btn-default primary btn-lg" role="button">Medium 6</a></td>
           <td><a href='javascript:level(7)' id="btn7" class="btn btn-default primary btn-lg" role="button">Tough 7</a></td>
           <td><a href='javascript:level(8)' id="btn8" class="btn btn-default primary btn-lg" role="button">Tough 8</a></td>
           <td><a href='javascript:level(9)' id="btn9" class="btn btn-default primary btn-lg" role="button">Difficult 9</a></td>
           <td><a href='javascript:level(10)' id="btn10" class="btn btn-default primary btn-lg" role="button">Difficult 10</a></td>
         </tr>
      </table>
      <div class="container">  
         <div class="row">  
            <div class="col-md-12">
              <!-- <?php if (isset($content)) echo $content; ?> -->
            </div>
         </div>
         <div id="words" class="row">  
         </div>
      </div>
      <!-- Global JS files -->
      <script type="text/javascript" src="js/jquery-2.0.3.min.js"></script>
      <script type="text/javascript" src="js/bootstrap.min.js"></script>
      <script type="text/javascript" src="js/game.js"></script>
</body>
</html>
