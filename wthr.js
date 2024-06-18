//Functionality of search on mobile
const searchBtn =document.querySelector("#srchIcn");
const currentWeather =document.querySelector("#current_weather_container");
const currentLocation =document.querySelector("#location_container");
const forecast =document.querySelector("#forecast_container");
const cancelBtn =document.querySelector("#cancelIcn");
searchBtn.addEventListener("click",function(){
    currentWeather.style.display="none";
    currentLocation.style.display="block"
    forecast.style.display="none";
})
cancelBtn.addEventListener("click",function(){
    currentWeather.style.display="block";
    currentLocation.style.display="none"
    forecast.style.display="block";
})
//
const months=['January','February','March','April','May','June','July','August','September','October','November','December']
const weatherIcons={
    "01d":"https://cdn-icons-png.flaticon.com/128/5825/5825968.png",
    "01n":"https://cdn-icons-png.flaticon.com/128/5826/5826012.png",
    "02d":"https://cdn-icons-png.flaticon.com/128/5828/5828380.png",
    "02n":"https://cdn-icons-png.flaticon.com/128/2136/2136795.png",
    "03d":"https://cdn-icons-png.flaticon.com/128/5828/5828361.png",
    "03n":"https://cdn-icons-png.flaticon.com/128/5828/5828385.png",
    "04d":"https://cdn-icons-png.flaticon.com/128/9420/9420939.png",
    "04n":"https://cdn-icons-png.flaticon.com/128/9420/9420939.png",
    "09d":"https://cdn-icons-png.flaticon.com/128/9420/9420941.png",
    "09n":"https://cdn-icons-png.flaticon.com/128/9420/9420941.png",
    "10d":"https://cdn-icons-png.flaticon.com/128/7216/7216267.png",
    "10n":"https://cdn-icons-png.flaticon.com/128/7216/7216267.png",
    "11d":"https://cdn-icons-png.flaticon.com/128/9420/9420943.png",
    "11n":"https://cdn-icons-png.flaticon.com/128/9420/9420943.png",
    "13d":"https://cdn-icons-png.flaticon.com/128/5769/5769448.png",
    "13n":"https://cdn-icons-png.flaticon.com/128/5769/5769448.png",
    "50d":"https://cdn-icons-png.flaticon.com/128/9421/9421232.png",
    "50n":"https://cdn-icons-png.flaticon.com/128/9421/9421232.png"
};

//requesting apiFunction
try{
    callApi("Bagalkot");
    addLocation("Bagalkot");
}
catch(e)
{
    console.log("Srry");
}
//

//Show City and Country
function showLocation(data){
    const currentLocation =document.querySelector("#currentLocation");
    currentLocation.textContent=`${data.city.name}, ${data.city.country}`;
}
//


//Coverting to Actual Time of Place
function getTame(now){
    var unixTimestamp = Math.floor(now.getTime() / 1000);
    return unixTimestamp;
}
//


//Show Time and Date
function showTimeDate(data){
    const now = new Date();
    var unixTimestamp = getTame(now);
    const newTime= new Date((unixTimestamp + data.city.timezone)*1000);
    const currentDate =document.querySelector("#currentDate");
    const currentTime =document.querySelector("#currentTime");
    currentDate.textContent=`Today, ${newTime.getUTCDate()} ${months[newTime.getMonth()]}`;
    currentTime.textContent=`${newTime.getUTCHours()>12? newTime.getUTCHours()-12 : newTime.getUTCHours() }:${newTime.getUTCMinutes()} ${newTime.getUTCHours()>12 ? "PM" : newTime.getUTCHours()==12 ? "PM" : "AM" }`;
}
//

//current API call
async function currentApiCall(location){
    try{
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=1af2d745ebd29c6c176f2e0ee06909e6&units=metric`);
        return res;
    }
    catch(error){
        if (error.response) {
        alert(`${error.response.data.cod} ${error.response.data.message}`);
        }
    }
}


//Show Temperature, descreption, humidity, pressure and wind
async function showTempNStuff(location){
    const res= await currentApiCall(location);
    const currentTemp =document.querySelector("#currentTemp");
    const currentDescp =document.querySelector("#currentDescp");
    const windVal =document.querySelector("#windVal");
    const humidVal =document.querySelector("#humidVal");
    const pressVal =document.querySelector("#pressVal");
    currentTemp.textContent=`${Math.round(res.data.main.temp)}\u00B0C`;
    currentDescp.textContent=`${res.data.weather[0].description}`;
    windVal.textContent=`${res.data.wind.speed}m/s`;
    humidVal.textContent=`${res.data.main.humidity}%`;
    pressVal.textContent=`${res.data.main.pressure}hPa`;
    const weatherIcn =document.querySelector("#weatherIcn");
    weatherIcn.src=weatherIcons[res.data.weather[0].icon];
}
//


//api call function
async function callApi(location){
    try{
    const res= await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=1af2d745ebd29c6c176f2e0ee06909e6&units=metric`);
    showLocation(res.data);
    showTimeDate(res.data);
    showTempNStuff(location);
    show18hr(res.data);
    forecast5days(res.data);
    }
    catch(error){
        if (error.response) {
        alert(`${error.response.data.cod} ${error.response.data.message}`);
        }
    }
}
//

