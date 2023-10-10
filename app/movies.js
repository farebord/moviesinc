import { useEffect, useMemo, useState, useLayoutEffect } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import config from "../config";
import { formatDate } from "../util/dates";
import { Link, useNavigation } from "expo-router";
import { fetchTmdb } from "../util/tmdb";
import FAIcons from "@expo/vector-icons/FontAwesome5";
import { useMovie } from "../hooks/useMovie";
import { UserMenu } from "../components/UserMenu";
import { useAuth } from "../hooks/useAuth";

export default function Films() {
  const navigation = useNavigation();
  const { toggleFavorite, favoritesIds } = useMovie();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [films, setFilms] = useState([]);

  useEffect(() => {
    fetchTmdb(config.tmdbUrls.trending)
      .then((res) => res.json())
      .then((data) => {
        setFilms(data.results);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const sortedFilms = useMemo(
    () => films.slice().sort((a, b) => (a.title > b.title ? 1 : -1)),
    [films]
  );

  useLayoutEffect(() => {
    if (navigation)
      navigation.setOptions({
        title: "Peliculas más vistas",
        headerRight: UserMenu,
      });
  }, [navigation, loading]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.movies}>
        {loading && <Text>Cargando...</Text>}

        {sortedFilms.map((movie) => (
          <Link key={movie.id} href={`/${movie.id}`} asChild>
            <Pressable>
              <ImageBackground
                style={styles.movieContainer}
                source={{
                  uri: config.tmdbUrls.poster + movie.poster_path,
                }}
                resizeMode="contain"
              >
                <View style={styles.movieDetails}>
                  <Text>
                    <Text style={styles.bold}>Titulo:</Text> {movie.title}
                  </Text>
                  <Text>
                    <Text style={styles.bold}>Fecha de estreno:</Text>{" "}
                    {formatDate(movie.release_date)}
                  </Text>
                  <Text>
                    <Text style={styles.bold}>Votos:</Text> {movie.vote_average}
                  </Text>
                </View>
                {isAuthenticated && (
                  <View style={styles.favorite}>
                    <Pressable
                      onTouchEnd={(e) => {
                        e.stopPropagation();
                        toggleFavorite(
                          movie.id,
                          !favoritesIds.includes(movie.id)
                        );
                      }}
                    >
                      <FAIcons
                        name="star"
                        size={28}
                        solid={favoritesIds.includes(movie.id)}
                        color="black"
                      />
                    </Pressable>
                  </View>
                )}
              </ImageBackground>
            </Pressable>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
  movies: {
    flex: 1,
    gap: 20,
    padding: 20,
  },
  movieContainer: {
    flex: 1,
    flexShrink: 0,
    aspectRatio: "2 / 3",
    position: "relative",
  },
  movieDetails: {
    position: "absolute",
    left: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderTopRightRadius: 10,
    padding: 10,
  },
  favorite: {
    position: "absolute",
    right: 0,
    bottom: 0,
    padding: 5,
    margin: 10,
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  bold: {
    fontWeight: "bold",
  },
});
