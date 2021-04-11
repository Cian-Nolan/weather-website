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

function getCurrentWeather(coord, callback){
    const weatherApi_key = loadJSONfromFile().weatherApi_key
    let weatherApi_query = coord
    const weatherApi_url = 'http://api.weatherstack.com/current?access_key=' + weatherApi_key + '&query='+ weatherApi_query

    request({url:weatherApi_url, json: true}, (error,response,body) => {
        console.log(chalk.yellow.inverse(weatherApi_url))

        if(error){
            //console.log('unable to connect to the weather API')
            callback('unable to connect to the weather API', undefined)
        }else if (body.success === false){
            //console.log('bad request sent to weather API')
            callback('bad request sent to weather API', undefined)
        }else{
            
            callback(undefined, {
                region: body.location.region,
                country: body.location.country,
                description: body.current.weather_descriptions[0],
                temperature: body.current.temperature,
                precipitation: body.current.precip,
                error:error
            })
        }
    });
}

module.exports = {
    getCurrentWeather: getCurrentWeather,
}
