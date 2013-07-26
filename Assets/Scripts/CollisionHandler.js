#pragma strict

function Start () {
	
}

function Update () {

}

function OnTriggerEnter(other:Collider) {
	Debug.Log(transform.parent.name + " " + name + " hit " + other.transform.parent.name + " " + other.name);
	if (other.transform.tag == "Food") {
		// Perhaps this tag should be passed to centipede control like
		//centipedeControl.handleCollision(tag);
		// then in there if food add, if something else do else
		var centipedeControl:CentipedeControl = transform.parent.gameObject.GetComponent(CentipedeControl);
		centipedeControl.addLink();
	}
}
