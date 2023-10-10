import { createContext, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { fetchTmdb } from "../util/tmdb";
import config from "../config";

const MovieContext = createContext();

const MovieProvider = ({ children }) => {
  const { session, account } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [favoritesFetched, setFavoritesFetched] = useState(false);

  const populateFavorites = (resultData, clean = false) => {
    setFavorites([...(clean ? [] : favorites), ...resultData]);

    if (resultData.total_pages !== resultData.page) {
      fetchTmdb(
        config.tmdbUrls.account + "/" + account.id + "/favorite",
        {},
        session
      )
        .then((res) => res.json())
        .then((data) => {
          populateFavorites(data.results);
        });
    }
  };

  useEffect(() => {
    if (session && account && !favoritesFetched) {
      fetchTmdb(
        config.tmdbUrls.account + "/" + account.id + "/favorite/movies",
        {},
        session
      )
        .then((res) => res.json())
        .then((data) => {
          setFavoritesFetched(true);
          populateFavorites(data.results);
        });
    }
  }, [session, account, favoritesFetched]);

  const toggleFavorite = (movieId, favorite) => {
    fetchTmdb(
      config.tmdbUrls.account + "/" + account.id + "/favorite",
      {
        method: "POST",
        body: JSON.stringify({
          media_type: "movie",
          media_id: movieId,
          favorite,
        }),
      },
      session
    );
    fetchTmdb(
      config.tmdbUrls.account + "/" + account.id + "/favorite/movies",
      {},
      session
    )
      .then((res) => res.json())
      .then((data) => {
        populateFavorites(data.results, true);
      });
  };

  return (
    <MovieContext.Provider value={{ toggleFavorite, favorites }}>
      {children}
    </MovieContext.Provider>
  );
};

export { MovieContext, MovieProvider };
