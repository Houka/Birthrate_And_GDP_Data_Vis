// js for the circle graphs
//
// - gdp per cap would be size of circles, sqrt scale
// - birth rate would be color, 7-10 discrete colors
// - big circles to contain continents for organization purposes
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

function scaleBirthRate(birthrate){
	return birthrate;
}

function scaleGDP(gdp){
	return gdp;
}

function mapLocationX(countryName){
	var x = 100;
	return x;
}

function mapLocationY(countryName){
	var y = 100;
	return y;
}

function displayCombinedData(combinedData){
	// Code in here
	var svg = mainDiv.append("svg")
				.attr("height", "100%")
				.attr("width", "100%");

	combinedData.forEach(function(d){
		var data = d.values[0];

		// constant vars
		var CIRCLE_COLOR = "red";
		var TEXT_COLOR = "#ccc"

		// dynamic vars
		var cx = mapLocationX(data.country);
		var cy = mapLocationY(data.country);
		var br = scaleBirthRate(data.birthrate);
		var gdp = scaleGDP(data.gdp)

		svg.append("circle")
			.attr("cx",cx)
			.attr("cy",cy)
			.attr("fill", CIRCLE_COLOR)
			.attr("opacity", gdp)
			.attr("r", gdp);
		
		svg.append("text")
			.attr("x",cx)
			.attr("y",cy)
			.attr("text-anchor","middle")
			.attr("alignment-baseline","middle")
			.text("br: "+br+", gdp:"+gdp)
			.attr("fill", TEXT_COLOR);
	})
}