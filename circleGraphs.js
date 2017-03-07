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
		console.log(result);
		result = result.concat([combinedObj]);
	}

	return result;
}

function mapLocationX(countryName){
	var x = Math.random()*screenWidth;
	return x;
}

function mapLocationY(countryName){
	var y = Math.random()*screenHeight;
	return y;
}

function displayCombinedData(combinedData){
	// Code in here
	var svg = mainDiv.append("svg")
				.attr("height", "100%")
				.attr("width", "100%");

	var birthRateColors = ['#00FFFF', '#FF00FF'];

	var birthRateExtent = d3.extent(combinedData, function(d) {	
		var data = d.values[0];
		return +data.birthrate; 
	});
	var GDPExtent = d3.extent(combinedData, function(d) { 
		var data = d.values[0];
		return +data.gdp; 
	});

	var scaleBirthRate = d3.scaleLinear()
		.domain(birthRateExtent)
		.range(birthRateColors);

	var scaleGDP = d3.scaleSqrt()
		.domain(GDPExtent)
		.range([5,100]);

	combinedData.forEach(function(d){
		var data = d.values[0];

		// constant vars
		var CIRCLE_COLOR = "red";
		var TEXT_COLOR = "#ccc"

		// dynamic vars
		var cx = mapLocationX(data.country);
		var cy = mapLocationY(data.country);
		var br = scaleBirthRate(+data.birthrate);
		var gdp = scaleGDP(+data.gdp);

		svg.append("circle")
			.attr("r", gdp)
			.attr("cx",cx)
			.attr("cy",cy)
			.style("fill", br);
		
		svg.append("text")
			.attr("x",cx)
			.attr("y",cy)
			.attr("text-anchor","middle")
			.attr("alignment-baseline","middle")
			.text("br: "+br+", gdp:"+gdp)
			.attr("fill", TEXT_COLOR);
	})
}