import csv

def findLenOfCsv(csvfile):
	length = 0
	for row in csvfile:
		length+=1
	return length

def writeCsv(name, fields, datalist):
	with open(name,'w') as csvfile:
		writer = csv.DictWriter(csvfile, fieldnames=fields)
		writer.writeheader()
		# row is a dict, datalist is a list of dicts
		for row in datalist:
			writer.writerow(row)

def loadCsv(filename, fields):
	''' Returns list of dicts that map from header field to value
	'''
	with open(filename) as csvfile:
		reader = csv.DictReader(csvfile, fieldnames=fields)
		result = []
		for row in reader:
			result.append(row)
		return result

# note: the list at index 0 is just the headers
# note: has 265 elements both
fields = ["Country Name","Country Code","Indicator Name","Indicator Code","1960","1961","1962","1963","1964","1965","1966","1967","1968","1969","1970","1971","1972","1973","1974","1975","1976","1977","1978","1979","1980","1981","1982","1983","1984","1985","1986","1987","1988","1989","1990","1991","1992","1993","1994","1995","1996","1997","1998","1999","2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016"]
birthRateCsv 	= loadCsv("BirthRate.csv", fields)
GDPCsv 			= loadCsv("GDPPerCap.csv", fields)

# remove empty data rows
def filterData(data, threshold):
	result = []
	for d in data:
		tempList = [k for k in d.values()]
		if tempList.count('') <= threshold:
			result.append(d)
	return result

newBirthRate = filterData(birthRateCsv, 10)
newGDP = filterData(GDPCsv, 10)

print(len(newBirthRate))
print(len(newGDP))

# filter both to be same length
finalBirthRate =[]
finalGDP = []
for i in range(len(newBirthRate)):
	for j in range(len(newGDP)):
		if (newBirthRate[i]['Country Name'] == newGDP[j]['Country Name']):
			finalBirthRate.append(newBirthRate[i])
			finalGDP.append(newGDP[j])

print(len(finalBirthRate))
print(len(finalGDP))

writeCsv('FilteredBirthRate.csv', fields+[None], finalBirthRate)
writeCsv('FilteredGDPPerCap.csv', fields+[None], finalGDP)