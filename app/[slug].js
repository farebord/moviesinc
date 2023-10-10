import {
  Button,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button as IconButton } from "react-native-paper";
import FAIcons from "@expo/vector-icons/FontAwesome5";
import { useLocalSearchParams, Link, useNavigation } from "expo-router";
import { useEffect, useState, useLayoutEffect } from "react";
import config from "../config";
import { fetchTmdb } from "../util/tmdb";
import { getYear } from "../util/dates";
import { useAuth } from "../hooks/useAuth";
import { UserMenu } from "../components/UserMenu";
import { useMovie } from "../hooks/useMovie";

export default function MovieDetail() {
  const navigation = useNavigation();
  const { isAuthenticated, login, session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [actorsLoading, setActorsLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(true);
  const [justVoted, setJustVoted] = useState(false);
  const { slug } = useLocalSearchParams();
  const [movie, setMovie] = useState();
  const [actors, setActors] = useState([]);
  const [rating, setRating] = useState(0);
  const [similarMovies, setSimilarMovies] = useState([]);
  const { toggleFavorite, favoritesIds } = useMovie();

  const handleVote = (rating) => {
    fetchTmdb(
      config.tmdbUrls.movie + "/" + slug + "/rating",
      {
        method: "POST",
        body: JSON.stringify({ value: rating * 2 }),
      },
      session
    )
      .then((res) => res.json())
      .then(() => {
        setJustVoted(true);
        fetchMovie();
        setRating(rating);
      });
  };

  const fetchMovie = async () => {
    return fetchTmdb(config.tmdbUrls.movie + "/" + slug)
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);
        setLoading(false);
      });
  };

  const fetchActors = async () => {
    return fetchTmdb(config.tmdbUrls.movie + "/" + slug + "/credits")
      .then((res) => res.json())
      .then((data) => data.cast)
      .then((data) => data.filter((c) => c.known_for_department === "Acting"))
      .then((data) => {
        setActors(data ?? []);
        setActorsLoading(false);
      });
  };

  const fetchSimilar = async () => {
    return fetchTmdb(config.tmdbUrls.movie + "/" + slug + "/similar")
      .then((res) => res.json())
      .then((json) => {
        setSimilarMovies(json.results);
      });
  };

  const fetchUserRating = async () => {
    return fetchTmdb(
      config.tmdbUrls.movie + "/" + slug + "/account_states",
      {},
      session
    )
      .then((res) => res.json())
      .then((data) => {
        setRating(Math.floor(data.rated.value / 2));
        setRatingLoading(false);
      });
  };

  useEffect(() => {
    fetchUserRating();
  }, [isAuthenticated]);

  useEffect(() => {
    if (slug) {
      fetchMovie();
      fetchActors();
      fetchSimilar();
    }
  }, [slug]);

  useLayoutEffect(() => {
    if (navigation)
      navigation.setOptions({
        headerBackTitleVisible: false,
        title: loading
          ? "Cargando..."
          : `${movie.title} (${getYear(movie.release_date)})`,
        headerRight: UserMenu,
      });
  }, [navigation, loading]);

  return (
    <ScrollView>
      {!loading && (
        <View style={styles.container}>
          <Image
            source={{ uri: config.tmdbUrls.poster + movie.poster_path }}
            resizeMode="contain"
            style={{ aspectRatio: 2 / 3 }}
          />
          <View>
            {!isAuthenticated ? (
              <View style={{ padding: 20 }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: 20,
                  }}
                >
                  Para poder puntar una pelicula debes estar autenticado.
                </Text>
                <Button onPress={() => login()} title="Ingresar">
                  Ingresar
                </Button>
              </View>
            ) : ratingLoading ? (
              <Text style={{ fontSize: 16, padding: 20, textAlign: "center" }}>
                Cargando puntuacion...
              </Text>
            ) : (
              <View style={styles.starsView}>
                {Array.from({ length: 5 }).map((star, index) => (
                  <Pressable
                    key={`vote-${index}`}
                    onPress={() => handleVote(index + 1)}
                  >
                    <FAIcons
                      name="star"
                      solid={rating > index}
                      size={28}
                      color="black"
                    />
                  </Pressable>
                ))}
              </View>
            )}
            {justVoted && (
              <Text style={{ textAlign: "center", marginBottom: 10 }}>
                La contabilización de votos y puntación no se refleja
                inmediatamente, será actualizada el siguiente día.
              </Text>
            )}
            {isAuthenticated && (
              <IconButton
                icon="star"
                onPress={() =>
                  toggleFavorite(movie.id, !favoritesIds.includes(movie.id))
                }
              >
                {favoritesIds.includes(movie.id)
                  ? "Quitar de favoritos"
                  : "Agregar a favoritos"}
              </IconButton>
            )}
          </View>
          <Text>
            <Text style={styles.bold}>Titulo:</Text> {movie.title}
          </Text>
          <Text>
            <Text style={styles.bold}>Año de estreno:</Text>{" "}
            {getYear(movie.release_date)}
          </Text>
          <Text>
            <Text style={styles.bold}>Descripción:</Text>{" "}
            {movie.overview === "" ? "Aún no disponible" : movie.overview}
          </Text>
          <Text>
            <Text style={styles.bold}>Genero:</Text>{" "}
            {movie.genres.map((genre) => genre.name).join(", ")}
          </Text>
          <Text>
            <Text style={styles.bold}>Calificación:</Text> {movie.vote_average}{" "}
            (
            {movie.vote_count === 1
              ? movie.vote_count + " voto"
              : movie.vote_count + " votos"}
            )
          </Text>
          <Text style={styles.bold}>Actores:</Text>
          <View style={styles.actorsView}>
            {actorsLoading ? (
              <Text>"Cargando..."</Text>
            ) : (
              actors.map((actor, index) => (
                <View
                  style={[
                    styles.actorView,
                    {
                      backgroundColor:
                        index % 2 === 0 ? "unset" : "rgba(0, 0, 0, 0.10)",
                    },
                  ]}
                  key={actor.cast_id}
                >
                  <Text>{actor.name}</Text>
                  <Text>
                    {actor.character === ""
                      ? "Aún no publicado"
                      : actor.character}
                  </Text>
                </View>
              ))
            )}
          </View>
          <Text style={styles.bold}>Peliculas similares (palabras clave):</Text>
          <View style={styles.similarView}>
            {similarMovies.map((similarMovie, index) => (
              <Link key={similarMovie.id} href={`/${similarMovie.id}`} asChild>
                <Pressable>
                  <Image
                    source={{
                      uri: config.tmdbUrls.poster + similarMovie.poster_path,
                    }}
                    resizeMode="contain"
                    style={{ aspectRatio: 2 / 3 }}
                  />
                </Pressable>
              </Link>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexShrink: 0,
    padding: 10,
    gap: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  starsView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  actorsView: {
    flexDirection: "column",
    flexWrap: "wrap",
  },
  actorView: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  similarView: {
    gap: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
