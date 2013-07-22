#pragma strict

import System.Collections.Generic;

private var isPlayer:boolean = false;
private var decisionTime:float = 0.0f;

private var turningLeft:boolean = false;
private var turningRight:boolean = false;

private var head:Transform;
private var links:List.<Transform>;

function Start () {
	if (transform.parent.name == "PlayerStart0") {
		isPlayer = true;
	}

	head = Transform.Instantiate(Resources.Load("CentipedeHead", Transform), transform.position, transform.rotation);
	head.gameObject.name = "Head";
	head.parent = transform;
	transform.Find("CameraFrom").transform.parent = head;
	transform.Find("CameraTo").transform.parent = head;
	links = new List.<Transform>();
	var firstLink:Transform = Transform.Instantiate(Resources.Load("CentipedeLink", Transform), transform.position, transform.rotation);
	firstLink.gameObject.name = "Link-0";
	firstLink.transform.parent = transform;
	firstLink.transform.position -= firstLink.transform.forward * 0.5f;
	links.Add(firstLink);
}

function Update () {
	// Handle direction changing
	if (isPlayer) {
		// Update direction based on keys
		if (Input.GetKey("a")) {
			turningLeft = true;
		}
		else {
			turningLeft = false;
		}
		if (Input.GetKey("d")) {
			turningRight = true;
		}
		else {
			turningRight = false;
		}
	}
	else {
		// Update direction based on random turning
		// yea stupid AI i know :P
		// but good enough for testing purposes maybe xD
		// actually, ill hack up something better sometime
		// something like, getting the distance from center
		// and then depending on which wall its closest to it will turn the opposite way
		decisionTime -= Time.deltaTime;
		if (decisionTime < 0.0f) {
			var random:float = Random.value;
			turningLeft = false;
			turningRight = false;
			if (random > 0.75f) {
				// 25% chance to turn left
				turningLeft = true;
			}
			else if (random > 0.5f) {
				// 25% chance to turn right
				turningRight = true;
			}
			decisionTime = random / 5;
		}
	}
	if (Input.GetKeyDown("t")) {
		addLink();
	}

	// Update position and rotations
	head.position += head.forward * Time.deltaTime * 2.5f;
	if (turningLeft ^ turningRight) {
		if (turningLeft) {
			head.rotation.eulerAngles.y -= 50.0f * Time.deltaTime;
		}
		if (turningRight) {
			head.rotation.eulerAngles.y += 50.0f * Time.deltaTime;
		}
	}
	updateLinks();
}

function addLink() {
	var lastLink:Transform = links[links.Count - 1];
	var newLink:Transform = Transform.Instantiate(Resources.Load("CentipedeLink", Transform), lastLink.position, lastLink.rotation);
	newLink.gameObject.name = "Link-" + links.Count;
	newLink.parent = transform;
	newLink.position -= newLink.forward * 0.5f;
	links.Add(newLink);
}

function updateLinks() {
	updateLink(links[0], head);
	for (var i:int = 1; i < links.Count; i++) {
		updateLink(links[i], links[i - 1]);
	}
}

function updateLink(link:Transform, lookAt:Transform) {
	link.LookAt(lookAt);
	link.position = lookAt.position - link.forward * 0.5f;
}
