import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity, // Import TouchableOpacity
  FlatList, // Import FlatList
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Import the Icon component

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [minTemp, setMinTemp] = useState(null);
  const [maxTemp, setMaxTemp] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]); // State to manage favorite cities
  const apiKey = "30dfa75838e79633cb75c970876ec7b4";

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("City name cannot be empty");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();

      if (data.cod === "404") {
        setError("City not found");
        setWeather(null);
      } else {
        setWeather(data);
        setMinTemp(data.main.temp_min);
        setMaxTemp(data.main.temp_max);
        setError("");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching the weather data");
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = () => {
    if (weather && !favorites.some((fav) => fav.name === weather.name)) {
      setFavorites([...favorites, weather]);
    }
  };

  const removeFavorite = (cityName) => {
    setFavorites(favorites.filter((fav) => fav.name !== cityName));
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "Clear":
        return { name: "weather-sunny", color: "#FFD700" }; // Gold
      case "Clouds":
        return { name: "weather-cloudy", color: "#B0C4DE" }; // LightSteelBlue
      case "Rain":
        return { name: "weather-rainy", color: "#1E90FF" }; // DodgerBlue
      case "Snow":
        return { name: "weather-snowy", color: "#00BFFF" }; // DeepSkyBlue
      default:
        return { name: "weather-cloudy", color: "#B0C4DE" }; // LightSteelBlue
    }
  };

  return (
    <LinearGradient colors={["#8ec9fb", "#005bff"]} style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.content}>
        <Text style={styles.title}></Text>
        <TextInput
          style={styles.input}
          placeholder="Enter city"
          value={city}
          onChangeText={setCity}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button title="Get Weather" onPress={fetchWeather} />
        {loading && (
          <ActivityIndicator size="large" color="#fff" style={styles.loading} />
        )}
        {weather && weather.main && (
          <View style={styles.weatherContainer}>
            <View style={styles.weatherContainer}>
              <Text style={styles.title}>{weather.name}</Text>
              <Icon
                name={getWeatherIcon(weather.weather[0].main).name}
                size={60}
                color={getWeatherIcon(weather.weather[0].main).color}
              />
              <Text style={styles.weatherText}>{weather.weather[0].main}</Text>
              <View style={styles.minMax}>
                <Text style={styles.weatherText}>
                  Min: {Math.floor(minTemp)}°C
                </Text>
                <Text style={styles.weatherText}>
                  Max: {Math.floor(maxTemp)}°C
                </Text>
              </View>
            </View>
            <View style={styles.weatherDetails}>
              <Text style={styles.weatherText}>
                Temperature: {Math.floor(weather.main.temp)}°C
              </Text>
              <Text style={styles.weatherText}>
                Condition: {weather.weather[0].description}
              </Text>
              <Text style={styles.weatherText}>
                Feels like: {Math.floor(weather.main.feels_like)}°
              </Text>
              <Text style={styles.weatherText}>
                Humidity: {Math.floor(weather.main.humidity)}%
              </Text>
              <Text style={styles.weatherText}>
                Wind speed: {Math.floor(weather.wind.speed)} m/s
              </Text>
            </View>
            <TouchableOpacity
              onPress={addFavorite}
              style={styles.favoriteButton}
            >
              <Text style={styles.favoriteButtonText}>Add to Favorites</Text>
            </TouchableOpacity>
          </View>
        )}
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.favoriteItem}>
              <Text style={styles.favoriteText}>{item.name}</Text>
            </View>
          )}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "start",
    padding: 20,
  },
  content: {
    width: "100%",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    color: "#fff",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
  loading: {
    marginTop: 20,
  },
  weatherContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  weatherText: {
    fontSize: 18,
    color: "#fff",
  },
  weatherDetails: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 20,
    padding: 50,
  },
  minMax: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  favoriteButton: {
    marginTop: 20,
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 10,
  },
  favoriteButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  favoriteItem: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  favoriteText: {
    fontSize: 18,
    color: "#000",
  },
});