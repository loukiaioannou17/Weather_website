<?php 

	
	if(strcasecmp($_SERVER['REQUEST_METHOD'], 'GET') == 0) {

	
	
		$conn = mysqli_connect("dbserver.in.cs.ucy.ac.cy", "student", "gtNgMF8pZyZq6l53") or die("Could not connect: " . mysqli_error($conn)); 
		mysqli_select_db($conn , "epl425") or die ("db will not open" . mysqli_error($conn)); 
		$query = "SELECT * FROM requests WHERE username='lioann02'"; 
		
		$result = mysqli_query($conn, $query) or die("Invalid query"); 
		$num = mysqli_num_rows($result);
		echo $num;
		echo "\n";
		for($i=0; $i<$num; $i++) {
    			$row =  mysqli_fetch_row($result);
			echo "{$row[2]} {$row[3]} {$row[4]} {$row[5]}\n";
		}	
	

}
?>

