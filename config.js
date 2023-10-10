export default {
  tmdbApiKey: process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN,
  tmdbUrls: {
    base: "https://api.themoviedb.org/3",
    trending: "https://api.themoviedb.org/3/trending/movie/day",
    poster: "https://image.tmdb.org/t/p/w500",
    movie: "https://api.themoviedb.org/3/movie",
    newToken: "https://api.themoviedb.org/3/authentication/token/new",
    newSession: "https://api.themoviedb.org/3/authentication/session/new",
    authenticate: "https://www.themoviedb.org/authenticate",
    account: "https://api.themoviedb.org/3/account",
    session: "https://api.themoviedb.org/3/authentication/session",
  },
};
