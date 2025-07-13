fetchData();

function fetchData() {
    const cityTemp = document.getElementById('city-temp');
    fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/colorado/2025-07-13?key=X9CNXWSHWUESEV4FDA8ZNL5WL", {
        mode: 'cors'
    })
    
    .then(response => response.json())
   // .then(data => console.log(data)) ** this is how you see the api data in log
    .then(data => {
        const temp = data.currentConditions.temp;
        const conditions = data.currentConditions.conditions;
        const humidity = data.currentConditions.humidity;
        const windSpeed = data.currentConditions.windspeed;

        const cityTemp = document.getElementById("city-temp");
        const cityConditions = document.getElementById("weather");
        const cityHumidity = document.getElementById("humidity");
        const cityWindSpeed = document.getElementById("wind");

        cityTemp.innerText = temp;
        cityConditions.innerText = conditions;
        cityHumidity.innerText = humidity;
        cityWindSpeed.innerText = windSpeed;
    })
    .catch(error => console.error(error));
}