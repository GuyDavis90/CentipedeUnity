#pragma strict

// Our food instances variable

var food:GameObject[];
var foodQuantity : int = 5;
var foodSpeed : int = 5;

private var foodCounter : int = 0;



function Start () {
	var playerPrefab:Transform = Resources.Load("PlayerPrefab", Transform);
	for (var i:int = 0; i < 16; i++) {
		var playerStart:Transform = transform.Find("PlayerStart" + i);
		if (playerStart) {
			var playerInstance:Transform = playerPrefab.Instantiate(playerPrefab, playerStart.transform.position, playerStart.transform.rotation);
			playerInstance.name = "Player" + i;
			playerInstance.parent = playerStart.transform;
		}
	}
	var rocks:GameObject[] = new GameObject[4];
	for (var o:int = 0; o < 4; o++) {
		rocks[o] = Resources.Load("Rocks/Rock" + o, GameObject);
	}
	var rock:GameObject;
	for (var r:int = -16; r < 16; r++) {
		// Rocks north wall
		rock = Instantiate(rocks[Random.Range(0, 4)], Vector3(r * 1.0f, 0.0f, 16.0f), Quaternion.Euler(0.0f, Random.value * 360.0f, 0.0f));
		rock.name = "NorthWall";
		// Rocks east wall
		rock = Instantiate(rocks[Random.Range(0, 4)], Vector3(16.0f, 0.0f, r * 1.0f), Quaternion.Euler(0.0f, Random.value * 360.0f, 0.0f));
		rock.name = "EastWall";
		// Rocks south wall
		rock = Instantiate(rocks[Random.Range(0, 4)], Vector3(r * 1.0f, 0.0f, -16.0f), Quaternion.Euler(0.0f, Random.value * 360.0f, 0.0f));
		rock.name = "SouthWall";
		// Rocks west wall
		rock = Instantiate(rocks[Random.Range(0, 4)], Vector3(-16.0f, 0.0f, r * 1.0f), Quaternion.Euler(0.0f, Random.value * 360.0f, 0.0f));
		rock.name = "WestWall";
	}
}
function addFood() {
	var foodObject:GameObject = Resources.Load("Food", GameObject);
	Instantiate(foodObject, Vector3(Random.Range(-15.0f, 15.0f), 0.0f, Random.Range(-15.0f, 15.0f)), Quaternion.Euler(0.0f, Random.value * 360.0f, 0.0f));
}
function Update () {
	if (foodCounter < foodQuantity);
		addFood(); 
}
