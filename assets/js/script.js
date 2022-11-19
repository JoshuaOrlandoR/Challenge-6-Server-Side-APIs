// Creating variable so API key is easily accessed and testing link concatination
const apiKey = "726326cfb37bc9ce0441edd5bfd0266c"
urlTest = "https://api.test" + 56 + ".com"
console.log(urlTest);

//Link for reference - had to reformat parameters otherwise link would not work for some reason
// https://api.openweathermap.org/data/2.5/weather?q={city%20name}&appid={API%20key}&units=metric
// The above link is just for daily weather, use the same link but replace weather? with forecast? for the weekly forcast version (used to fill the 5 day section)

var previousSearches = []; //Empty array will hold the text of the search input (also will be stored in local storage)

$(".searchBtn").on("click", function (event) {
    event.preventDefault();
    cityName = $(this).parent(".btnHolder").siblings(".cityNameText").val().trim(); //finds button, moves up to parent, then to sibling, takes input value and trims empty space
    if (cityName === "") { //if input is blank, return
        return;
    };
    previousSearches.push(cityName);

    //Set items to local storage 
    localStorage.setItem("cityName", JSON.stringify(previousSearches));

    forecastEmpty();
    fillWeatherToday();
    displayPrevious();
    
});

//Create item list of previously searched cities 
var searchHistory = $(".searchHistory");

function displayPrevious() {
    searchHistory.empty();
    for (let i = 0; i < previousSearches.length; i++) {
        var createdRow = $("<row>");
        var oldSearchBtn = $("<button>").text(`${previousSearches[i]}`); //stack overflow helped with syntax errors for the .text portion of this line, don't quite understand with the explanations I was given though
        //Adding classes and attributes to created elements 
        createdRow.addClass("row searchHistRow");
        oldSearchBtn.attr("type", "button");
        oldSearchBtn.addClass("btn btn-dark oldSearchBtn text-white");
        //Appending created elements to HTML elements 
        searchHistory.append(createdRow);
        createdRow.append(oldSearchBtn);
    } if(!cityName) {
        return;
    }
    //Functionality for button click to search for that city- tried creating a method that allowed for buttons to get deleted but the dblclick listener did not work 
    $(".oldSearchBtn").on("click", function(event){ 
            event.preventDefault();
            console.log("test1click");
            cityName= $(this).text();
            currentCityWeatherStats.empty();
            forecastEmpty();
            fillWeatherToday();
    });
};

//Filling in info for present day forcast 
var currentCityWeatherStats = $('.currentCityWeatherStats')
function fillWeatherToday() {
    currentCityWeatherStats.empty();
    var currentCityURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=726326cfb37bc9ce0441edd5bfd0266c`;
    fetch(currentCityURL, {
        method: "GET", //to be honest still not entirely sure this is correct or if this is all I have to do - SEEMS TO WORK :D
    })
    .then(function (response) {
        return response.json();
      })
      //Gets all the relavent info from the JSON response and fills in fields 
    .then(function (response) {
        $(".currentCityName").text(response.name);
        $(".currentCityWeatherDescription").text("Conditions: " +response.weather[0].description);
        $(".weatherIconCurrent").attr("src", `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);

        var currentTempEl = $("<p>").text("Current Temperature: "+response.main.temp+" °C");
        currentCityWeatherStats.append(currentTempEl);

        var currentMinTemp = $("<p>").text("Low of " +response.main.temp_min+ " °C");
        currentCityWeatherStats.append(currentMinTemp);

        var currentMaxTemp = $("<p>").text("High of " +response.main.temp_max+ " °C");
        currentCityWeatherStats.append(currentMaxTemp);

        var currentHumidity = $("<p>").text("Humidity: " +response.main.humidity+ " %rh");
        currentCityWeatherStats.append(currentHumidity);

        var currentWindSpeed = $("<p>").text("Wind Speed: " +response.wind.speed+ " mph");
        currentCityWeatherStats.append(currentWindSpeed);
    });
    callForecast();
} ;


//Variables for callForecast
var forecastDay1 = $('.forecastDay1');
var forecastDay2 = $('.forecastDay2');
var forecastDay3 = $('.forecastDay3');
var forecastDay4 = $('.forecastDay4');
var forecastDay5 = $('.forecastDay5');

