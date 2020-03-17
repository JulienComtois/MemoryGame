/*TODO:
Add something for successfuly completing the game
Add counters:
	games played
	moves taken
	avg moves taken
	time taken
	avg time taken
Add decorations
Change cover color
*/

//Global namespace declaration
var g = {};

//Initialize elements of the page
function init() 
{
	g.body = document.getElementsByTagName("body")[0];
	g.bgImg = document.getElementById("bgimg");
	g.coversDiv = document.getElementById("covers"); 
	g.tilesDiv = document.getElementById("tiles"); 
	g.buttonEndGame = document.getElementById("endnow"); 
	g.buttonPlayAgain = document.getElementById("playagain"); 
	g.stats = document.getElementById("stats");
	g.lastKeyPressed = "x";
	g.moveCtr = 0;
	g.matchCtr = 0;
	g.flipCtr = 0;
	g.bgImgCtr = 0;
	g.movesLastGame = 0;
	g.timerLastGame = 0;
	g.completedLastGame = false;
	g.hasPlayedMoreThanOneGame = false;
	g.timer = 0;
	g.tiles = [];
	g.covers = [];
	g.clickedCovers = [];
	initPicArrays();
	cacheImages(g.tilePicLocs);
	cacheImages(g.coverPicLocs);
	cacheImages(g.bgPicLocs);
	createTiles();
	createCovers();
	addEvent(g.coversDiv, "click", handleClick);
	addEvent(g.body, "keypress", handleKeyPress);
	addEvent(g.buttonEndGame, "click", endGame);
	addEvent(g.buttonPlayAgain, "click", playAgain);
	setInterval(updateStats, 1000);
}

//Define locations for all pictures
function initPicArrays()
{
	g.tilePicLocs = 
		["media/TI_Blue.png",
		"media/TI_Green.png", 
		"media/TI_LightBlue.png", 
		"media/TI_Orange.png",  
		"media/TI_Pink.png", 
		"media/TI_Purple.png", 
		"media/TI_Red.png",  
		"media/TI_Yellow.png"];
	g.coverPicLocs = 
		["media/CO_A.png", 
		"media/CO_B.png", 
		"media/CO_C.png", 
		"media/CO_D.png", 
		"media/CO_E.png", 
		"media/CO_F.png", 
		"media/CO_G.png", 
		"media/CO_H.png", 
		"media/CO_I.png", 
		"media/CO_J.png", 
		"media/CO_K.png", 
		"media/CO_L.png", 
		"media/CO_M.png", 
		"media/CO_N.png", 
		"media/CO_O.png", 
		"media/CO_P.png"];
	g.bgPicLocs =
		["media/BG_Bunny.jpg", 
		"media/BG_Cat.jpg",
		"media/BG_Fox.jpg",
		"media/BG_Duck.jpg",
		"media/BG_Dog.jpg"];
}

//Cache the images on the client's machine
function cacheImages(array)
{
	var img = new Image();
	for (var item in array)
		img.src = item;
}

//Check if there is a match or not, and take actions accordingly
function checkMatch()
{
	var index1 = g.clickedCovers.pop();
	var index2 = g.clickedCovers.pop();
	if(g.tiles[index1].src == g.tiles[index2].src)
	{
		g.tiles[index1].style.visibility = "hidden";
		g.tiles[index2].style.visibility = "hidden";	
		g.matchCtr++;
	}
	else
	{
		g.covers[index1].style.visibility = "visible";
		g.covers[index2].style.visibility = "visible";
	}
	g.flipCtr = 0;
	g.moveCtr++;
	g.lastKeyPressed = "x";
}

//Creates all 16 game covers
function createCovers()
{
	for (var i = 0; i < 16; i++)
	{
		g.covers[i] = document.createElement("img");
		g.covers[i].setAttribute('src', g.coverPicLocs[i]);
		g.covers[i].setAttribute('class', 'cover');
		//Added floating here instead of CSS because it didn't work properly when in CSS file
		g.covers[i].setAttribute('float', 'left');
		g.covers[i].setAttribute('id', i);
		g.coversDiv.appendChild(g.covers[i]);
	}
}

