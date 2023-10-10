const { createContext, useState, useEffect } = require("react");
const { Alert } = require("react-native");
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import config from "../config";
import { fetchTmdb } from "../util/tmdb";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [account, setAccount] = useState(null);

  const login = async () => {
    if (!session) {
      const requestTokenResponse = await fetchTmdb(config.tmdbUrls.newToken);
      const requestTokenJson = await requestTokenResponse.json();
      const requestToken = requestTokenJson.request_token;
      const callbackUrl = Linking.createURL("/", {
        scheme: "moviesinc-scheme",
      });
      const result = await WebBrowser.openAuthSessionAsync(
        config.tmdbUrls.authenticate +
          `/${requestToken}?redirect_to=${callbackUrl}`,
        callbackUrl
      );
      if (result.type === "success") {
        const sessionResponse = await fetchTmdb(
          config.tmdbUrls.newSession,
          {
            method: "POST",
            body: JSON.stringify({ request_token: requestToken }),
          },
          null
        );
        const sessionJson = await sessionResponse.json();
        if (sessionJson.success) {
          setSession(sessionJson.session_id);
        } else {
          Alert.alert("Hubo un error al iniciar sesión. Intenta nuevamente.");
        }
      } else {
        Alert.alert("No logramos autenticarte. Intenta nuevamente.");
      }
    }
  };

  const logout = () => {
    fetchTmdb(
      config.tmdbUrls.session,
      {
        method: "DELETE",
        body: JSON.stringify({ session_id: session }),
      },
      session
    );
    setSession(null);
    setAccount(null);
  };

  useEffect(() => {
    if (!session) {
      fetchTmdb(config.tmdbUrls.account, {}, session)
        .then((res) => res.json())
        .then((json) => setAccount(json));
    }
  }, [session]);

  return (
    <AuthContext.Provider value={{ session, login, account, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
