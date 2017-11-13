<?php
	define('DB_HOST', 'localhost');
	define('DB_USER', 'jdmarvin95');
	define('DB_PASS', 'Slipknot95!');
	define('DB_DATABASE', 'streamers');

	function connect() {
		$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_DATABASE);

		if($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}

		return $conn;
	}	
?>