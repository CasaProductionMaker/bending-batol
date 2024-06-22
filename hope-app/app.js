let alreadyChecked = [];
let points = {
	"point1": {
		name: "point1", 
		attachments: ["point2"]
	}, 
	"point2": {
		name: "point2", 
		attachments: ["point1", "point3"]
	}, 
	"point3": {
		name: "point3", 
		attachments: ["point2", "point4", "point5"]
	}, 
	"point4": {
		name: "point4", 
		attachments: ["point3", "point5"]
	}, 
	"point5": {
		name: "point5", 
		attachments: ["point3", "point4"]
	}
}
let finalPath;
let destination = "point4";

let scanners = [
	{
		on: "point1", 
		myPath: []
	}
]
alreadyChecked.push("point1");
scanners[0].myPath.push("point1");
console.log(scanners[0].myPath)
console.log("initializing...")
let hasFound = false;
for (var i = 0; i < 6; i++) {
	for (var j = 0; j < scanners.length; j++) {
		hasMoved = false;
		if(!hasFound)
		{
			let lengthOfArray = points[scanners[j].on].attachments.length;
			for (var k = 0; k < lengthOfArray; k++) {
				if(alreadyChecked.includes(points[scanners[j].on].attachments[k]))
				{
					continue;
				}
				console.log("checking array of " + scanners[j].on + " with length " + lengthOfArray)
				console.log(points[scanners[j].on].attachments)
				console.log("checking point " + points[scanners[j].on].attachments[k] + " on scanner " + j)
				if(!hasMoved)
				{
					console.log("scanner " + j + " has yet to move")
					scanners[j].on = points[scanners[j].on].attachments[k];
					alreadyChecked.push(scanners[j].on)
					scanners[j].myPath.push(scanners[j].on)
					hasMoved = true;
					console.log("scanner " + j + " in on point " + scanners[j].on)
					if(scanners[j].on == destination)
					{
						finalPath = scanners[j].myPath;
						hasFound = true;
						break;
					}
				} else {
					let reducedArray = scanners[j].myPath;
					reducedArray.pop()
					console.log(reducedArray)
					let prevOn = reducedArray[reducedArray.length-1];
					console.log(prevOn)
					scanners.push({
						on: prevOn, 
						myPath: reducedArray
					})
					console.log("scanner " + j + " has already moved")
					console.log("creating new scanner")
				}
			}
		}
		console.log("end of scanner iteration")
	}
}
for (var i = 0; i < finalPath.length; i++) {
	document.querySelector("#res").innerText += finalPath[i]
}