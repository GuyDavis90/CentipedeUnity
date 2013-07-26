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
		other.transform.position = Vector3(Random.Range(-15.0f, 15.0f), 1.0f, Random.Range(-15.0f, 15.0f));
		other.transform.rotation = Quaternion.Euler(0.0f, Random.value * 360.0f, 0.0f);
	}
}
