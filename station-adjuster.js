// The purpose of script is to adjust geo positions for rail stations
// that overlap on the map. Adjustment is done by rearranging overlapping
// stations in a circle at regular angles.

const fs = require('fs');

var stations_geojson = JSON.parse(fs.readFileSync('metro-station-static-data.geojson', 'utf8'));

var equals = findEquals(stations_geojson.features)
adjustInPlace(stations_geojson.features, equals)
var json = JSON.stringify(stations_geojson);
fs.writeFile('metro-station-static-data-adjusted.geojson', json, 'utf8');


function adjustInPlace(features, equals) {
    for (var key in equals) {
        var newPoints = generatePoints(
            {
                x: features[key].geometry.coordinates[0], 
                y: features[key].geometry.coordinates[1] 
            },
            equals[key].length,
            0.001
        )
        for (var i=0; i<equals[key].length; i++) {
            features[equals[key][i]].geometry.coordinates[0] = newPoints[i].x
            features[equals[key][i]].geometry.coordinates[1] = newPoints[i].y
        }
    }
}

function findEquals(features) {
    var equals = {}

    for (var i=0; i<features.length; i++) {
        for (var j=i+1; j<features.length; j++) {
            if (geoEquals(features[i], features[j])) {
                features[j].geometry.coordinates = [0,0]
                if ( equals[i] == undefined ) {
                    equals[i] = [i]
                }
                equals[i].push(j)
            }
        }
    }

    return equals
}

function geoEquals( geo1, geo2 ) {
    return (
        geo1.geometry.coordinates[0] != 0 &&
        geo1.geometry.coordinates[0] == geo2.geometry.coordinates[0] &&
        geo1.geometry.coordinates[1] == geo2.geometry.coordinates[1]
    )
}

function generatePoints( center, num, offset ) {
    var points_moved = []
    for (var i=0; i<num; i++) {
        points_moved.push(
            cart_add(
                polar2cart({r: offset, a: Math.PI * 2 / num * i}),
                center
            )
        )
    }
    return points_moved
}

function cart_add(pointa, pointb) {
    return {
        x: pointa.x + pointb.x,
        y: pointa.y + pointb.y
    }
}

function polar2cart( point ) {
    return {
        x: point.r * Math.cos(point.a),
        y: point.r * Math.sin(point.a)
    }
}

function parseGeoJSON(stations_geojson) {
    return 0
}

function identifyOverlapping(stations) {
    return 0
}
