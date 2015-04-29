#pragma strict

import System.Collections.Generic;

private var startPosition:Vector3;
private var startRotation:Quaternion;

private var isPlayer:boolean = false;
private var decisionTime:float = 0.0f;

private var objectToAvoid:Transform = null;

private var turningLeft:boolean = false;
private var turningRight:boolean = false;

private var head:Transform;
private var links:List.<Transform>;

private var dying:boolean = false;
private var dyingTime:float = 0.0f;
private var flashing:boolean = true;
private var flashingTime:float = 3.0f;
function isFlashing()
{
	return flashing;
}

private var material:Material;
var movementSpeed : float = 5.0f;
var respawnPlayer : boolean = true;

function Start () {
	if (transform.name == "Player0") {
		isPlayer = true;
	}
	material = Resources.Load("PlayerMaterials/" + transform.name, Material);
	startRotation = transform.rotation;
	transform.rotation = Quaternion.identity;
	startPosition = transform.position - (Quaternion.Euler(0.0f, startRotation.eulerAngles.y, 0.0f) * Vector3(0.0f, 0.0f, 1.0f)) * 14.0f;
	head = transform.Find("Head");
	head.animation.Play("Idle");
	setMaterial(head);
	head.rotation = startRotation;
	head.position = startPosition;
	initializeLinks();
}

function initializeLinks() {
	links = new List.<Transform>();
	var firstLink:Transform = Transform.Instantiate(Resources.Load("CentipedeLink", Transform), startPosition, startRotation);
	setMaterial(firstLink);
	firstLink.gameObject.name = "Flashing";
	firstLink.transform.parent = transform;
	firstLink.transform.position -= firstLink.transform.forward * 0.5f;
	firstLink.animation.Play("Idle");
	links.Add(firstLink);
}

