const cityInput=document.querySelector(".city-input");
const searchButton=document.querySelector(".search-btn");
const currentWeatherDiv=document.querySelector(".current-weather")
const weatherCardsdiv=document.querySelector(".weather-card");
const locationButton=document.querySelector(".location-btn");

const API_KEY="0894c3eee6e178e7650da2cb5a9098e0";
const createWeatherCard=(cityName,weatherItem,index)=>{
    if(index === 0){

        return ` <div class="details">
                <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>
            </div>
            <div class="icon">
                <img src="http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather icon">
                <h4>${weatherItem.weather[0].description}</h4>
            </div>`

    }else{

        return `  <li class="card">
        <h2>(${weatherItem.dt_txt.split(" ")[0]})</h2>
        
        <img src="http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather icon">
        <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
        <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
    </li>`;

    }
   
}



const getWeatherDetails=(cityName, lat, lon)=>{
    const WEATHER_API_URL=`http://api.openweathermap.org/data/2.5/forecast?lat=${ lat}&lon=${ lon}&appid=${API_KEY}`;
    fetch(WEATHER_API_URL).then(res=>res.json()).then(data=>{
        const uniqueForcastDays =[];
        const fiveDaysForeCast=data.list.filter(lion=>{
            const forecastDate= new Date(lion.dt_txt).getDate();
            if(!uniqueForcastDays.includes(forecastDate)){
                return uniqueForcastDays.push(forecastDate);
            }
        });
       
        cityInput.value="";
        weatherCardsdiv.innerHTML="";
        currentWeatherDiv.innerHTML="";

        fiveDaysForeCast.forEach((weatherItem, index) => {
            if(index=== 0){
                currentWeatherDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName,weatherItem,index));
           
            } else{
            weatherCardsdiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName,weatherItem,index));
           
            }
        });
       
    }).catch(()=>{
        alert("An error occured while fetching weather forecast");
    })
}



const getCityCoordinates=()=>{
    const cityName=cityInput.value.trim();
    if(!cityName) return;
    const GEOCODING_API_URL=`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    fetch(GEOCODING_API_URL).then(res=>res.json()).then(data=>{
        if(!data.length) return alert(`No coordinate find for ${cityName}`);
        
        const{name, lat, lon } =data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(()=>{
        alert("An error has been occured");
    })
}

getUserCoordinats=()=>{
    navigator.geolocation.getCurrentPosition(
        position=>{
            const { latitude, longitude} = position.coords;
            const REVERSE_GEOCODING_URL=`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(REVERSE_GEOCODING_URL).then(res=>res.json()).then(data=>{
                const{name } =data[0];
                getWeatherDetails(name, latitude, longitude);
               
            }).catch(()=>{
                alert("An error has been occured while fetching the city");
            })

        },
        error=>{
            console.log(error);
        }
    )
}



locationButton.addEventListener("click",getUserCoordinats);

searchButton.addEventListener("click",getCityCoordinates);







