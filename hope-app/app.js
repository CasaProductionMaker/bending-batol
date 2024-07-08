const mapContainer = document.querySelector(".map-container");
let alreadyChecked = [];
let points = {
	"point1": {
		name: "point1", 
		attachments: ["point2"], 
		x: -3850, 
		y: 1650
	}, 
	"point2": {
		name: "point2", 
		attachments: ["point1", "point3", "point10"], 
		x: -3470, 
		y: 1650
	}, 
	"point3": {
		name: "point3", 
		attachments: ["point2", "point4"], 
		x: -3470, 
		y: 1950
	}, 
	"point4": {
		name: "point4", 
		attachments: ["point3", "point5"], 
		x: -3410, 
		y: 2200
	}, 
	"point5": {
		name: "point5", 
		attachments: ["point4", "point6"], 
		x: -3200, 
		y: 2370
	}, 
	"point6": {
		name: "point6", 
		attachments: ["point5", "point"], 
		x: -2900, 
		y: 2100
	}, 
	"point7": {
		name: "point7", 
		attachments: ["point5", "point8"], 
		x: -3200, 
		y: 1900
	}, 
	"point8": {
		name: "point7", 
		attachments: ["point7", "point9"], 
		x: -3170, 
		y: 1550
	}, 
	"point9": {
		name: "point9", 
		attachments: ["point8", "point10", "point15"], 
		x: -3050, 
		y: 1100
	}, 
	"point10": {
		name: "point10", 
		attachments: ["point9", "point2"], 
		x: -3350, 
		y: 1250
	}, 
	"point11": {
		name: "point11", 
		attachments: ["point10", "point12"], 
		x: -3200, 
		y: 800
	}, 
	"point12": {
		name: "point12", 
		attachments: ["point11", "point13"], 
		x: -3040, 
		y: 400
	}, 
	"point13": {
		name: "point13", 
		attachments: ["point12", "point14"], 
		x: -2640, 
		y: 50
	}, 
	"point14": {
		name: "point14", 
		attachments: ["point13", "point15"], 
		x: -2750, 
		y: 350
	}, 
	"point15": {
		name: "point15", 
		attachments: ["point14", "point16", "point9"], 
		x: -2880, 
		y: 680
	}, 
	"point16": {
		name: "point16", 
		attachments: ["point13", "point15", "point17"], 
		x: -2560, 
		y: 530
	}, 
	"point17": {
		name: "point17", 
		attachments: ["point16", "point18", "point40"], 
		x: -2650, 
		y: 800
	}, 
	"point18": {
		name: "point18", 
		attachments: ["point17", "point19"], 
		x: -2770, 
		y: 1130
	}, 
	"point19": {
		name: "point19", 
		attachments: ["point18", "point20"], 
		x: -2930, 
		y: 1530
	}, 
	"point20": {
		name: "point20", 
		attachments: ["point19", "point6"], 
		x: -2950, 
		y: 1830
	}, 
	"point21": {
		name: "point21", 
		attachments: ["point6", "point22"], 
		x: -2910, 
		y: 2430
	}, 
	"point22": {
		name: "point22", 
		attachments: ["point21", "point23"], 
		x: -2910, 
		y: 2880
	}, 
	"point23": {
		name: "point23", 
		attachments: ["point22", "point5"], 
		x: -3160, 
		y: 2950
	}, 
	"point24": {
		name: "point24", 
		attachments: ["point22", "point25"], 
		x: -2560, 
		y: 2840
	}, 
	"point25": {
		name: "point25", 
		attachments: ["point24", "point26"], 
		x: -2160, 
		y: 2780
	}, 
	"point26": {
		name: "point26", 
		attachments: ["point25", "point27"], 
		x: -1760, 
		y: 2720
	}, 
	"point27": {
		name: "point27", 
		attachments: ["point26", "point28"], 
		x: -1360, 
		y: 2650
	}, 
	"point28": {
		name: "point28", 
		attachments: ["point27", "point29"], 
		x: -900, 
		y: 2570
	}, 
	"point29": {
		name: "point29", 
		attachments: ["point28", "point30"], 
		x: -500, 
		y: 2500
	}, 
	"point30": {
		name: "point30", 
		attachments: ["point29", "point31"], 
		x: -230, 
		y: 2400
	}, 
	"point31": {
		name: "point31", 
		attachments: ["point30", "point32"], 
		x: -140, 
		y: 2100
	}, 
	"point32": {
		name: "point32", 
		attachments: ["point31", "point33"], 
		x: -120, 
		y: 1800
	}, 
	"point33": {
		name: "point33", 
		attachments: ["point32", "point34"], 
		x: -120, 
		y: 1470
	}, 
	"point34": {
		name: "point34", 
		attachments: ["point33", "point35"], 
		x: -140, 
		y: 1100
	}, 
	"point35": {
		name: "point35", 
		attachments: ["point34", "point36"], 
		x: -200, 
		y: 780
	}, 
	"point36": {
		name: "point36", 
		attachments: ["point35", "point37"], 
		x: -600, 
		y: 760
	}, 
	"point37": {
		name: "point37", 
		attachments: ["point36", "point38"], 
		x: -1000, 
		y: 780
	}, 
	"point38": {
		name: "point38", 
		attachments: ["point37", "point39"], 
		x: -1400, 
		y: 790
	}, 
	"point39": {
		name: "point39", 
		attachments: ["point38", "point40"], 
		x: -1800, 
		y: 800
	}, 
	"point40": {
		name: "point40", 
		attachments: ["point39", "point17"], 
		x: -2250, 
		y: 810
	}, 
	"point41": {
		name: "point41", 
		attachments: ["point19", "point42"], 
		x: -2600, 
		y: 1530
	}, 
	"point42": {
		name: "point42", 
		attachments: ["point41", "point43"], 
		x: -2300, 
		y: 1530
	}, 
	"point43": {
		name: "point43", 
		attachments: ["point42", "point44"], 
		x: -1950, 
		y: 1520
	}, 
	"point44": {
		name: "point44", 
		attachments: ["point43", "point45"], 
		x: -1600, 
		y: 1510
	}, 
	"point45": {
		name: "point45", 
		attachments: ["point44", "point46"], 
		x: -1250, 
		y: 1500
	}, 
	"point46": {
		name: "point46", 
		attachments: ["point45", "point47"], 
		x: -900, 
		y: 1490
	}, 
	"point47": {
		name: "point47", 
		attachments: ["point46", "point33"], 
		x: -500, 
		y: 1480
	}, 
	"point48": {
		name: "point48", 
		attachments: ["point6", "point49"], 
		x: -2500, 
		y: 2100
	}, 
	"point49": {
		name: "point49", 
		attachments: ["point48", "point50"], 
		x: -2050, 
		y: 2090
	}, 
	"point50": {
		name: "point50", 
		attachments: ["point49", "point51"], 
		x: -1600, 
		y: 2100
	}, 
	"point51": {
		name: "point51", 
		attachments: ["point50", "point52"], 
		x: -1200, 
		y: 2130
	}, 
	"point52": {
		name: "point52", 
		attachments: ["point51", "point28"], 
		x: -1000, 
		y: 2330
	}, 
	"point53": {
		name: "point53", 
		attachments: ["point50", "point43"], 
		x: -1800, 
		y: 1820
	}
}
let finalPath;
let destination = "point9";

Object.keys(points).forEach((point) => {
	const pointElement = document.createElement("img");
    pointElement.classList.add("Point");
    const left = points[point].x + "%";
    const top = points[point].y + "%";
    pointElement.style.transform = `translate3d(${left}, ${top}, 0)`;
    pointElement.setAttribute("src", "Point.png")
    mapContainer.appendChild(pointElement);
})

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
					console.log("scanner " + j + " has already moved")
					var reducedArray = [];
					reducedArray = scanners[j].myPath;
					console.log(reducedArray)
					reducedArray.pop()
					console.log(scanners[j].myPath)
					console.log(reducedArray)
					let prevOn = reducedArray[reducedArray.length-1];
					console.log(prevOn)
					scanners.push({
						on: prevOn, 
						myPath: reducedArray
					})
					console.log("creating new scanner")
					console.log(scanners)
				}
			}
		}
		console.log("end of scanner iteration")
		console.log("scanner " + j + " path: " + scanners[j].myPath)
	}
}
for (var i = 0; i < finalPath.length; i++) {
	document.querySelector("#res").innerText += finalPath[i]
}