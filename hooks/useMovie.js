import { useMemo, useContext } from "react";
import { MovieContext } from "../context/MovieContext";

export const useMovie = () => {
  const { favorites, toggleFavorite } = useContext(MovieContext);
  const favoritesIds = useMemo(
    () => favorites.map((movie) => movie.id),
    [favorites]
  );

  return { toggleFavorite, favorites, favoritesIds };
};
