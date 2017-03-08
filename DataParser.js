// Data accessing and parsing script

/* Loads and parses the data files and then supplies the callback with the data in a easy to use form*/
function loadData(callback){
	d3.csv("BirthRate.csv", parseBirth, function(error, data){
		var nestedBirthData = d3.nest()
		.key(function(d) {
			return d.country; 
		})
		.sortKeys(d3.ascending)
		.entries(data);

		d3.csv("GDPPerCap.csv", parseGDP, function(error, data){
			var nestedGDPData = d3.nest()
			.key(function(d) {
				return d.country; 
			})
			.sortKeys(d3.ascending)
			.entries(data);

			d3.json("CountryData.json", function(error, data) {
				callback(nestedBirthData, nestedGDPData, data);
			});
		});
	});
};


/* Helper function for parsing the csv files into useable objects
*/
function parseBirth (line) {
	line.country = line['Country Name'];
	return line;
}


/* Helper function for parsing the csv files into useable objects
*/
function parseGDP (line) {
	line.country = line['Country Name'];
	return line;
}
