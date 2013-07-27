#pragma strict

var numberOfPlayers:int = 8;

var foodQuantity : int = 10;
// Our food instances variable
private var food:GameObject[];
private var foodSpeed : int = 5;

function Start () {
	initializeRocks();
	initializePlayers();
	initializeFoods();
}

function Update () {
}

function initializeRocks() {
	var NorthWall:Transform = transform.Find("NorthWall");
	var EastWall:Transform = transform.Find("EastWall");
	var SouthWall:Transform = transform.Find("SouthWall");
	var WestWall:Transform = transform.Find("WestWall");
	var rocks:GameObject[] = new GameObject[4];
	for (var o:int = 0; o < 4; o++) {
		rocks[o] = Resources.Load("Rocks/Rock" + o, GameObject);
	}
	var rock:GameObject;
	for (var r:int = -16; r < 16; r++) {
		// Rocks north wall
		rock = Instantiate(rocks[Random.Range(0, 4)], Vector3((r + 1) * 1.0f, 0.0f, 16.0f), Quaternion.Euler(0.0f, Random.value * 360.0f, 0.0f));
		rock.name = "Wall";
		rock.transform.parent = NorthWall;
		// Rocks east wall
		rock = Instantiate(rocks[Random.Range(0, 4)], Vector3(16.0f, 0.0f, r * 1.0f), Quaternion.Euler(0.0f, Random.value * 360.0f, 0.0f));
		rock.name = "Wall";
		rock.transform.parent = EastWall;
		// Rocks south wall
		rock = Instantiate(rocks[Random.Range(0, 4)], Vector3(r * 1.0f, 0.0f, -16.0f), Quaternion.Euler(0.0f, Random.value * 360.0f, 0.0f));
		rock.name = "Wall";
		rock.transform.parent = SouthWall;
		// Rocks west wall
		rock = Instantiate(rocks[Random.Range(0, 4)], Vector3(-16.0f, 0.0f, (r + 1) * 1.0f), Quaternion.Euler(0.0f, Random.value * 360.0f, 0.0f));
		rock.name = "Wall";
		rock.transform.parent = WestWall;
	}
}

// Player positions are calculated here on the fly based on how many players
// in the game and evenly spaced on a circle
function initializePlayers() {
	var playerPrefab:GameObject = Resources.Load("PlayerPrefab", GameObject);
	for (var i:int = 0; i < numberOfPlayers; i++) {
		var player:GameObject = playerPrefab.Instantiate(playerPrefab, Vector3(), Quaternion.Euler(0.0f, (360.0f / numberOfPlayers) * i, 0.0f));
		player.name = "Player" + i;
		player.transform.parent = transform;
	}
}

// Perhaps we should be checking relative positions to everything when we are instantiating the foods so we dont spawn it inside something
function initializeFoods() {
	food = new GameObject[foodQuantity];
	for (var i:int = 0; i < foodQuantity; i++) {
		var foodObject:GameObject = Resources.Load("Food", GameObject);
		food[i] = Instantiate(foodObject, Vector3(Random.Range(-15.0f, 15.0f), 0.0f, Random.Range(-15.0f, 15.0f)), Quaternion.Euler(0.0f, Random.value * 360.0f, 0.0f));
		food[i].name = "Food";
	}
}
