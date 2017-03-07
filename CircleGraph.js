// js for the circle graphs
//
// - gdp per cap would be size of circles, sqrt scale
// - birth rate would be color, 7-10 discrete colors
// - big circles to contain continents for organization purposes


var birthRateColors =['#f7bba6','#ed8495','#e05286','#a73b8f','#6f2597','#511b75','#37114e'];
var continentLocations = {
	AF:{x:200, y:200},
	AS:{x:500, y:100}, 
	EU:{x:200, y:-200}, 
	NA:{x:-400, y:100}, 
	SA:{x:-500, y:100}, 
	OC:{x:300, y:300}, 
	AN:{x:-100, y:-100}
};

/* Returns how much counrty circles should be translated based on the continent.
	translates all circles within the continent circle by the same amount
*/
function translateCountries(d) {
	if (!d.parent.parent) return "translate(" + d.x + "," + d.y + ")"; 

	var countinentName = d.parent.parent.data.name;
	return "translate(" + (d.x+continentLocations[countinentName].x) + 
				"," + (d.y+continentLocations[countinentName].y) + ")";
}

/* Returns how much a continent circle should be translated based on the continent.
*/
function translateContinent(d) {
	var countinentName = d.data.name;
	return "translate(" + (d.x+continentLocations[countinentName].x) + 
				"," + (d.y+continentLocations[countinentName].y) + ")";
}

function displayCombinedData(combinedData, nestedCombinedData){
	// break up data and change data values from number strings to number numbers
	var birthRateExtent = d3.extent(combinedData, function(d) {	
		var data = d.values[0];
		return +data.birthrate; 
	});
	var GDPExtent = d3.extent(combinedData, function(d) { 
		var data = d.values[0];
		return +data.gdp; 
	});

	// scaling functions
	var scaleBirthRate = d3.scaleOrdinal()
		.domain(birthRateExtent)
		.range(birthRateColors);
	var scaleGDP = d3.scaleSqrt()
		.domain(GDPExtent)
		.range([5,100]);

	// add svg elements
	var svg = mainDiv.append("svg")
		.attr("height", "100%")
		.attr("width", "100%");
	var g = svg.append("g");

	var format = d3.format(",d");
	var pack = d3.pack().size([screenWidth, screenHeight]).padding(0.5);

	// wrap data in useable format for circle packing
	var continent = {
		name: "World",
		children: nestedCombinedData
	};

	continent = d3.hierarchy(continent)
	.sum(function(d) {
		return d.size;
	});

	pack(continent);

	var node = g.selectAll(".node")
	.data(continent.leaves())
	.enter().append("g")
	.attr("transform", translateCountries);

	// add surrounding circles for continent
	continent.children.forEach(function(continent) {
		g.append("g").append("circle")
		.attr("r", continent.r)
		.style("stroke", "#ccc")
		.style("fill", "none")
		.attr("transform", translateContinent(continent));
	});

	// add country circles filled with color based on birthrate and radius based on gdp
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

	// add the names of each country on their repective circles
	node.append("text") 
	.attr("text-anchor", "middle")
	.attr("alignment-baseline", "middle")
	.attr("fill", "black")
	.text(function(d) { 
		return d.data.name; 
	});

	// display legend
	displayLegend(birthRateExtent);
}

function displayLegend(birthRateExtent){
	var legendSize = d3.scaleOrdinal()
		.domain(birthRateExtent)
		.range(birthRateColors);

	d3.select("svg").append("g")
		.attr("class", "legendOrdinal")
		.attr("transform", "translate(50, 30)");

	var legendOrdinal = d3.legendColor()
		.title("Legend")
		.shapeWidth(30)
		.orient("vertical")
		.scale(legendSize);

	d3.select("svg").select(".legendOrdinal")
		.call(legendOrdinal);

}








