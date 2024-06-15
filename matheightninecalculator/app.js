let testsNum = [28.75, 24, 26.25, 24.25, 30, 44, 16.5];
let testsDen = [40, 27, 33, 29, 43, 47, 17];
let midTermNum = 45;
let midTermDen = 50;
let nextTermDen = 40;
let thisTestType = "normal"; //mid-term, final, or normal
let hasDoneMidTerm = true;
let minimumScore = 75;

function setTestType(type) {
	thisTestType = type;
}

function calculate_needed() {
	midTermNum = parseFloat(document.getElementById("midTermScore").value);
	nextTermDen = parseFloat(document.getElementById("nextTestDen").value);
	testsNum[0] = parseFloat(document.getElementById("test1score").value);
	testsNum[1] = parseFloat(document.getElementById("test2score").value);
	testsNum[2] = parseFloat(document.getElementById("test3score").value);
	testsNum[3] = parseFloat(document.getElementById("test4score").value);
	testsNum[4] = parseFloat(document.getElementById("test5score").value);
	testsNum[5] = parseFloat(document.getElementById("test6score").value);
	testsNum[6] = parseFloat(document.getElementById("test7score").value);
	minimumScore = parseFloat(document.getElementById("minScore").value);
	let testsTotalNum = 0;
	for (var i = 0; i < testsNum.length; i++) {
		testsTotalNum += testsNum[i];
	}

	let testsTotalDen = 0;
	for (var i = 0; i < testsDen.length; i++) {
		testsTotalDen += testsDen[i];
	}

	let testsTotalScore = (testsTotalNum / testsTotalDen) * 100;
	let midTermScore = (midTermNum / midTermDen) * 100;
	if(thisTestType == "mid-term")
	{
		//0.875 & 0.125
		alert((minimumScore - (testsTotalScore * 0.875)) / 0.125);
	} else if(thisTestType == "final")
	{
		//0.875 & 0.125
		alert(((minimumScore - (testsTotalScore * 0.7)) - (midTermScore * 0.1)) / 0.2);
	} else if(thisTestType = "normal")
	{
		if(hasDoneMidTerm)
		{
			alert((((((minimumScore - (midTermScore * 0.125)) / 0.875) / 100) * (testsTotalDen + nextTermDen)) - testsTotalScore) + "% (" + Math.round(((((((minimumScore - (midTermScore * 0.125)) / 0.875) / 100) * (testsTotalDen + nextTermDen)) - testsTotalScore) / 100) * nextTermDen) + "/" + nextTermDen + ")");
		} else {
			alert(((minimumScore / 100) * (testsTotalDen + nextTermDen)) - testsTotalNum);
		}
	}
}