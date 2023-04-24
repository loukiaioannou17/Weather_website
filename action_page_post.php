<?php 
if(strcasecmp($_SERVER['REQUEST_METHOD'], 'POST') == 0) {

	
	    $json = trim(file_get_contents("php://input"));
	    $data = json_decode($json);
	    if (empty($data)){ echo "400 Bad Request";}
	    else{
	    	$conn = mysqli_connect("dbserver.in.cs.ucy.ac.cy", "student", "gtNgMF8pZyZq6l53") or die("Could not connect: " . mysqli_error($conn)); 
    		mysqli_select_db($conn , "epl425") or die ("db will not open" . mysqli_error($conn)); 
		    $timestamp = time();
    		$query = "INSERT INTO requests (username, timestamp, address, region, city) VALUES ('{$data->username}', {$timestamp}, '{$data->address}', '{$data->region}', '{$data->city}')"; 
    		$result = mysqli_query($conn, $query) or die("Invalid query"); 
		    if($result){ echo "201 created";}
		    else{echo "500 Server Error";}
        	}

}

	
?>

