document.getElementById('current-location').addEventListener('click', getCurrentLocation);
document.getElementById('location-search').addEventListener('input', handleLocationSearch);

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            fetchSunriseSunset(latitude, longitude);
        }, showError);
    } else {
        showError("Geolocation is not supported by this browser.");
    }
}

function handleLocationSearch(event) {
    const query = event.target.value;
    if (query.length > 3) { // Trigger search after 3 characters
        fetch(`https://geocode.maps.co/search?q=${query}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const { lat, lon } = data[0];
                    fetchSunriseSunset(lat, lon);
                } else {
                    showError("Location not found.");
                }
            }).catch(() => showError("Error fetching location data."));
    }
}

function fetchSunriseSunset(latitude, longitude) {
    let display = document.getElementById('data-display');
    display.innerHTML = ''; // Clear previous data

    for (let i = 0; i < 3; i++) {
        let date = new Date();
        date.setDate(date.getDate() + i);
        fetchDataForDate(latitude, longitude, date.toISOString().split('T')[0]);
    }
}

function fetchDataForDate(latitude, longitude, date) {
    const url = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=${date}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK') {
                updateUI(data.results, date);
            } else {
                showError("Error fetching data.");
            }
        })
        .catch(() => showError("Error fetching data."));
}

function updateUI(data, date) {
  let display = document.getElementById('data-display');
  if (display.innerHTML === '') {
      display.innerHTML = '<tr><th>Date</th><th>Sunrise</th><th>Sunset</th><th>Dawn</th><th>Dusk</th><th>Day Length</th><th>Solar Noon</th><th>Timezone</th></tr>';
  }
  let row = `<tr>
      <td>${date}</td>
      <td>${data.sunrise}</td>
      <td>${data.sunset}</td>
      <td>${data.dawn}</td>
      <td>${data.dusk}</td>
      <td>${data.day_length}</td>
      <td>${data.solar_noon}</td>
      <td>${data.timezone}</td>
  </tr>`;
  display.innerHTML += row;
}

function showError(error) {
    const display = document.getElementById('data-display');
    display.innerHTML = `<tr><td colspan="7">${error}</td></tr>`;
}
