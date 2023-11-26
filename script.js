console.log("script.js loaded");

const temp = document.getElementById("temp"),
date = document.getElementById("date-time"),
currentLocation = document.getElementById("location"),
condition = document.getElementById("condition"),
rain = document.getElementById("rain"),
mainIcon = document.getElementById("icon"),
windSpeed = document.querySelector(".wind-speed"),
humidity = document.querySelector(".humidity"),
humidityStatus = document.querySelector(".humidity-status"),
weatherCards = document.querySelector("#weather-cards"),
celciusBtn = document.querySelector(".celcius"),
fahrenheitBtn = document.querySelector(".fahrenheit"),
hourlyBtn = document.querySelector(".hourly"),
weekBtn = document.querySelector(".week"),
tempUnit = document.querySelectorAll(".temp-unit"),
searchForm = document.querySelector("#search"),
search = document.querySelector("#query");

let currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "Week";


//Update Date Time

function getDateTime() {
    let now = new Date(),
      hour = now.getHours(),
      minute = now.getMinutes();
  
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
  
    hour = hour % 12;
    if (hour < 10) {
      hour = "0" + hour;
    }
    if (minute < 10) {
      minute = "0" + minute;
    }
  
    let dayString = days[now.getDay()];
    return `${dayString}, ${hour}:${minute}`;
}

  
  date.innerText = getDateTime();


//update time every second
setInterval(() => {
    date.innerText = getDateTime();
}, 1000);


//function to get current geolocation with IP address
function getPublicIp() {
    fetch("https://geolocation-db.com/json/", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        currentCity = data.city;
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
      });
}
  getPublicIp();



  //function to get weather data

