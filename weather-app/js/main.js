const apiKey = "7JgzBUhXnul4PAzpDJ7AjASejo4pDoY5";

const listCard = document.querySelector(".list_card");
const list = document.querySelector(".list");
const searchCity = document.querySelector("#search_city");
const cityName = document.querySelector(".city_name");
const weatherText = document.querySelector(".weather_text");
const degree = document.querySelector(".degree");
const timeImage = document.querySelector("#time_image");

const getCityName = async (city) => {
  const url =
    "http://dataservice.accuweather.com/locations/v1/cities/autocomplete";
  const query = `?apikey=${apiKey}&q=${city}`;

  const request = await fetch(url + query);
  const response = await request.json();

  return response;
};

searchCity.addEventListener("keyup", (e) => {
  if (e.target.value.length === 0) {
    listCard.style = "display:none;";
  } else {
    list.innerHTML = "";
    getCityName(e.target.value.trim().toLowerCase())
      .then((cities) => {
        cities.forEach((city) => {
          list.innerHTML += `<p style="padding:8px 0">${city.LocalizedName}<p><hr>`;
          listCard.style = "display:block";
        });
      })
      .catch((err) => console.log(err));
  }
});

list.addEventListener("click", (e) => {
  updateTheUi(e.target.innerText.toLowerCase());
});

const updateTheUi = (city) => {
  getCityCode(city)
    .then((data) => {
      cityName.innerHTML = `${data.LocalizedName}, ${data.Country.LocalizedName}`;
      searchCity.value = "";
      listCard.style = "display:none;";
      return getWeatherInfo(data.Key);
    })
    .then((data) => {
      weatherText.innerHTML = `${data.WeatherText}`;
      degree.innerHTML = `${data.Temperature.Metric.Value}&deg;C`;

      if (data.IsDayTime) {
        timeImage.setAttribute("src", "./img/day.jpg");
      } else {
        timeImage.setAttribute("src", "./img/night.jpg");
      }

      localStorage.setItem("city", city);
    });
};

const getCityCode = async (city) => {
  const url = "http://dataservice.accuweather.com/locations/v1/cities/search";
  const query = `?apikey=${apiKey}&q=${city}`;

  const request = await fetch(url + query);
  const response = await request.json();

  return response[0];
};

const getWeatherInfo = async (cityCode) => {
  const url = "http://dataservice.accuweather.com/currentconditions/v1/";
  const query = `${cityCode}?apikey=${apiKey}`;

  const request = await fetch(url + query);
  const response = await request.json();

  return response[0];
};

if (localStorage.getItem("city").length > 0) {
  updateTheUi(localStorage.getItem("city"));
}
