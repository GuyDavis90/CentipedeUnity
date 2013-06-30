#pragma strict

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
}

function Update () {

}