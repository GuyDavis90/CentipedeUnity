#pragma strict

function Start () {
	
}

function Update () {

}

function OnTriggerEnter(other:Collider) {
	var tag:String = other.transform.tag;
	Debug.Log(transform.parent.name + " " + name + " hit " + other.transform.parent.name + " " + other.name);
	var centipedeControl:CentipedeControl = transform.parent.gameObject.GetComponent(CentipedeControl);
	centipedeControl.handleCollision(tag);
	if (tag == "Food") {
		// Destroy food here
	}
}
