
var mapsCleared = 0;
var allMaps = [tileMap01, tileMap02, tileMap03];

function gameStart(){
    generateMap(0);
    document.addEventListener("keydown", inputManager);
}

function generateMap(index){
    let mapToLoad = allMaps[index];

    //Clear old map
    clearMap();
    document.getElementById("current-level").innerHTML = "Current Level: " + (mapsCleared+1);

    // Get the map size from the SokobanBase
    let xLength = mapToLoad.mapGrid[0].length;
    let yLength = mapToLoad.mapGrid.length;

    // Loop loop through the grid and assign appropriate classes and IDs
    for (let y = 0; y < yLength; y++) {
        for (let x = 0; x < xLength; x++) {

            let tile = document.createElement("div");

            // Set up inital tile classes (even tiles containing entities are spaces)
            if(mapToLoad.mapGrid[y][x] == "W") {
                tile.classList.add(Tiles.Wall);
            }            
            else if(mapToLoad.mapGrid[y][x] == "G") {
                tile.classList.add(Tiles.Goal);
            }           
            else{
                tile.classList.add(Tiles.Space);
            }  

            // Set up inital entity classes
            if(mapToLoad.mapGrid[y][x] == "P") {
                tile.classList.add(Entities.Character);
                tile.classList.add(Tiles.Space);
            }            
            if(mapToLoad.mapGrid[y][x] == "B") {
                tile.classList.add(Entities.Block);
            }

            tile.classList.add("grid-tile");
            tile.id = ('x' + x + 'y' + y);

            document.getElementById("game-grid").append(tile);

        };
    };
}

function inputManager(e){
    
    e.preventDefault();
    if(e.key == "ArrowUp") moveDirection("up");
    if(e.key == "ArrowDown") moveDirection("down");
    if(e.key == "ArrowRight") moveDirection("right");
    if(e.key == "ArrowLeft") moveDirection("left");
    if(e.key == "r") restartCurrentLevel("left");

    // Check for the game end after each input
    checkGameWon();
}


// NOTE: The current implementation assumes a correct map structure:
// If a map ever allows a player/box to go to the edge of the grid,
// There is no check for this
function moveDirection(direction){

    // Determine movement multipliers
    let dirModifierX = 0;
    let dirModifierY = 0;
    if(direction === "up")      dirModifierY = -1; // Elements higher up have lower Y values
    if(direction === "down")    dirModifierY = 1;
    if(direction === "right")   dirModifierX = 1;
    if(direction === "left")    dirModifierX = -1;  

    // Get the player X and Y in the gird
    let player = document.getElementsByClassName(Entities.Character)[0];
    let playerPos = player.id; //id is grid position and format is (x#y#)
    let playerX = playerPos.split('y')[0].split('x')[1];
    let playerY = playerPos.split('y')[1];

    // Check where the player is going
    let playerDirY = (Math.floor(playerY) + dirModifierY);
    let playerDirX = (Math.floor(playerX) + dirModifierX);
    let targetPos = document.getElementById('x'+playerDirX+'y'+playerDirY);

    // Check if the player is heading into a wall
    if(targetPos.classList.contains(Tiles.Wall)){
        return;
    }
    
    // Check if the player is moving into a block
    if(targetPos.classList.contains(Entities.Block)){

        // Is the next space after the box free
        // If so move the box there
        // If not prevent movement
        let boxDirY = (Math.floor(playerY) + (dirModifierY * 2)); // Check two spaces away from the player in the direction they are moving
        let boxDirX = (Math.floor(playerX) + (dirModifierX * 2)); // Check two spaces away from the player in the direction they are moving
        let boxTargetPos = document.getElementById('x'+boxDirX+'y'+boxDirY);
        if(boxTargetPos.classList.contains(Tiles.Wall) || boxTargetPos.classList.contains(Entities.Block)){
            return;
        }
        else {
            // Move the block
            targetPos.classList.remove(Entities.Block);
            boxTargetPos.classList.add(Entities.Block);

            // Check if the block has entered or left a goal tile
            if(targetPos.classList.contains(Tiles.Goal)) targetPos.classList.remove(Entities.BlockDone);
            if(boxTargetPos.classList.contains(Tiles.Goal)) boxTargetPos.classList.add(Entities.BlockDone);
        }
    }

    // Let player move
    player.classList.remove(Entities.Character);

    targetPos.classList.add(Entities.Character);
}

function checkGameWon(){
    // Are there as many (or more) filled goaltiles as there are goal tiles?

    let allGoalTiles = document.getElementsByClassName(Tiles.Goal);
    let allFilledGoalTiles = document.getElementsByClassName(Entities.BlockDone);

    // Set a small delay to ensure the graphics update first 
    setTimeout(function() {
        if(allFilledGoalTiles.length >= allGoalTiles.length){
            // Note a map has been cleared
            mapsCleared++;

            // If all maps are cleared announce the player beat the game
            // Otherwise load the next map
            if(mapsCleared == allMaps.length){
                
                // Ask if they want to play again, if not close the page
                if(confirm("You beat the game! Play again?")){
                    location.reload();
                }else{
                    close();
                }
            }
            else{
                // Ask if they want to keep playing again, if not close the page
                if(confirm("Good job! You've beaten level " + mapsCleared +", keep going?")){
                    generateMap(mapsCleared);
                }else{
                    close();
                }
            }
        };
    },20)
}

function clearMap(){
        //Clear current map
        document.getElementById("game-grid").innerHTML = "";
}

function restartCurrentLevel(){
    generateMap(mapsCleared);
}
