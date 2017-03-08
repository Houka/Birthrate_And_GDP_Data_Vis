// Data filtering and conversion script

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
				continentcode: countryObj[0],
				countrycode: countryObj[1]
			};
			result = result.concat([combinedObj]);
		}else if (debug){
			console.debug("invalid country name: "+ countryName);
		}
	}
	return result;
}


/* Returns the data set but converted to a nested specification
*/
function convertData(data){
	var convertedData = d3.nest()
		.key(function(d) {
			return d.country; 
		})
		.entries(data);
	return convertedData;
}


/* Returns the data set but converted to a double nested specification
*/
function convertDataNested(data){
	var convertedData = d3.nest()
		.key(function(d) {
			return d.continentcode; 
		})
		.key(function(d){
			return d.country;
		})
		.entries(data);
		
	var result = [];
	convertedData.forEach(function(d){
		var nestedValues = [];
		d.values.forEach(function(dd){
			var temp = dd.values[0];
			
			var nestedObj = {
				name:temp.country,
				children:[{
					name: temp.countrycode,
					size: temp.gdp,
					region: temp.continentcode,
					birthrate: temp.birthrate,
				}]
			};

			nestedValues = nestedValues.concat([nestedObj]);
		})

		var obj = {
			name: d.key,
			children: nestedValues
		};

		result = result.concat([obj]);
	});

	return result;
}


/* Returns the number of times an empty string is found in the array
*/
function countEmptyStrings(array){
	var c = 0;
	array.forEach(function(d){
		if (!d)
			c++;
	})
	return c;
}


/* Returns a filtered array of data objects based off data
	A data object will be filtered out if it crosses the threshold of not containing 
	enough information (i.e. birthrate or gdp) in all the catagories
*/
function filterDataByThreshold(data, threshold){
	var result = [];
	var d = true;
	for(var i = 0; i<data.length; i++){
		var valueObj = data[i].values[0];
		var values = Object.values(valueObj);
		values = values.slice(0,-6);

		if (countEmptyStrings(values) <= threshold)
			result = result.concat([data[i]]);
	}
	return result
}


/* Returns a filtered array of data objects based off data
	A data object will be filtered out if at that year, it does not have data
*/
function filterDataByYear(data, year){
	var result = [];
	var d = true;
	for(var i = 0; i<data.length; i++){
		var valueObj = data[i].values[0];

		if (valueObj[year])
			result = result.concat([data[i]]);
	}
	return result
}


/* Returns both data sets, but capped such that only 
	countries that are in both dataset will be in the final
	datasets
*/
function filterDatasets(data1, data2){
	var result1 = [];
	var result2 = [];

	var largerDataset = data1.length > data2.length? data1:data2;
	var smallerDataset = data1.length > data2.length? data2:data1;

	for (var i=0; i < largerDataset.length; i++){
		for (var j=0; j < smallerDataset.length; j++){
			if (largerDataset[i].key == smallerDataset[j].key){
				result1 = result1.concat([largerDataset[i]]);
				result2 = result2.concat([smallerDataset[j]]);
			}
		}
	}

	return [result1, result2]
}