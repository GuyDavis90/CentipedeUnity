#pragma strict

import System.Collections.Generic;

private var head:Transform;
private var links:List.<Transform>;

function Start () {
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
	if (Input.GetKey("w")) {
		head.position += head.forward * Time.deltaTime * 2.5f;
		if (Input.GetKey("a")) {
			head.rotation.eulerAngles.y -= 50.0f * Time.deltaTime;
		}
		if (Input.GetKey("d")) {
			head.rotation.eulerAngles.y += 50.0f * Time.deltaTime;
		}
	}
	if (Input.GetKeyDown("t")) {
		addLink();
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
