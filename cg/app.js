let wheelPossibilities = ["Skip", "Attack", "Open", "Pass the Wheel", "Lucky Guess", "Give", "Blind Open", "Point", "Lucky Guess", "Switch", "Skip", "Give", "Lucky Guess", "Switch", "Point"];
let wheelDescriptions = [
	"Skip your turn, better luck next time!", 
	"Spin the wheel again, and the next person skips their turn.", 
	"The person who is giving you a present has to stand up and give it to you. Make sure to guess first! If you have already recieved your present, you get a point!", 
	"Choose someone else to go next immediately instead of you (This cannot be you!) Play continues from there.", 
	"Guess who is giving you a present. If you get it right, open it immediately. Otherwise, skip your turn. If you have already recieved your present, you get a point!", 
	"Give your present to its rightful owner. Make sure they guess before opening! If you have already given your present, you get a point!", 
	"Open your present blindfolded and make a guess before seeing it. If you have already recieved your present, you get a point!", 
	"You get a point!", 
	"Guess who is giving you a present. If you get it right, open it immediately. Otherwise, skip your turn. If you have already recieved your present, you get a point!", 
	"Switch places in line with someone else. This person cannot be beside you. Play continues from whoever was after you before the switch.", 
	"Skip your turn, better luck next time!", 
	"Give your present to its rightful owner. Make sure they guess before opening! If you have already given your present, you get a point!", 
	"Guess who is giving you a present. If you get it right, open it immediately. Otherwise, skip your turn. If you have already recieved your present, you get a point!", 
	"Switch places in line with someone else. This person cannot be beside you. Play continues from whoever was after you before the switch.", 
	"You get a point!"
];
let wheelPos = 0;
let wheelState = wheelPossibilities[wheelPos];

function advanceWheel(iteration) {
	wheelPos++;
	if(wheelPos >= wheelPossibilities.length)
	{
		wheelPos = 0;
	}
	wheelState = wheelPossibilities[wheelPos];
	document.querySelector("#display").innerText = wheelState;
	console.log(wheelPos)
	if(iteration < 1000)
	{
		setTimeout(() => {advanceWheel(iteration * 1.15);}, iteration);
	} else {
		wheelPos--;
		if (wheelPos < 0)
		{
			wheelPos = wheelPossibilities.length - 1;
		}
		alert(wheelDescriptions[wheelPos]);
	}
}

function spinWheel() {
	let StartIter = Math.round(Math.random() * 40) + 1;
	setTimeout(() => {advanceWheel(StartIter);}, StartIter);
}

//edge cases
