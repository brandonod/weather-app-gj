fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/colorado/2025-07-13?key=X9CNXWSHWUESEV4FDA8ZNL5WL", {
    mode: 'cors'
})

.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error(error));