//Will fill in HTML elements with this API's info - Need to fill Date, Icon + weather conditions, tempterature, wind speed, humidity
function callForecast() {
    var fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=726326cfb37bc9ce0441edd5bfd0266c`
    fetch(fiveDayURL, {
        method: "GET",
    })
    .then(function (response) {
        return response.json();
      })
    .then(function (response) {
        console.log(response)
        //Day 1 of Forecast
        var dayOneDate = $("<h6>").text(response.list[3].dt_txt.split("09")[0]);
        forecastDay1.append(dayOneDate);

        $(".weatherIconDay1").attr("src", `https://openweathermap.org/img/wn/${response.list[3].weather[0].icon}@2x.png`);

        var dayOneCondition = $("<p>").text(response.list[3].weather[0].description);
        forecastDay1.append(dayOneCondition);

        var dayOneTemp = $("<p>").text(response.list[3].main.temp + " °C");
        forecastDay1.append(dayOneTemp);

        var dayOneHumidity = $("<p>").text(response.list[3].main.humidity + " %rh");
        forecastDay1.append(dayOneHumidity);

        var dayOneWindSpeed = $("<p>").text(response.list[3].wind.speed + " mph");
        forecastDay1.append(dayOneWindSpeed);

        //Day 2 of Forecast
        var dayTwoDate = $("<h6>").text(response.list[11].dt_txt.split("09")[0]);
        forecastDay2.append(dayTwoDate);

        $(".weatherIconDay2").attr("src", `https://openweathermap.org/img/wn/${response.list[11].weather[0].icon}@2x.png`);


        var dayTwoCondition = $("<p>").text(response.list[11].weather[0].description);
        forecastDay2.append(dayTwoCondition);

        var dayTwoTemp = $("<p>").text(response.list[11].main.temp + " °C");
        forecastDay2.append(dayTwoTemp);

        var dayTwoHumidity = $("<p>").text(response.list[11].main.humidity + " %rh");
        forecastDay2.append(dayTwoHumidity);

        var dayTwoWindSpeed = $("<p>").text(response.list[11].wind.speed + " mph");
        forecastDay2.append(dayTwoWindSpeed);


        //Day 3 of Forecast
        var dayThreeDate = $("<h6>").text(response.list[19].dt_txt.split("09")[0]);
        forecastDay3.append(dayThreeDate);

        $(".weatherIconDay3").attr("src", `https://openweathermap.org/img/wn/${response.list[19].weather[0].icon}@2x.png`);


        var dayThreeCondition = $("<p>").text(response.list[19].weather[0].description);
        forecastDay3.append(dayThreeCondition);

        var dayThreeTemp = $("<p>").text(response.list[19].main.temp + " °C");
        forecastDay3.append(dayThreeTemp);

        var dayThreeHumidity = $("<p>").text(response.list[19].main.humidity + " %rh");
        forecastDay3.append(dayThreeHumidity);

        var dayThreeWindSpeed = $("<p>").text(response.list[19].wind.speed + " mph");
        forecastDay3.append(dayThreeWindSpeed);

        //Day 4 of Forecast
        var dayFourDate = $("<h6>").text(response.list[27].dt_txt.split("09")[0]);
        forecastDay4.append(dayFourDate);

        $(".weatherIconDay4").attr("src", `https://openweathermap.org/img/wn/${response.list[27].weather[0].icon}@2x.png`);


        var dayFourCondition = $("<p>").text(response.list[27].weather[0].description);
        forecastDay4.append(dayFourCondition);

        var dayFourTemp = $("<p>").text(response.list[27].main.temp + " °C");
        forecastDay4.append(dayFourTemp);

        var dayFourHumidity = $("<p>").text(response.list[27].main.humidity + " %rh");
        forecastDay4.append(dayFourHumidity);

        var dayFourWindSpeed = $("<p>").text(response.list[27].wind.speed + " mph");
        forecastDay4.append(dayFourWindSpeed);

        //Day 5 of Forecast
        var dayFiveDate = $("<h6>").text(response.list[35].dt_txt.split("09")[0]);
        forecastDay5.append(dayFiveDate);

        $(".weatherIconDay5").attr("src", `https://openweathermap.org/img/wn/${response.list[35].weather[0].icon}@2x.png`);

        var dayFiveCondition = $("<p>").text(response.list[35].weather[0].description);
        forecastDay5.append(dayFiveCondition);

        var dayFiveTemp = $("<p>").text(response.list[35].main.temp + " °C");
        forecastDay5.append(dayFiveTemp);

        var dayFiveHumidity = $("<p>").text(response.list[35].main.humidity + " %rh");
        forecastDay5.append(dayFiveHumidity);

        var dayFiveWindSpeed = $("<p>").text(response.list[35].wind.speed + " mph");
        forecastDay5.append(dayFiveWindSpeed);
    });
};

//Removes content from each div 
function forecastEmpty() {
    forecastDay1.empty();
    forecastDay2.empty();
    forecastDay3.empty();
    forecastDay4.empty();
    forecastDay5.empty();
};

