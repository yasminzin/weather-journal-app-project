// const baseUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
// const apiKey = "65474d31d4ea0091bab5dd8c8f1bac09";

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + "." + d.getDate() + "." + d.getFullYear();

/* Global Variables */

// select the button
const btn = document.querySelector("button");

// select the weather data
const entry = document.querySelector(".entry");
const dateData = document.querySelector("#date");
const descriptionData = document.querySelector("#description");
const iconData = document.querySelector("#icon");
const tempData = document.querySelector("#temp");
const contentData = document.querySelector("#content");
const nameData = document.querySelector("#name");

// select the red label
const redLabel = document.querySelector("#red-label");

// API key
const apiKey = "65474d31d4ea0091bab5dd8c8f1bac09";

// Digital Clock
showTime = () => {
  var date = new Date();
  var h = date.getHours(); // 0 - 23
  var m = date.getMinutes(); // 0 - 59
  var s = date.getSeconds(); // 0 - 59
  var session = "AM";

  if (h == 0) {
    h = 12;
  }

  if (h > 12) {
    h = h - 12;
    session = "PM";
  }

  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;

  var time = h + ":" + m + ":" + s + " " + session;
  document.getElementById("digital-clock").textContent = time;

  setTimeout(showTime, 1000);
};

showTime();

// add an event listener to show the weather data when the button clicked
btn.addEventListener("click", weatherFunc);

async function weatherFunc() {
  const cityName = document.querySelector("#city-name").value;
  const feelings = document.querySelector("#feelings").value;
  try {
    // fetch the weather data from the api
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
    );
    const data = await response.json();
    console.log(data);

    const temp = data.main.temp;
    const name = data.name;
    const icon = data.weather[0].icon;
    const description = data.weather[0].description;
    const date = new Date().toLocaleString();

    // send the weather data to the server
    await fetch("/saveData", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: date,
        temp: temp,
        name: name,
        icon: icon,
        description: description,
        content: feelings,
      }),
    });

    // fetch the weather data from the server
    const dataResponse = await fetch("/getData");
    const finalData = await dataResponse.json();
    console.log(finalData);

    // add the style to the weather data
    entry.classList.add("after-click");

    // show the weather icon
    iconData.style.display = "inline";
    iconData.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;

    // show the weather data
    tempData.textContent = `${Math.floor(temp - 273.15)}°C`;
    nameData.textContent = `${name}`;
    dateData.textContent = `${date}`;
    descriptionData.textContent = `${description}`;
    contentData.textContent = `I feel: ${feelings}`;

    if (entry.classList.contains("after-click")) {
      redLabel.style.visibility = "hidden";
    }
  } catch (error) {
    redLabel.style.visibility = "visible";
  }
}
