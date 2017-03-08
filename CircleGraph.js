// js for the circle graphs
//
// - gdp per cap would be size of circles, sqrt scale
// - birth rate would be color, 7-10 discrete colors
// - big circles to contain continents for organization purposes

var SCALE_CIRCLES = 1.2;

var birthRateColors =['#f7bba6','#ed8495','#e05286','#a73b8f','#6f2597','#511b75','#37114e'];
var continentLocations = {
	NA:{x:screenWidth*.2, y:screenHeight*.4}, 
	SA:{x:screenWidth*.2, y:screenHeight*.7}, 
	EU:{x:screenWidth*.55, y:screenHeight*.35}, 
	AF:{x:screenWidth*.5, y:screenHeight*.8},
	AS:{x:screenWidth*.81, y:screenHeight*.3}, 
	OC:{x:screenWidth*.8, y:screenHeight*.75}, 
	AN:{x:800, y:100}
};	// uses svg absolute coordinates (i.e. (0,0) is top left corner)

/* Returns how much counrty circles should be translated based on the continent.
	translates all circles within the continent circle by the same amount
*/
function transformCountries(d) {
	var continent = d.parent.parent;
	if (!continent) return "translate(" + d.x + "," + d.y + ")"; 

	var continenttName = continent.data.name;
	var x = (d.x+continentLocations[continenttName].x - continent.x),
		y = (d.y+continentLocations[continenttName].y - continent.y);
	return "translate(" + x + "," + y + ")";
}

/* Returns how much a continent circle should be translated based on the continent.
*/
function transformContinent(d) {
	var continenttName = d.data.name;
	var x = (continentLocations[continenttName].x),
		y = (continentLocations[continenttName].y);
	return "translate(" + x + "," + y + ")";
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
	var scaleBirthRate = d3.scaleThreshold()
		.domain(d3.range(birthRateColors.length-1).map(function(i){ 
			var diff = birthRateExtent[1] - birthRateExtent[0];
			var scale = diff/(birthRateColors.length-1);
			return scale*i + birthRateExtent[0]; 
		}))
		.range(birthRateColors);

	// add svg elements
	var svg = mainDiv.append("svg")
		.attr("height", "100%")
		.attr("width", "100%");
	var g = svg.append("g");

	var format = d3.format(",d");
	var pack = d3.pack().size([screenWidth*SCALE_CIRCLES, screenHeight*SCALE_CIRCLES]).padding(0.5);

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
	.attr("transform", transformCountries);

	// add surrounding circles for continent
	continent.children.forEach(function(continent) {
		g.append("g").append("circle")
		.attr("r", continent.r)
		.style("stroke", "#ccc")
		.style("fill", "none")
		.attr("transform", "scale("+ 0.5 + ")")
		.attr("transform", transformContinent(continent));
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
	node.append("text").attr("class", "labels")
	.attr("text-anchor", "middle")
	.attr("alignment-baseline", "middle")
	.attr("fill", "black")
	.text(function(d) { 
		return d.data.name; 
	});

	displayLegend(scaleBirthRate);

}

function displayLegend(scaleBirthRate){
	d3.select("svg").append("g")
		.attr("class", "legendOrdinal")
		.attr("transform", " scale("+1/widthScale+", "+1/widthScale+"), "+
				"translate("+screenWidth*.005+", "+screenHeight*.05+")");

	var legendOrdinal = d3.legendColor()
		.title("Birth Rates (Births Per Woman)")
		.shapeWidth(30)
    	.labels(d3.legendHelpers.thresholdLabels)
    	.labelFormat(d3.format(".2f"))
		.orient("vertical")
		.scale(scaleBirthRate);

	d3.select(".legendOrdinal")
		.call(legendOrdinal);

}








