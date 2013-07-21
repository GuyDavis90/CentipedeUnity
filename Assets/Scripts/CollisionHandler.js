#pragma strict

var collider:UnityEngine.Collider;

function Start () {

}

function Update () {

}

function OnTriggerEnter(other:Collider) {
	Debug.Log(transform.parent.name + " " + name + " hit " + other.transform.parent.name + " " + other.name);
}
