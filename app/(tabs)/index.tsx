import { Image } from "expo-image";
import { Link } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Typography } from "@/components/ui/typography";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerClassName="bg-primary-100"
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }>
      <View className="flex-row items-center gap-2">
        <Typography variant="h1">Welcome!</Typography>
        <HelloWave />
      </View>

      <View className="mb-2 gap-2">
        <Typography variant="h3">Step 1: Try it</Typography>
        <Typography>
          Edit{" "}
          <Typography weight="semibold">app/(tabs)/index.tsx</Typography> to see
          changes. Press{" "}
          <Typography weight="semibold">
            {Platform.select({
              ios: "cmd + d",
              android: "cmd + m",
              web: "F12",
            })}
          </Typography>{" "}
          to open developer tools.
        </Typography>
      </View>

      <View className="mb-2 gap-2">
        <Link href="/modal">
          <Link.Trigger>
            <Typography variant="h3">Step 2: Explore</Typography>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction
              title="Action"
              icon="cube"
              onPress={() => alert("Action pressed")}
            />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert("Share pressed")}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert("Delete pressed")}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <Typography>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </Typography>
      </View>

      <View className="mb-2 gap-2">
        <Typography variant="h3">Step 3: Get a fresh start</Typography>
        <Typography>
          {`When you're ready, run `}
          <Typography weight="semibold">npm run reset-project</Typography> to get
          a fresh <Typography weight="semibold">app</Typography> directory. This
          will move the current <Typography weight="semibold">app</Typography> to{" "}
          <Typography weight="semibold">app-example</Typography>.
        </Typography>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
