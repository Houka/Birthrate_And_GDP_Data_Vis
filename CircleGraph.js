// js for the circle graphs
//
// - gdp per cap would be size of circles, sqrt scale
// - birth rate would be color, 7-10 discrete colors
// - big circles to contain continents for organization purposes
function mapLocationX(countryName){
	var x = Math.random()*screenWidth;
	return x;
}

function mapLocationY(countryName){
	var y = Math.random()*screenHeight;
	return y;
}

function displayCombinedData(combinedData, nestedCombinedData){
	// Code in here
	var svg = mainDiv.append("svg")
	.attr("height", "100%")
	.attr("width", "100%");

	var birthRateColors = ['#ffffcc','#a1dab4','#41b6c4','#2c7fb8','#253494'];

	var birthRateExtent = d3.extent(combinedData, function(d) {	
		var data = d.values[0];
		return +data.birthrate; 
	});
	var GDPExtent = d3.extent(combinedData, function(d) { 
		var data = d.values[0];
		return +data.gdp; 
	});

	var scaleBirthRate = d3.scaleOrdinal()
	.domain(birthRateExtent)
	.range(birthRateColors);

	var scaleGDP = d3.scaleSqrt()
	.domain(GDPExtent)
	.range([5,100]);

	nestedCombinedData.forEach( function(continents){
		console.log(continents.values);
		/*svg.append("text")
			.attr("x",cx)
			.attr("y",cy)
			.attr("text-anchor","middle")
			.attr("alignment-baseline","middle")
			.text("br: "+br+", gdp:"+gdp)
			.attr("fill", TEXT_COLOR);*/

		/*var pack = d3.pack();
		var g = svg.append("g");

		continent = d3.hierarchy(continent)
					.sum(function(d) {
						console.log(d);
						return d;
					});

		console.log(continent);

		pack(continent);

		console.log(continent);

		var node = g.selectAll(".node")
					.data(continent.values)
					.enter().append("g")
					.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

		node.append("title")
		.text(function(d) { return d.countrycode;});

		node.append("circle")
		.attr("r", scaleGDP(+d.gdp))
		.style("fill", scaleBirthRate(+d.birthrate));*/


		continents.values.forEach(function(d){
			var data = d.values[0];
			var cx = mapLocationX(data.country);
			var cy = mapLocationY(data.country);
			var br = scaleBirthRate(+data.birthrate);
			var gdp = scaleGDP(+data.gdp);

			svg.append("circle")
			.attr("r", gdp)
			.attr("cx",cx)
			.attr("cy",cy)
			.style("fill", br);
		});
	});
}