#pragma strict

static var followIndex = 0;

private var lookFrom:Transform;
private var lookTo:Transform;

var world:Transform;

function Start () {
	var followPlayer:Transform = world.Find("PlayerStart" + followIndex);
	lookFrom = followPlayer.Find("Player" + followIndex + "/CameraFrom").transform;
	lookTo = followPlayer.Find("Player" + followIndex + "/CameraTo").transform;
}

function Update () {
	transform.position = lookFrom.position;
	transform.LookAt(lookTo.position);
}