import { AuthProvider } from "../context/AuthContext";
import { Stack } from "expo-router/stack";
import { PaperProvider } from "react-native-paper";
import { MovieProvider } from "../context/MovieContext";

const Layout = () => {
  return (
    <PaperProvider>
      <AuthProvider>
        <MovieProvider>
          <Stack />
        </MovieProvider>
      </AuthProvider>
    </PaperProvider>
  );
};

export default Layout;