function Update () {
	if (Input.GetKeyDown(KeyCode.Escape))
	{
		Application.Quit();
	}
	if (flashing && flashingTime > 0.0f)
	{
		var i:int;
		flashingTime -= Time.deltaTime;
		var transparency:float = 1.0f - flashingTime / 3.0f;
		setAlpha(head, transparency);
		for (i = 0; i < links.Count; i++)
		{
			setAlpha(links[i], transparency);
		}
		if (flashingTime < 0.0f)
		{
			flashing = false;
			head.gameObject.name = "Head";
			head.animation.Play("Walk");
			setAlpha(head, 1.0f);
			for (i = 0; i < links.Count; i++)
			{
				links[i].gameObject.name = "Link-" + i;
				links[i].animation.Play("Walk");
				setAlpha(links[i], 1.0f);
			}
		}
		return;
	}
	if (dying) {
		dyingTime -= Time.deltaTime;
		setAlpha(head, dyingTime);
		for (i = 0; i < links.Count; i++)
		{
			setAlpha(links[i], dyingTime);
		}
		if (dyingTime < 0.0f)
		{
			respawn();
		}
		return;
	}
	// Handle direction changing
	if (isPlayer) {
		if (Application.platform == RuntimePlatform.Android) { // Android platform
			turningLeft = false;
			turningRight = false;
			if (Input.touchCount == 1) {
				if (Input.GetTouch(0).position.x < Screen.width * 0.25f) {
					turningLeft = true;
				}
				if (Input.GetTouch(0).position.x > Screen.width * 0.75f) {
					turningRight = true;
				}
			}
		}
		else { // Non-mobile platform
			if (Input.GetKey("e")) {
				head.position += head.forward * Time.deltaTime * 2.5f;
			}
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
	}
	else {
		decisionTime -= Time.deltaTime;
		if (decisionTime < 0.0f) {
			if (!objectToAvoid) {
				turningLeft = false;
				turningRight = false;
			}
			// cast ray from centipede to nearest food and if it will collide with itself then pick another
			// probably best to get all foods, sort them by their distance, and go through until it finds a suitable one
			// close, infront of centipede rather than behind, not hitting itself, not hitting other centipede, etc
			var headAdjusted:Vector3 = head.position + Vector3(0.0f, 0.25f, 0.0f);
			var hit:RaycastHit;
			//Debug.DrawLine(headAdjusted, headAdjusted + head.forward * 100.0f, Color.green);
			if (Physics.Raycast(headAdjusted, head.forward, hit)) {
				//Debug.Log("Ray hit something: " + hit.transform.name);
				if (hit.transform.name == "Food") {
					// keep going forwards
				}
				else {
					// if its a rock do turning based on position and facing (so turn away from walls)
					if (hit.transform.name == "Head" || hit.transform.name == "Link" || hit.transform.name == "Link-0") {
						avoidCentipede(hit.transform.parent);
					}
					if (hit.transform.name == "Rock0" ||
						hit.transform.name == "Rock1" ||
						hit.transform.name == "Rock2" ||
						hit.transform.name == "Rock3") {
						avoidRock(hit.transform.parent);
					}
				}
			}
			if (objectToAvoid) {
				if (Vector3.Distance(head.position, objectToAvoid.position) > 7.5f || Mathf.Abs(getAngleTo(objectToAvoid)) > 45.0f) {
					objectToAvoid = null;
				}
			}
			if (!objectToAvoid) {
				huntFood();
			}
			decisionTime = 1.0f;
		}
	}
	if (Input.GetKeyDown("t")) {
		addLink();
	}

	// Update position and rotations
	var updateMultiplier:float = Time.deltaTime * movementSpeed;
	head.position += head.forward * updateMultiplier;
	if (turningLeft ^ turningRight) {
		if (turningLeft) {
			head.Rotate(Vector3(0.0f, -30.0f * updateMultiplier, 0.0f));
		}
		if (turningRight) {
			head.Rotate(Vector3(0.0f, 30.0f * updateMultiplier, 0.0f));
		}
	}
	updateLinks();
}

function handleCollision(hit:Transform) {
	if (flashing || dying)
	{
		return;
	}
	var name:String = hit.name;
	if (name == "Flashing")
	{ // if hit object is flashing
		return;
	}
	var parentName:String = hit.parent ? hit.parent.name : "";
	if (parentName == transform.name)
	{ // if hit self
		if (name == "Link-0") {
			// Ignore
		}
		else {
			die();
		}
		return;
	}
	else if (parentName == "Wall") {
		die();
	}
	else if (name == "Food") {
		addLink();
	}
	else if (name == "Head") {
		// this checks if another head hit you in which case check angle
		if ((transform.position - hit.position).z > 0.0f)
		{ // die if you are the crasher
			die();
		}
	}
	else if (name.StartsWith("Link")) {
		die();
	}
}

function loopCentipede(toDo:Function)
{
	toDo(head);
	for (var i:int = 0; i < links.Count; i++)
	{
		toDo(links[i]);
	}
}

function die() {
	dying = true;
	dyingTime = head.animation["Death"].length;
	loopCentipede(applyDeathAnimation);
}

function applyDeathAnimation(transform:Transform)
{
	transform.animation.Play("Death");
}

function respawn() {
	if (respawnPlayer == true) {
		Debug.Log(transform.name);
		dying = false;
		flashing = true;
		flashingTime = 3.0f;
		head.gameObject.name = "Flashing";
		head.transform.position = startPosition;
		head.transform.rotation = startRotation;
		head.animation.Play("Idle");
		for (var i:int = 0; i < links.Count; i++) {
			Destroy(links[i].gameObject);
		}
		initializeLinks();
	}
}

function addLink() {
	var lastLink:Transform = links[links.Count - 1];
	var newLink:Transform = Transform.Instantiate(Resources.Load("CentipedeLink", Transform), lastLink.position, lastLink.rotation);
	setMaterial(newLink);
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

function setAlpha(node:Transform, alpha:float) {
	var tempRenderers:Renderer[] = node.GetComponentsInChildren.<Renderer>();
	for (var temp:Renderer in tempRenderers) {
		if (alpha >= 1.0f)
		{
			temp.material.shader = Shader.Find("Diffuse");
		}
		else
		{
			temp.material.shader = Shader.Find("Transparent/Diffuse");
			temp.material.color.a = alpha;
		}
	}
}

function setMaterial(node:Transform) {
	var tempRenderers:Renderer[] = node.GetComponentsInChildren.<Renderer>();
	for (var temp:Renderer in tempRenderers) {
		temp.material = material;
	}
}

function headTowardsObject(obj:Transform) {
	var rotationDifference:float = getAngleTo(obj);
	if (rotationDifference < 0.0f) {
		turningRight = true;
		turningLeft = false;
	}
	else if (rotationDifference > 0.0f) {
		turningLeft = true;
		turningRight = false;
	}
}

function avoidObject(obj:Transform) {
	var rotationDifference:float = getAngleTo(obj);
	if (rotationDifference < 0.0f) {
		turningLeft = true;
		turningRight = false;
	}
	else {
		turningRight = true;
		turningLeft = false;
	}
}

function huntFood() {
	var nearestDistanceSqr = Mathf.Infinity;
	var taggedGameObjects = GameObject.FindGameObjectsWithTag("Food"); 
	var nearestObj:Transform = null;
	// loop through each tagged object, remembering nearest one found
	for (var obj:GameObject in taggedGameObjects) {
		var objectPos = obj.transform.position;
		var distanceSqr = (objectPos - head.position).sqrMagnitude;
		if (distanceSqr < nearestDistanceSqr) {
			nearestObj = obj.transform;
			nearestDistanceSqr = distanceSqr;
		}
	}
	if (nearestObj != null) {
		headTowardsObject(nearestObj);
	}
}

function avoidCentipede(centipede:Transform) {
	if (centipede == transform) {
		//Debug.Log("Looking at ourself! :O");
	}
	var newObject:Transform = centipede.Find("Head");
	if (newObject != objectToAvoid) {
		objectToAvoid = newObject;
		avoidObject(objectToAvoid);
		return true;
	}
	else {
		return false;
	}
}

function avoidRock(rockWall:Transform) {
	//Debug.Log("Looking at rockwall! :O " + rockWall.name);
}

function getAngleTo(obj:Transform) {
	var difference:Vector3 = obj.position - head.position;
	Debug.DrawLine(obj.position, head.position, Color.green);
	var rotation = Quaternion.LookRotation(difference);
	var rotationDifference:float = head.rotation.eulerAngles.y - rotation.eulerAngles.y;
	return Mathf.Repeat(rotationDifference + 180.0f, 360.0f) - 180.0f;
}
