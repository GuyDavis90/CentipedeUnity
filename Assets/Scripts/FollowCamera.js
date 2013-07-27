#pragma strict

static var followIndex = 0;

var world:Transform;

private var lookTo:Transform;

function Start () {
	var followPlayer:Transform = world.Find("Player" + followIndex);
	var lookFrom:Transform = followPlayer.Find("Head/CameraFrom");
	transform.position = lookFrom.position;
	transform.parent = lookFrom;
	lookTo = followPlayer.Find("Head/CameraTo");
}

function Update () {
	transform.LookAt(lookTo);
}