//Creates all 16 game tiles
function createTiles()
{
	var count = 0;
	var tiles = [];
	for (var i = 0; i < 16; i++)
	{
		tiles[i] = document.createElement("img");
		tiles[i].setAttribute('src', g.tilePicLocs[count]);
		tiles[i].setAttribute('class', 'tile');
		//Added floating here instead of CSS because it didn't work properly when in CSS file
		tiles[i].setAttribute('float', 'left');
		count++;
		//To ensure we get 8 pairs
		if (count === 8)
			count = 0;
	}
	g.tiles = shuffleArray(tiles);
	for (var y = 0; y < g.tiles.length; y++)
	{
		g.tilesDiv.appendChild(g.tiles[y]);
	}
}

function endGame()
{
	for (var y = 0; y < g.tiles.length; y++)
	{
		g.tiles[y].style.visibility = "hidden";
	}
	for(var i = 0; i < g.covers.length; i++)
	{
		g.covers[i].style.visibility = "hidden";
	}
	removeEvent(g.body, "keypress", handleKeyPress);
}

//Flip over the cover which was clicked
//Click event handler
function flipCover(target)
{
	if (g.flipCtr < 2)
	{
		g.clickedCovers.push(target.id);
		g.flipCtr++;
		target.style.visibility = "hidden";
		if (g.flipCtr == 2)
		{
			setTimeout(checkMatch, 1000);
		}
	}
}

function handleClick(e)
{
	var evt = e || window.event;
	var target = evt.target || evt.srcElement;
	g.lastKeyPressed = parseInt(target.id) + 65;
	flipCover(target);
}

function handleKeyPress(e)
{
	var evt = e || window.event;
	var key = evt.which || evt.keyCode;
	if(key >= 97 && key <= 112) //check between a and p
		key -= 32;  //convert to upper case
	if (key >=  65 && key <= 80) //check between A and P
	{
		if(g.lastKeyPressed != key)
			flipCover(g.covers[key - 65]);
		g.lastKeyPressed = key;
	}
}

function playAgain()
{
	g.bgImg.src = g.bgPicLocs[++g.bgImgCtr % g.bgPicLocs.length];
	g.flipCtr = 0;
	g.tiles = [];
	g.clickedCovers = [];
	while (g.tilesDiv.hasChildNodes())
	{
		g.tilesDiv.removeChild(g.tilesDiv.lastChild);
	}
	createTiles();
	for(var i = 0; i < g.covers.length; i++)
	{
		g.covers[i].style.visibility = "visible";
	}
	addEvent(g.body, "keypress", handleKeyPress);
	g.hasPlayedMoreThanOneGame = true;
	g.movesLastGame = g.moveCtr;
	g.timerLastGame = g.timer;
	g.moveCtr = 0;
	g.timer = 0;
	if(g.matchCtr >= 8)
		g.completedLastGame = true;
	updateStats();
}

function shuffleArray(array) 
{
 	var index = array.length;
 	var temp;
 	var rand;
	while (index !== 0) 
	{
		rand = Math.floor(Math.random() * index);
		index -= 1;
		temp = array[index];
		array[index] = array[rand];
		array[rand] = temp;
	}
	return array;
}

function updateStats()
{
	g.timer++;
	g.stats.innerHTML = "<b><u>Stats</u></b><br/>Moves: " + g.moveCtr + "</br>Time Taken(sec): " + g.timer;
	if (g.hasPlayedMoreThanOneGame)
	{
		g.stats.innerHTML += "<br/><br/>Completed last round: " + g.completedLastGame + "<br/>Moves last round: " + g.movesLastGame + "<br/>Time last round: " + g.timerLastGame;
	}
}

// Adds event listeners to objects using the appropriate listener for the browser in use
// Author: Myles Burgess
function addEvent(obj, type, fn){
	if(obj.addEventListener){
		obj.addEventListener(type, fn, false);
	}
	else if(obj.attachEvent){
		obj.attachEvent("on"+type, fn);
	}
}

// Remove event listeners from objects using the approriate listeners for the browser in use
// Author: Myles Burgess
function removeEvent(obj, type, fn){
	if(obj.removeEventListener){
		obj.removeEventListener(type, fn, false);
	}
	else if(obj.detachEvent){
		obj.detachEvent("on"+type, fn);
	}
}

//Run once the page is loaded
window.onload = init;