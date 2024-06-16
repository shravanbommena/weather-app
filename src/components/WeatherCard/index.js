import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";
import "./index.css";

const WeatherCard = (props) => {
  //   console.log(props);
  const { data, setPinnedList, unPinLocation, pinned } = props;
  const convertDtValueToDateTime = (dt) => {
    let unix_timestamp = dt;

    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds
    var date = new Date(unix_timestamp * 1000);

    let n = date.toLocaleString([], {
      hour12: true,
      hour: "numeric",
      minute: "2-digit",
    });
    const dateFormat =
      date.toLocaleString("default", { month: "short" }) +
      " " +
      date.getDate() +
      ", " +
      n;
    return dateFormat;
  };

  const convertKelvinToCelcius = (temp) => {
    const celciusTemp = temp - 273.15;
    // rounds the number to two decimals
    return Math.round(celciusTemp * 100) / 100;
  };

  const onClickPin = () => {
    if (pinned) {
      unPinLocation(data.id);
    } else {
      setPinnedList(data);
    }
  };

  const iconId = data.weather[0].icon;

  return (
    <li className="weather-card">
      <div>
        <p>{convertDtValueToDateTime(data.dt)}</p>
        <h2>{data.name}</h2>
        <p>{data.weather[0].description}</p>
        <p>Humidity: {data.main.humidity} %</p>
        <p>Wind: {data.wind.speed}m/s </p>
      </div>

      <div className="weather-data">
        <img
          src={`https://openweathermap.org/img/wn/${iconId}@2x.png`}
          alt="weather icon"
          width={100}
          height={100}
        />
        <h3 className="weather-temp">
          {convertKelvinToCelcius(data.main.temp)}
          °C
        </h3>
      </div>
      <button className="pin-button" type="button" onClick={onClickPin}>
        {pinned ? <BsPinAngleFill /> : <BsPinAngle />}
      </button>
    </li>
  );
};

export default WeatherCard;
