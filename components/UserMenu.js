import { Pressable, View } from "react-native";
import { useAuth } from "../hooks/useAuth";
import FAIcons from "@expo/vector-icons/FontAwesome5";
import { Menu } from "react-native-paper";
import { useState, useLayoutEffect } from "react";
import { router } from "expo-router";

export const UserMenu = () => {
  const [loaded, setLoaded] = useState(false);
  const { account, isAuthenticated, login, logout } = useAuth();
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <View></View>;

  return (
    <Menu
      anchor={
        <Pressable
          onTouchEnd={() => {
            setVisible(true);
          }}
        >
          <FAIcons name="user-circle" size={24} color="black" />
        </Pressable>
      }
      visible={visible}
      onDismiss={() => setVisible(false)}
    >
      <View style={{ flex: 1 }}>
        {isAuthenticated ? (
          <>
            <Menu.Item
              leadingIcon="star"
              onPress={() => {
                router.push("/favorites");
                setVisible(false);
              }}
              title="Favoritos"
            />
            <Menu.Item
              leadingIcon="logout"
              onPress={() => {
                logout();
                setVisible(false);
              }}
              title="Salir"
            />
          </>
        ) : (
          <>
            <Menu.Item
              leadingIcon="login"
              onPress={() => {
                login();
                setVisible(false);
              }}
              title="Ingresar"
            />
          </>
        )}
      </View>
    </Menu>
  );
};
