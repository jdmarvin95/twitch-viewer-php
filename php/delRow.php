<?php
	require 'connect.php';

	$conn = connect();

	$data = file_get_contents("php://input");
	$request = json_decode($data);

	$Name = $request->Name;

	$sql = "DELETE FROM streams WHERE Name = '$Name'";
	$conn->query($sql);

	$conn->close();
?>