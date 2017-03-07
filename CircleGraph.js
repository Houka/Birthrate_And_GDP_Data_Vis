// js for the circle graphs
//
// - gdp per cap would be size of circles, sqrt scale
// - birth rate would be color, 7-10 discrete colors
// - big circles to contain continents for organization purposes


var birthRateColors =['#f7bba6','#ed8495','#e05286','#a73b8f','#6f2597','#511b75','#37114e'];

function displayCombinedData(combinedData, nestedCombinedData){
	nestedCombinedData = {
		name: "World",
		children: nestedCombinedData
	};
	// Code in here
	var svg = mainDiv.append("svg")
	.attr("height", "100%")
	.attr("width", "100%");

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
	var pack = d3.pack().size([screenWidth, screenHeight]).padding(0.5);

	var continent = nestedCombinedData;

	continent = d3.hierarchy(continent)
	.sum(function(d) {
		return d.size;
	});

	pack(continent);

	var node = g.selectAll(".node")
	.data(continent.leaves())
	.enter().append("g")
	.attr("transform", function(d) {
		// make this into a function, switch case on continent code
		// translates all circles within the continent circle by the same amount
		if ((d.parent.parent) && d.parent.parent.data.name == "AF") {
			return "translate(" + (d.x + 300) + "," + d.y + ")"; 
		}
		else
			return "translate(" + d.x + "," + d.y + ")"; 
	});

	// add circles for continent
	continent.children.forEach(function(continent) {
		var continentG = g.append("g");

		continentG.append("circle")
		.attr("r", continent.r)
		.style("stroke", "#ccc")
		.style("fill", "none");

		// same concept as translating colored circles
		if (continent.data.name == "AF") {
			continentG.attr("transform", "translate(" + (continent.x + 300) + "," + continent.y + ")")
		}
	});

	node.append("circle")
	.attr("r", function(d) {return d.r;})
	.style("fill", function(d) {
		if (d.data.birthrate){
			return scaleBirthRate(+d.data.birthrate);
		}
		else {
			return "white";
		}
	});

	node.append("text") 
	.attr("text-anchor", "middle")
	.attr("alignment-baseline", "middle")
	.attr("fill", "black")
	.text(function(d) { 
		return d.data.name; 
	});

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








