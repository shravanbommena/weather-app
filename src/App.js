import { useState } from "react";
import axios from "axios";
import "./App.css";
import WeatherCard from "./components/WeatherCard";
import { CiSearch } from "react-icons/ci";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [weatherData, setWeatherData] = useState({});
  const [pinnedData, setPinnedData] = useState([]);
  const [serachError, setSearchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchWeatherData = async () => {
    try {
      // API city works for both city or zip code
      // still
      // find whether searchQuery is zip code or city name
      // by using isNaN function
      // it returns true if it is string
      // false if it is number
      // TO-DO : need more work here
      if (isNaN(searchQuery)) {
        // call city search
        // console.log("calling city api");
        const data = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${process.env.REACT_APP_API_KEY}`
        );

        setWeatherData(data.data);
        setSearchQuery("");
        setSearchError(false);
      } else {
        // call zip code search
        // console.log("calling zip api");
        const zipCode = parseInt(searchQuery);
        const data = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},IN&appid=${process.env.REACT_APP_API_KEY}`
        );

        setWeatherData(data.data);
        setSearchQuery("");
        setSearchError(false);
      }
    } catch (error) {
      setErrorMessage(error.response.statusText);
      setSearchError(true);
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchQuery(event.target.value);
  };

  const onClickSearch = async () => {
    // I may need to split the string if it is provided with comma
    // for the country code like 500001, IN
    if (searchQuery === "") {
      setErrorMessage("Enter any location");
      setSearchError(true);
    } else {
      fetchWeatherData();
    }
  };
  const onPressEnter = (event) => {
    if (event.key === "Enter") {
      fetchWeatherData();
    }
  };

  const setPinnedList = () => {
    const id = weatherData.id;
    // checking whether same id is already in pinned data
    // if found
    // update with new data
    const pastDataIndex = pinnedData.findIndex(
      (eachWeatherData) => eachWeatherData.id === id
    );
    if (pastDataIndex === -1) {
      setPinnedData([...pinnedData, weatherData]);
      setWeatherData({});
    } else {
      const newPinnedList = pinnedData.map((eachWeather) => {
        if (eachWeather.id === id) {
          return { ...weatherData };
        } else {
          return eachWeather;
        }
      });
      setPinnedData([...newPinnedList]);
      setWeatherData({});
    }
  };

  const unPinLocation = (id) => {
    const filteredList = pinnedData.filter(
      (eachWeather) => eachWeather.id !== id
    );
    setPinnedData([...filteredList]);
  };

  const renderPinnedData = () =>
    pinnedData.map((eachWeather) => (
      <WeatherCard
        key={eachWeather.id}
        data={eachWeather}
        unPinLocation={unPinLocation}
        pinned
      />
    ));

  const displayData = Object.keys(weatherData).length !== 0;
  const displayPinnedData = pinnedData.length !== 0;

  return (
    <div>
      <div className="navbar">
        <h1 className="navbar-title">Weather</h1>
        <div className="search-box-with-error">
          <div className="search-box">
            <input
              type="text"
              onChange={onChangeSearchInput}
              onKeyDown={onPressEnter}
              value={searchQuery}
              placeholder="Enter Location"
              className="search-input"
            />
            <button
              className="search-button"
              type="button"
              onClick={onClickSearch}
            >
              <CiSearch />
            </button>
          </div>

          {serachError && <p className="error-msg">{errorMessage}</p>}
        </div>
      </div>

      {displayData && (
        <div className="search-results">
          <WeatherCard data={weatherData} setPinnedList={setPinnedList} />
        </div>
      )}
      {displayPinnedData && (
        <div className="saved-locations-div">
          <h3>Saved Locations</h3>
          <ul className="pinned-list">{renderPinnedData()}</ul>
        </div>
      )}
    </div>
  );
}

export default App;
