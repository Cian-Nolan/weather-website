//REQUIRE
const path = require('path')

const express = require('express')
const hbs = require('hbs')
const chalk = require('chalk')
const { response } = require('express')

const geocode_API = require('../utils/geocode')
const weather_API = require('../utils/weather')

//EXPRESS SETUP{}
//Start express
const app = express()

// define paths
const public_dir = path.join(__dirname, '../public')
app.set('views', path.join(__dirname, '../templates/views'))
hbs.registerPartials(path.join(__dirname, '../templates/partials'))

//set up static directory to serve
app.use(express.static(public_dir))

//set up handlebars as view engine
app.set('view engine','hbs')

app.listen(3000, () =>{
    console.log('server up on port 3000')
})


//ROUTE HANDLERS
//serve pages
app.get('', (req, res) => {
    res.render('index', {
        title: "What's the weather?",
        name: 'Weather Page',
        footer_text: 'Created by Cian'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Page',
        footer_text: 'Created by Cian'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page',
        footer_text: 'Created by Cian'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        res.send({
            error:'Please type a location into the Search Bar'
        })
        return
    }

    // Check if user input is valid
    var regex = /^[a-zA-Z0-9\s\,\-]*$/i
    if(!regex.test(req.query.address)){
        console.log('Regex failed - invalid address provided')
        return
    }
    
    //get coordinates of location for use in weather API call
    geocode_API.getCoordinates(req.query.address, (error,data1) => {

        if(error) {    
            res.send({
                error:error
            })
            return
        }

        // once geocode API call is successful, pass result as argument to weather API call
        weather_API.getCurrentWeather(data1.lat + ',' + data1.long, (error,data2) => {

            if(error){    
                console.log('weather error:' + error )
                res.send({
                    error:error
                })
                return
            }

            console.log(data1)

            const paragraph = 'The weather summary for '+ data1.name + ', ' + data2.country + ' is: ' + data2.description + '. It is currently ' + data2.temperature + ' degrees celcius. There is a ' + data2.precipitation + '% chance of rain';
            console.log(chalk.green(paragraph))

            res.send({
                address_provided: req.query.address,
                location_searched: data1.name,
                forecast: paragraph
            })
        })
    })
})

app.get('*', (req, res) => {
    res.render('errorPage', {
        title: 'Page Not Found',
        error: '404 Error',
        footer_text: 'Created by Cian'
    })
})

