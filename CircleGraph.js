// Circle graphs display script

// Global Variables
var SCALE_CIRCLES = 1.2;
var birthRateColors =['#f7bba6','#ed8495','#e05286','#a73b8f','#6f2597','#511b75','#37114e'].reverse();
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


/* Returns d3 scaling function of the birth rate with a domain based of 
	the birth rate numbers and the range being the color bins 
*/
function getBirthRateScale(combinedData){
	var birthRateExtent = d3.extent(combinedData, function(d) {	
		var data = d.values[0];
		return +data.birthrate; 
	});

	return d3.scaleThreshold()
		.domain(d3.range(birthRateColors.length-1).map(function(i){ 
			var diff = birthRateExtent[1] - birthRateExtent[0];
			var scale = diff/(birthRateColors.length-1);
			return scale*i + birthRateExtent[0]; 
		}))
		.range(birthRateColors);
}


/* Creates and draws all the circles countries and continents
*/
function displayCombinedData(combinedData, nestedCombinedData){
	//update continent locations on a refresh
	continentLocations = {
		NA:{x:screenWidth*.2, y:screenHeight*.4}, 
		SA:{x:screenWidth*.2, y:screenHeight*.7}, 
		EU:{x:screenWidth*.55, y:screenHeight*.35}, 
		AF:{x:screenWidth*.5, y:screenHeight*.8},
		AS:{x:screenWidth*.81, y:screenHeight*.3}, 
		OC:{x:screenWidth*.8, y:screenHeight*.75}, 
		AN:{x:800, y:100}
	};	// uses svg absolute coordinates (i.e. (0,0) is top left corner)
	
	// scaling function
	var scaleBirthRate = getBirthRateScale(combinedData);

	// get svg elements
	var svg = mainDiv.append("svg")
		.attr("height", "100%")
		.attr("width", "100%");
	var g = svg.append("g")
			.attr("class", "world");
	var pack = d3.pack().size([screenWidth*SCALE_CIRCLES, screenHeight*SCALE_CIRCLES]).padding(0.5);

	// wrap data in useable format for circle packing
	var continent = {
		name: "World",
		children: nestedCombinedData
	};

	// create hierarchy for circle packing
	continent = d3.hierarchy(continent)
		.sum(function(d) {
			return d.size;
		});
	pack(continent);

	// create groups for each country and translate them to map positions
	var node = g.selectAll(".node")
		.data(continent.leaves())
		.enter().append("g")
		.attr("transform", transformCountries);

	// add surrounding circles for continent
	continent.children.forEach(function(c) {
		// add the continent encompassing circle
		g.append("g").append("circle")
		.attr("r", c.r)
		.style("stroke", "#aaa")
		.style("fill", "none")
		.attr("transform", transformContinent(c));

		// add the continent label background circle
		g.append("g").append("circle")
		.attr("r", 10)
		.style("fill", "#111")
		.style("stroke", "#aaa")
		.attr("transform", transformContinent(c) + "translate(" + c.r/Math.sqrt(2) + "," + c.r/Math.sqrt(2) + ")");

		// add the continent label text
		g.append("g").append("text")
		.text(c.data.name)
		.style("alignment-baseline", "middle")
		.style("text-anchor", "middle")
		.style("fill", "#ccc")
		.style("font-size", "8px")
		.attr("transform", transformContinent(c) + "translate(" + c.r/Math.sqrt(2) + "," + c.r/Math.sqrt(2) + ")");
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
	.text(function(d) { 
		return d.data.name; 
	});
}


/* Creates and draws the color legend based on the coloring and birthrates
*/
function displayLegend(combinedData){
	// scale functions
	var scaleBirthRate = getBirthRateScale(combinedData);
	var GDPExtent = d3.extent(combinedData, function(d) { 
 		var data = d.values[0];
 		return +(+data.gdp).toFixed(2); 
 	});
 	var scaleGDP = d3.scaleOrdinal()
		.domain(GDPExtent)
		.range(GDPExtent);

	// legends
	var birthrateLegendOrdinal = d3.legendColor()
		.title("Birth Rates (Births Per Woman)")
		.shapeWidth(30)
    	.labels(d3.legendHelpers.thresholdLabels)
    	.labelFormat(d3.format(".2f"))
		.orient("vertical")
		.scale(scaleBirthRate);
	var GDPLegendOrdinal = d3.legendColor()
		.title("GDP per capita (USD)")
		.shapeWidth(10)
    	.labels(["Largest radius = $"+GDPExtent[0],"Smallest radius = $"+GDPExtent[1]])
    	.labelFormat(d3.format(".2f"))
		.orient("vertical")
		.scale(scaleGDP);

	// add and draw legend
	// GDP per capita = radius (USD)
	var svg = d3.select("svg");
	svg.append("g")
		.attr("class", "birthrateLegendOrdinal")
		.attr("transform", " scale("+1/widthScale+", "+1/widthScale+"), "+
				"translate("+screenWidth*.005+", "+screenHeight*.05+")");
	var brLegend = d3.select(".birthrateLegendOrdinal")
		.call(birthrateLegendOrdinal);

	svg.append("g")
		.attr("class", "GDPLegendOrdinal")
		.attr("transform", " scale("+1/widthScale+", "+1/widthScale+"), "+
				"translate("+(brLegend.node().getBBox().width+20)+", "+screenHeight*.05+")");
	d3.select(".GDPLegendOrdinal")
		.call(GDPLegendOrdinal);
}








