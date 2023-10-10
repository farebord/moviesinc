import {
  ScrollView,
  View,
  ImageBackground,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { useMovie } from "../hooks/useMovie";
import FAIcons from "@expo/vector-icons/FontAwesome5";
import { Link, useNavigation } from "expo-router";
import { formatDate } from "../util/dates";
import config from "../config";
import { useLayoutEffect } from "react";
import { UserMenu } from "../components/UserMenu";

export default function Favorites() {
  const navigation = useNavigation();
  const { favorites, toggleFavorite } = useMovie();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false,
      title: "Mis favoritos",
      headerRight: UserMenu,
    });
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.movies}>
        {favorites.map((movie) => (
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
                <View style={styles.favorite}>
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavorite(movie.id, false);
                    }}
                  >
                    <FAIcons name="star" size={28} solid color="black" />
                  </Pressable>
                </View>
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
