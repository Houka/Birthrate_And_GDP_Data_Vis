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
	nestedCombinedData = {
		name: "World",
		children: nestedCombinedData
	};
	// Code in here
	var svg = mainDiv.append("svg")
	.attr("height", "100%")
	.attr("width", "100%");

	var birthRateColors = ['#b2182b','#ef8a62','#fddbc7','#f7f7f7','#d1e5f0','#67a9cf','#2166ac'];

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

	var g = svg.append("g");
	var format = d3.format(",d");
	var pack = d3.pack().size([screenWidth, screenHeight]);

	var continent = nestedCombinedData;
	// if (continent.name == "AF") { 
		g = g.attr("transform", "translate(2,2)"); // or whatever
		continent = d3.hierarchy(continent)
		.sum(function(d) {
			return d.size;
		});

		pack(continent);

		var node = g.selectAll(".node")
		// .data(continent.descendants())
		.filter(function(d) { d.data.region == "AF" })
		.data(continent.leaves())
		.enter().append("g")
		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

			/*var br = scaleBirthRate(+d.data.birthrate);
			var gdp = scaleGDP(+d.data.size);*/

		node.append("circle")
			.attr("r", function(d) {return d.r;})
			.style("fill", function(d) { return scaleBirthRate(+d.data.birthrate); });

		node.append("title") 
		.attr("text-anchor", "middle")
		.attr("fill", "black")
		.text(function(d) { 
			return d.data.name + "\n" + format(d.value); });


		var node = g.selectAll(".node")
		// .data(continent.descendants())
		.filter(function(d) { d.data.region == "EU" })
		.data(continent.leaves())
		.enter().append("g")
		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

			/*var br = scaleBirthRate(+d.data.birthrate);
			var gdp = scaleGDP(+d.data.size);*/

		node.append("circle")
			.attr("r", function(d) {return d.r;})
			.style("fill", function(d) { return scaleBirthRate(+d.data.birthrate); });

		node.append("title") 
		.attr("text-anchor", "middle")
		.attr("fill", "black")
		.text(function(d) { 
			return d.data.name + "\n" + format(d.value); });

	var legendSize = d3.scaleOrdinal()
	.domain(birthRateExtent)
	.range(birthRateColors);

	svg.append("g")
	.attr("class", "legendOrdinal")
	.attr("transform", "translate(50, 30)");

	var legendOrdinal = d3.legendColor()
	.title("Legend")
	.shapeWidth(30)
	.orient("vertical")
	.scale(legendSize);

	svg.select(".legendOrdinal")
	.call(legendOrdinal);

}








