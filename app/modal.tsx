import { Link } from "expo-router";
import { View } from "react-native";

import { Typography } from "@/components/ui/typography";

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white p-5">
      <Typography variant="h1">This is a modal</Typography>
      <Link href="/" dismissTo className="mt-4 py-4">
        <Typography color="primary">Go to home screen</Typography>
      </Link>
    </View>
  );
}
