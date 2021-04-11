const request = require('postman-request')
const chalk = require('chalk')
const fs = require('fs')

const loadJSONfromFile = () => {
    try{
        const dataBuffer = fs.readFileSync(__dirname + '/keys.json')
        const data_String = dataBuffer.toString() 
        const data_JSON = JSON.parse(data_String)
        //console.log('keys read successfully')
        return data_JSON
    }catch(e){
        //console.log('error in reading keys from file')
        return ''
    }
}

function getCoordinates(address, callback){
    const mapApi_key = loadJSONfromFile().mapApi_key
    let mapApi_query = encodeURIComponent(address) // IMPORTANT
    const mapApi_url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + mapApi_query + '.json?limit=1&access_token=' + mapApi_key

    request({url:mapApi_url, json: true}, (error,response,body) => {
        console.log(chalk.yellow.inverse(mapApi_url))

        if(error){
            //console.log('unable to connect to the maps API')
            callback('unable to connect to the maps API',undefined)
        }else if (body.features.length == 0){
            //console.log('bad request sent to maps API' + coord)
            callback('Cannot find result for ' + "'" + address + "'" , undefined)

        }else{
            callback(undefined, { 
                lat:  body.features[0].center[1], 
                long: body.features[0].center[0],
                name: body.features[0].place_name,
                query: body.query[0]
            })
        }
    })
}

module.exports = {
    getCoordinates: getCoordinates,
}



