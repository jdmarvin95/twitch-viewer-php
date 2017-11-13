<?php
	require 'connect.php';

	$conn = connect();

	$sql = "SELECT * FROM streams";
	$result = $conn->query($sql);
	$rows = array();

	while($r = $result->fetch_assoc()) {
		$rows[] = $r;
	}

	$conn->close();

	echo json_encode($rows);
?>