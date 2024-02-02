const express = require('express')
const app = express()

const dotenv = require('dotenv');
dotenv.config();

// Import the Axios library for making HTTP requests.
const axios = require('axios');

// Create an Axios client for Unsplash API with default settings.
const unsplashClient = axios.create({
    // Set the base URL for all requests to the Unsplash API.
    baseURL: 'https://api.unsplash.com',
    // Set the headers for all requests, including the Authorization header
    // with the access token from environment variables.
    headers:{
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
    }
}); 

// Define an asynchronous function to get a random picture from Unsplash.
async function getRandomPicture(city){
    try{
        // Make a GET request to the '/photos/random' endpoint of Unsplash API.
        // Await the response and store it in 'response'.
        const response = await unsplashClient.get(`/photos/random/?query=beautiful images of ${city}`);
        // Return the data part of the response which contains the picture details.
        
        return response.data;      

    }catch(error){
        // If an error occurs during the request, log the error response.
        console.error(error.response);
    }
}



const PORT = 3000
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))
app.set('view engine', 'ejs')


const apiKey = process.env.OPEN_WEATHER_API_KEY
const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&"



 async function checkWeather(city){
    const response = await fetch(apiURL + "appid=" + apiKey + `&q=${city}`);
    let data =  await response.json() 
    if ('rain' in data){
      if (data.rain['3h'] !== undefined ){
        data.rain = 'Not Measured'
      }
    }else{
      data.rain = 'Not Measured'
    }
   return data;
  }
    
  
  
  const getHomePage = async (req, res )=> {
    let data = await checkWeather('Astana')
    const city_json_data = await getRandomPicture('Astana')
    
    console.log(data)
    console.log(city_json_data.urls)
    res.render('index', {data: data, MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN, image: city_json_data })
    
  }

  const showCityWeather =  async (req,res)=>{
    let data = await checkWeather(req.body.city)
    const city_json_data = await getRandomPicture(req.body.city)
    console.log(data)
    console.log(city_json_data.urls)
    res.render('index', {data: data, MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN, image: city_json_data})
  } 
  
app.get('/', getHomePage);
app.post('/CityWeather', showCityWeather)




app.listen(PORT, () => {
     console.log(`Server is listenning on port ${PORT}`)
});



