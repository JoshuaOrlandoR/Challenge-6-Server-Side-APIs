// Creating variable so API key is easily accessed and testing link concatination
const apiKey = "726326cfb37bc9ce0441edd5bfd0266c"
urlTest = "https://api.test" + 56 + ".com"
console.log(urlTest);

//Link for reference - had to reformat parameters otherwise link would not work for some reason
// https://api.openweathermap.org/data/2.5/weather?q={city%20name}&appid={API%20key}&units=metric
// The above link is just for daily weather, use the same link but replace weather? with forcast? for the weekly forcast version (used to fill the 5 day section)

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
    //On double click - remove button - this isn't working exactly how I want it to right now but the dblclick event listener is not working at all
    var clickCount = 0;
    $(oldSearchBtn).on("click", function(event){
        clickCount++;
        if (clickCount ===1){
            event.preventDefault();
            console.log("test1click");
            cityName= $(this).text();
            fillWeatherToday();

        } else if (clickCount ==2) {
            event.preventDefault();
            console.log("test2click");
            oldSearchBtn.remove();
        }
  
    });
};

//Testing Fetching to understand it more
// fetch('https://api.openweathermap.org/data/2.5/weather?q=Toronto&units=imperial&appid=726326cfb37bc9ce0441edd5bfd0266c')
//   .then((response) => response.json())
//   .then((data) => console.log(data));

//Filling in info for present day forcast 
var currentCityWeatherStats = $('.currentCityWeatherStats')
function fillWeatherToday() {
    var currentCityURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=726326cfb37bc9ce0441edd5bfd0266c`;
    fetch(currentCityURL, {
        method: 'GET', //to be honest still not entirely sure this is correct or if this is all I have to do - SEEMS TO WORK :D
    })
    .then(function (response) {
        return response.json();
      })
      //Gets all the relavent info from the JSON response and fills in fields 
    .then(function (response) {
        $(".currentCityName").text(response.name);
        $(".currentCityWeatherDescription").text("Conditions: " +response.weather[0].description);
        var currentTempEl = $("<p>").text("Current Temperature: "+response.main.temp+" °C");
        currentCityWeatherStats.append(currentTempEl);
        var currentMinTemp = $("<p>").text("Low of " +response.main.temp_min+ " °C");
        currentCityWeatherStats.append(currentMinTemp);
        var currentMaxTemp = $("<p>").text("High of " +response.main.temp_max+ " °C");
        currentCityWeatherStats.append(currentMaxTemp);
        var currentHumidity = $("<p>").text("Humidity: " +response.main.humidity+ "%rh");
        currentCityWeatherStats.append(currentHumidity);
        var currentWindSpeed = $("<p>").text("Wind Speed: " +response.wind.speed+ " mph");
        currentCityWeatherStats.append(currentWindSpeed);


        //TODO: 5 DAY FORCAST 
    }
)
} 