//to show 18 hour forecast
function show18hr(data)
{
    const daysTime =document.querySelectorAll(".daysTime");
    const daysIcn =document.querySelectorAll(".daysIcn");
    const daysTemp =document.querySelectorAll(".daysTemp");
    for(var i = 0; i < daysTime.length; i++)
    {
        daysTemp[i].textContent=`${Math.round(data.list[i].main.temp)}\u00B0`
        var now=new Date(data.list[i].dt_txt);
        var unixTimestamp = getTame(now);
        const newTime= new Date((unixTimestamp + data.city.timezone)*1000);
        daysTime[i].textContent=`${newTime.getUTCHours()>12? newTime.getUTCHours()-12 : newTime.getUTCHours() }:${newTime.getUTCMinutes()} ${newTime.getUTCHours()>12 ? "PM" : newTime.getUTCHours()==12 ? "PM" : "AM" }`;
        daysIcn[i].src=weatherIcons[newTime.getUTCHours()>6 && newTime.getUTCHours()<18 ? `${data.list[i].weather[0].icon.substring(0,2)}d` : `${data.list[i].weather[0].icon.substring(0,2)}n`];
    }
}
//


//5 days forecast
function forecast5days(data)
{
    const forecastDay =document.querySelectorAll(".forecastDay");
    const forecastTime =document.querySelectorAll(".forecastTime");
    const forecastTemp =document.querySelectorAll(".forecastTemp");
    const forecastIcn =document.querySelectorAll(".forecastIcn");
    var forecastDayList=[];
    var forecastTimeList=[];
    var forecastTempList=[];
    var forecastIcnList=[];
    for(let day of data.list){
        var dates=new Date(day.dt_txt);
        var unixTime = getTame(dates);
        var newDate= new Date((unixTime + data.city.timezone)*1000);
        if(newDate.getUTCHours()<12 && newDate.getUTCHours()>=9)
        {
            forecastDayList.push(`${newDate.getUTCDate()} ${months[newDate.getMonth()]}`);
            forecastTimeList.push(`${newDate.getUTCHours()>12? newDate.getUTCHours()-12 : newDate.getUTCHours() }:${newDate.getUTCMinutes()} ${newDate.getUTCHours()>12 ? "PM" : newDate.getUTCHours()==12 ? "PM" : "AM" }`);
            forecastTempList.push(`${Math.round(day.main.temp)}\u00B0`)
            forecastIcnList.push(weatherIcons[day.weather[0].icon])
            
        }
    }
    for(let i=0; i<forecastDay.length ; i++)
    {
        forecastDay[i].textContent=forecastDayList[i];
        forecastTime[i].textContent=forecastTimeList[i];
        forecastTemp[i].textContent=forecastTempList[i];
        forecastIcn[i].src=forecastIcnList[i];
    }
}
//

//Search Mechanism
const form=document.querySelector('form');
const searchbar=document.querySelector('#searchBar');
form.addEventListener('submit', function(e){
    e.preventDefault();
    const location=searchbar.value;
    callApi(location);
    addLocation(location);
})
//
var placesList=["null"];

//Create location tile
async function addLocation(location)
{
    var exists=false;
    const res= await currentApiCall(location);
    const loc=res.data.name;

    for(let i=0;i<placesList.length;i++){
        if(loc == placesList[i])
        {
            exists=true;
            break;
        }
    }

    if(!exists){
        placesList.push(loc);
        const placesContainer=document.querySelector('#placesContainer')
        const yellows = document.createElement('div');
        yellows.classList.add('yellows');
        yellows.addEventListener('click', () =>{
            tileclicked(loc);
        } );
        const placeTemp = document.createElement('p');
        placeTemp.textContent=`${Math.round(res.data.main.temp)}\u00B0C`;
        placeTemp.classList.add('placeTemp');
        const placeTempIcn = document.createElement('img');
        placeTempIcn.src=weatherIcons[res.data.weather[0].icon];
        placeTempIcn.classList.add('placeTempIcn');
        const placeName = document.createElement('p');
        placeName.textContent=loc;
        placeName.classList.add('placeName');
        yellows.appendChild(placeTemp);
        yellows.appendChild(placeTempIcn);
        yellows.appendChild(placeName);
        placesContainer.appendChild(yellows);
    }
}
//


//on click tile show weather
function tileclicked(location){
    callApi(location);
    if(document.querySelector("#current_weather_container").style.display=="none"){
        currentWeather.style.display="block";
        currentLocation.style.display="none"
        forecast.style.display="block";
    }
}
//