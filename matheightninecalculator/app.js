let testsNum = [28.75, 24, 26.25];
let testsDen = [40, 27, 33];
let thisTestType = ""; //mid-term, final, or normal

let testsTotalNum = 0;
for (var i = 0; i < testsNum.length; i++) {
	testsTotalNum += testsNum[i];
}

let testsTotalDen = 0;
for (var i = 0; i < testsDen.length; i++) {
	testsTotalDen += testsDen[i];
}

testsTotalScore = (testsTotalNum / testsTotalDen) * 100;