function getWeatherData(city, unit, hourlyorWeek) {
    console.log(city);
    fetch(
      `https://weatherdbi.herokuapp.com/data/weather/${city}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        let today = data.currentConditions;
        if (unit === "c") {
          temp.innerText = today.temp.c;
        } else {
            temp.innerText = celciusToFahrenheit(today.temp.c);
        }
        console.log(data)
        currentLocation.innerText = data.region;
        condition.innerText = today.comment;
        rain.innerText = "Perc - " + today.precip;
        windSpeed.innerText = today.wind.km;
        humidity.innerText = today.humidity;
        updateHumidityStatus(today.humidity);
        console.log(today.iconURL)
        mainIcon.src = today.iconURL;
        changeBackground(today.comment);
        if (hourlyorWeek === "hourly") {
          updateForecast(data.next_days, unit, "day");
        } else {
          updateForecast(data.next_days, unit, "week");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("City not found in our database");
      });
}


//convert celcius to fahrenheit
function celciusToFahrenheit(temp) {
    return ((temp * 9) / 5 + 32).toFixed(0);
}

function updateHumidityStatus(humidity) {
    if (humidity <= 30) {
      humidityStatus.innerText = "Low";
    } else if (humidity <= 60) {
      humidityStatus.innerText = "Moderate";
    } else {
      humidityStatus.innerText = "High";
    }
}

function getDayName(date) {
    let day = new Date(date);
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Satureday",
    ];
    return days[day.getDay()];
}
  
function getHour(time) {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if (hour > 12) {
      hour = hour - 12;
      return `${hour}:${min} PM`;
    } else {
      return `${hour}:${min} AM`;
    }
}

function convertTimeTo12HourFormat(time) {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am";
    hour = hour & 12;
    hour = hour ? hour : 12; // the zero hour should be 12
    hour = hour < 10 ? "0" + hour : hour; // add prefix zero if less then 10
    minute = minute < 10 ? "0" + minute : minute;
    let strTime = hour + ":" + minute + " " + ampm;
    return strTime;
}


function updateForecast(data, unit, type) {
    weatherCards.innerHTML = "";
  
    let day = 0;
    let numCards = 0;
    // 24 cards if hourly weather and 7 for weekly
    if (type === "day") {
      numCards = 1;
    } else {
      numCards = 7;
    }

    for (let i = 0; i < numCards; i++) {
      let card = document.createElement("div");
      card.classList.add("card");
      // hour if hourly time and day name if weekly
      let dayName = data[i].day;
      if (type === "week") {
        dayName = data[i].day;
      }
      let dayTemp = data[i].max_temp.c;
      if (unit === "f") {
        dayTemp = celciusToFahrenheit(data[i].max_temp.c);
      }

      let tempUnit = "°C";
      if (unit === "f") {
        tempUnit = "°F";
      }
      card.innerHTML = `
                          <h2 class="day-name">${dayName}</h2>
              <div class="card-icon">
                <img src="${data[i].iconURL}" alt="" />
              </div>
              <div class="day-temp">
                <h2 class="temp">${dayTemp}</h2>
                <span class="temp-unit">${tempUnit}</span>
              </div>
        
        `;
      weatherCards.appendChild(card);
      day++;
    }
}
  
function changeBackground(condition) {
    console.log("getting background", condition);
    const body = document.querySelector("body");
    let bg = "";
    if (condition.includes("Cloud")) {
      bg = "images/pc.jpeg";
    } else if (condition.includes("cloudy" || "Cloudy")) {
      bg = "images/pc.jpeg";
    } else if (condition.includes("rain" || "Rain")) {
      bg = "images/rain.jpeg";
    } else if (condition.includes("clear" || "Clear")) {
      bg = "images/cd.jpeg";
    } else if (condition.includes("snow" || "Snow")) {
      bg = "images/cn.jpeg";
    } else {
      bg = "images/cd.jpeg";
    }
    body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bg})`;
    console.log(bg);
}




fahrenheitBtn.addEventListener("click", () => {
    changeUnit("f");
});
celciusBtn.addEventListener("click", () => {
    changeUnit("c");
});


function changeUnit(unit) {
    if (currentUnit !== unit) {
      currentUnit = unit;
      {
        //change unit on document
        tempUnit.forEach((elem) => {
          elem.innerText = `°${unit.toUpperCase()}`;
        });
        if (unit === "c") {
          celciusBtn.classList.add("active");
          fahrenheitBtn.classList.remove("active");
        } else {
          celciusBtn.classList.remove("active");
          fahrenheitBtn.classList.add("active");
        }
        // call get weather after change unit
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
      }
    }
}



hourlyBtn.addEventListener("click", () => {
    changeTimeSpan("hourly");
});

weekBtn.addEventListener("click", () => {
    changeTimeSpan("week");
});
  
function changeTimeSpan(unit) {
    if (hourlyorWeek !== unit) {
      hourlyorWeek = unit;
      if (unit === "hourly") {
        hourlyBtn.classList.add("active");
        weekBtn.classList.remove("active");
      } else {
        hourlyBtn.classList.remove("active");
        weekBtn.classList.add("active");
      }
      // update weather on time change
      getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
}


searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let location = search.value;
    if (location) {
      currentCity = location;
      getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
});




cities = [
    "Atlanta",
    "Las Vegas",
    "Kentucky",
    "Chicago",
    "New York",
    "Los Angeles",
    "Vancouver",
    "Dallas",
    "Seattle",
    "San Francisco",
    "Miami",
    "Boston",
];

var currentFocus;




search.addEventListener("input", function (e) {
    removeSuggestions();
    var a,
      b,
      i,
      val = this.value;
    //if there is nothing search input do nothing
    if (!val) {
      return false;
    }
    currentFocus = -1;
  
    //creating a ul with a id suggestion
    a = document.createElement("ul");
    a.setAttribute("id", "suggestions");
    //append the ul to its parent which is search form
    this.parentNode.appendChild(a);
    //adding li's with matching search suggestions
    for (i = 0; i < cities.length; i++) {
      //check if items start with same letters which are in input
      if (cities[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        // if any suggestion matching then create li
        b = document.createElement("li");
        // ading content in li
        //strong to make the matchin letters bold
        b.innerHTML = "<strong>" + cities[i].substr(0, val.length) + "</strong>";
        //remaining part of suggestion
        b.innerHTML += cities[i].substr(val.length);
        //input field to hold the suggestion value
        b.innerHTML += "<input type='hidden' value='" + cities[i] + "'>";
  
        //adding eventListner on suggestion
        b.addEventListener("click", function (e) {
          //on click set the search input value with th clicked suggestion value
          search.value = this.getElementsByTagName("input")[0].value;
          removeSuggestions();
        });
  
        //append suggestion li to ul
        a.appendChild(b);
      }
    }
});




function removeSuggestions() {
    //select the ul which is being adding on search input
    var x = document.getElementById("suggestions");
    //if x exists remove it
    if (x) x.parentNode.removeChild(x);
}




search.addEventListener("keydown", function (e) {
    var x = document.getElementById("suggestions");
    // selaect the li elemets of suggestion ul
    if (x) x = x.getElementsByTagName("li");
  
    if (e.keyCode == 40) {
      //if key code is down button
      currentFocus++;
      //lets create a function to adda active suggsetion
      addActive(x);
    } else if (e.keyCode == 38) {
      //if key code is up button
      currentFocus--;
      addActive(x);
    }
    if (e.keyCode == 13) {
      //if enter is presed add the current select suggestion in input field
  
      e.preventDefault();
      if (currentFocus > -1) {
        //if any suggestion is selected click it
        if (x) x[currentFocus].click();
      }
    }
});



function addActive(x) {
    //if there is no suggestion return as it is
  
    if (!x) return false;
    removeActive(x);
    //if current focus is more than the length of suggestion arraya make it 0
    if (currentFocus >= x.length) currentFocus = 0;
    // if its less than 0 make it last suggestion equals
    if (currentFocus < 0) currentFocus = x.length - 1;
  
    //adding active class on focused li
    x[currentFocus].classList.add("active");
}
  
  //its working but we need to remove previusly actived suggestion
  
function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("active");
    }
}
