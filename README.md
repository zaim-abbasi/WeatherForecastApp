# Weather Dashboard

## Description

Weather Dashboard is a responsive web application that provides real-time weather information and forecasts for cities around the world. Built with modern web technologies, it offers an intuitive interface for users to check current weather conditions, view 5-day forecasts, and interact with a weather-focused chatbot.

## Features

- **Current Weather Display**: Shows current temperature, conditions, humidity, and wind speed for a selected city.
- **5-Day Forecast**: Provides a detailed 5-day weather forecast.
- **Interactive Charts**: Visualizes temperature trends and weather conditions using dynamic charts.
- **Geolocation Support**: Allows users to get weather information for their current location.
- **Unit Conversion**: Toggle between Celsius and Fahrenheit temperature units.
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices.
- **Weather Chatbot**: An AI-powered chatbot to answer weather-related queries.
- **Data Filtering**: Sort and filter forecast data based on various criteria.

## Technologies Used

- HTML5
- CSS3 (with Tailwind CSS framework)
- JavaScript (ES6+)
- Chart.js for data visualization
- OpenWeatherMap API for weather data
- Google Generative AI for the chatbot functionality

## Setup and Installation

1. Clone the repository:

2. Navigate to the project directory:

3. Open `index.html` in your web browser to run the application locally.

4. (Optional) If you're using a local server, start it in the project root directory.

## Configuration

1. OpenWeatherMap API:
- Sign up for a free account at [OpenWeatherMap](https://openweathermap.org/).
- Replace the `API_KEY` in `app.js` with your API key:
  ```javascript
  const API_KEY = 'your_api_key_here';  


Google Generative AI (for chatbot):

- Follow Google's documentation to set up and obtain necessary credentials.
- Update the import in the HTML file if needed:

```html
<script type="importmap">
    {
      "imports": {
        "google-generative-ai": "https://esm.run/@google/generative-ai"
      }
    }
</script>
```


## Usage

1. Enter a city name in the search bar and click "Get Weather" or press Enter.
2. Click "Use My Location" to get weather data for your current location.
3. Toggle between Celsius and Fahrenheit using the checkboxes.
4. View the current weather, forecast, and weather charts on the dashboard.
5. Use the tables page to see detailed forecast information and interact with the chatbot.

## Contact

For any queries or suggestions, please open an issue on this GitHub repository.

This README provides a comprehensive overview of your Weather Dashboard project, including setup instructions, features, and usage guidelines. It's designed to help users and potential contributors understand and use your project effectively. Remember to replace `your-username` in the clone URL with your actual GitHub username when you publish the repository.
