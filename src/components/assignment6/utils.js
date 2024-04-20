function groupByAirline(data) {
    let result = data.reduce((result, d) => {
        let currentData = result[d.AirlineID] || {
            "AirlineID": d.AirlineID,
            "AirlineName": d.AirlineName,
            "Count": 0
        };
        currentData.Count += 1;
        result[d.AirlineID] = currentData;
        return result;
    }, {});

    result = Object.keys(result).map(key => result[key]);
    return result.sort((a, b) => b.Count - a.Count);
}

function groupByAirport(data) {
    let result = data.reduce((result, d) => {
        let currentDest = result[d.DestAirportID] || {
            "AirportID": d.DestAirportID,
            "Airport": d.DestAirport,
            "Latitude": +d.DestLatitude,
            "Longitude": +d.DestLongitude,
            "City": d.DestCity,
            "Country": d.DestCountry,
            "Count": 0
        };
        currentDest.Count += 1;
        result[d.DestAirportID] = currentDest;

        let currentSource = result[d.SourceAirportID] || {
            "AirportID": d.SourceAirportID,
            "Airport": d.SourceAirport,
            "Latitude": +d.SourceLatitude,
            "Longitude": +d.SourceLongitude,
            "City": d.SourceCity,
            "Country": d.SourceCountry,
            "Count": 0
        };
        currentSource.Count += 1;
        result[d.SourceAirportID] = currentSource;
        return result;
    }, {});

    return Object.keys(result).map(key => result[key]);
}

function groupByCity(data) {
    let result = data.reduce((result, d) => {
        result[d.DestCity] = result[d.DestCity] || {
            "City": d.DestCity,
            "Count": 0
        };
        result[d.DestCity].Count += 1;

        result[d.SourceCity] = result[d.SourceCity] || {
            "City": d.SourceCity,
            "Count": 0
        };
        result[d.SourceCity].Count += 1;
        return result;
    }, {});

    return Object.values(result);
}

export {
    groupByAirline, groupByAirport, groupByCity
}
