

function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for (var i = 0; i < uiBathrooms.length; i++) {
    if (uiBathrooms[i].checked) {
      return parseInt(uiBathrooms[i].value);
    }
  }
  return -1; // Invalid Value
}

function getBHKValue() {
  var uiBHK = document.getElementsByName("uiBHK");
  for (var i = 0; i < uiBHK.length; i++) {
    if (uiBHK[i].checked) {
      return parseInt(uiBHK[i].value);
    }
  }
  return -1; // Invalid Value
}

function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");

  var sqft = document.getElementById("uiSqft");
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var location = document.getElementById("uiLocations");
  var estPrice = document.getElementById("uiEstimatedPrice");
  var priceDisplay = document.getElementById("priceDisplay");
  var loadingIndicator = document.getElementById("loadingIndicator");

  // Validate inputs
  if (!sqft.value || sqft.value <= 0) {
    alert("Please enter a valid area in square feet");
    return;
  }

  if (bhk === -1) {
    alert("Please select number of BHK");
    return;
  }

  if (bathrooms === -1) {
    alert("Please select number of bathrooms");
    return;
  }

  if (!location.value) {
    alert("Please select a location");
    return;
  }

  var url = "http://127.0.0.1:5000/predict_home_price"; // Flask backend

  // Show loading indicator
  loadingIndicator.style.display = "block";
  estPrice.style.display = "none";

  $.post(url, {
    total_sqft: parseFloat(sqft.value),
    bhk: bhk,
    bath: bathrooms,
    location: location.value
  }, function (data, status) {
    console.log("API Response:", data);
    
    // Hide loading indicator
    loadingIndicator.style.display = "none";
    
    if ("estimated_price" in data) {
      priceDisplay.textContent = data.estimated_price.toString();
      estPrice.style.display = "block";
      
      // Add animation effect
      estPrice.style.opacity = "0";
      estPrice.style.transform = "translateY(20px)";
      
      setTimeout(function() {
        estPrice.style.opacity = "1";
        estPrice.style.transform = "translateY(0)";
        estPrice.style.transition = "all 0.5s ease";
      }, 100);
    } else {
      alert("Error: Unable to get price estimate. Please try again.");
    }
    console.log("Status:", status);
  }).fail(function() {
    // Hide loading indicator on error
    loadingIndicator.style.display = "none";
    alert("Error: Unable to connect to the server. Please try again later.");
  });
}

function onPageLoad() {
  console.log("document loaded");
  var url = "http://127.0.0.1:5000/get_location_names";

  // Show loading for locations
  var locationSelect = document.getElementById("uiLocations");
  var loadingOption = document.createElement("option");
  loadingOption.text = "Loading locations...";
  loadingOption.disabled = true;
  loadingOption.selected = true;
  locationSelect.innerHTML = "";
  locationSelect.appendChild(loadingOption);

  $.get(url, function (data, status) {
    console.log("Got response for get_location_names request");
    if (data && data.locations) {
      var locations = data.locations;
      locationSelect.innerHTML = "";
      
      // Add default option
      var defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      defaultOption.text = "Choose a Location";
      locationSelect.appendChild(defaultOption);
      
      // Sort locations alphabetically
      locations.sort();
      
      // Add all locations
      for (var i = 0; i < locations.length; i++) {
        var opt = document.createElement("option");
        opt.value = locations[i];
        opt.text = locations[i];
        locationSelect.appendChild(opt);
      }
    }
  }).fail(function() {
    locationSelect.innerHTML = "";
    var errorOption = document.createElement("option");
    errorOption.text = "Error loading locations";
    errorOption.disabled = true;
    errorOption.selected = true;
    locationSelect.appendChild(errorOption);
  });
}

// Add smooth scrolling for navigation
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

window.onload = onPageLoad;
