/* Returns true if the countryName is a valid country name false otherwise
*/ 
function isValidCountryName(countryName, countryData){
	if(countryData[countryName] == null)
		return false;
	return true;
}

/* Returns Combination of all 3 data structures into one array of country object.
	A country object for example may be:
	{
		country: Barbados,
		birthrate: 12341,
		gdp: 412413,
		continent: NA,
		iso2: BB,
	}
*/
function combineData(year,birthData,GDPData,countryData){
	var result = [];
	for(var i = 0; i<birthData.length; i++){
		var birthObj = birthData[i].values[0];
		var GDPObj = GDPData[i].values[0];
		var countryName = birthObj.country;

		if (isValidCountryName(countryName, countryData)){
			var birthYear = birthObj[year];
			var GDPYear = GDPObj[year];
			var countryObj =  countryData[countryName];

			var combinedObj = {
				country: countryName,
				birthrate: birthYear,
				gdp: GDPYear,
				continent: countryObj[0],
				countrycode: countryObj[1]
			};
			result = result.concat([combinedObj]);
		}else if (debug){
			console.debug("invalid country name: "+ countryName);
		}
	}

	var convertedData = d3.nest()
		.key(function(d) {
			return d.continent; 
		})
		.key(function(d){
			return d.country;
		})
		.entries(result);
	return convertedData;
}

/* Returns a filtered array of data objects based off data
	A data object will be filtered out if it crosses the threshold of not containing 
	enough information (i.e. birthrate or gdp) in all the catagories
*/
function filterData(data, threshold){
	var result = [];
	for(var i = 0; i<data.length; i++){
		var value = data[i].values[0];
	}
}