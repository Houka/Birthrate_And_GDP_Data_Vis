// js for the bar graphs
//
// - organized by low/mid/high income
// - line graphs

function displayBirthAndGDPData(birthData,GDPData,year){
	// Code in here
	var result = [];
	for(var i = 0; i<birthData.length; i++){
		var birthObj = birthData[i].values[0];
		var GDPObj = GDPData[i].values[0];

		var birthYear = birthObj[year];
		var GDPYear = GDPObj[year];

		var combinedObj = {
			key:birthObj.country,
			values:[
				{
					country: birthObj.country,
					birthrate: birthYear,
					gdp: GDPYear
				}
			]
		}

		result = result.concat([combinedObj]);
	}

	displayCombinedData(result);
}

function displayCombinedData(combinedData){
	// Code in here
	var svg = mainDiv.append("svg")
				.attr("height", "100%")
				.attr("width", "100%");

	combinedData.forEach(function(d){
		var data = d.values[0];

		// code here to parse data into a chart form

	})
}