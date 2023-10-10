import { useFocusEffect, useRouter } from "expo-router";
export default function Index() {
  const router = useRouter();
  useFocusEffect(() => {
    router.replace("/movies");
  });

  return null;
}
