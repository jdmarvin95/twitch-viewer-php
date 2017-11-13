<?php
	require 'connect.php';

	$conn = connect();

	$data = file_get_contents("php://input");
	$request = json_decode($data);

	$DisplayName = $request->DisplayName;
	$Name = $request->Name;
	$ApiLink = $request->ApiLink;
	$TwitchLink = $request->TwitchLink;
	$Logo = $request->Logo;

	$sql = "INSERT INTO streams (DisplayName, Name, ApiLink, TwitchLink, Logo) VALUES ('$DisplayName', '$Name', '$ApiLink', '$TwitchLink', '$Logo')";
	$conn->query($sql);

	$conn->close();
?>