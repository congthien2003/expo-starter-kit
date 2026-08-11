import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Platform, StyleSheet, View } from "react-native";

import { ExternalLink } from "@/components/external-link";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Collapsible } from "@/components/ui/collapsible";
import { Typography } from "@/components/ui/typography";

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerClassName="bg-neutral-200"
      headerImage={
        <Ionicons
          size={310}
          color="#808080"
          name="code-slash"
          style={styles.headerImage}
        />
      }>
      <View className="flex-row gap-2">
        <Typography variant="h1" className="font-sans">
          Explore
        </Typography>
      </View>

      <Typography>This app includes example code to help you get started.</Typography>

      <Collapsible title="File-based routing">
        <Typography>
          This app has two screens:{" "}
          <Typography weight="semibold">app/(tabs)/index.tsx</Typography> and{" "}
          <Typography weight="semibold">app/(tabs)/explore.tsx</Typography>.
        </Typography>
        <Typography>
          The layout file in{" "}
          <Typography weight="semibold">app/(tabs)/_layout.tsx</Typography> sets up
          the tab navigator.
        </Typography>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <Typography color="primary">Learn more</Typography>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="Android, iOS, and web support">
        <Typography>
          You can open this project on Android, iOS, and the web. To open the web
          version, press <Typography weight="semibold">w</Typography> in the
          terminal running this project.
        </Typography>
      </Collapsible>

      <Collapsible title="Images">
        <Typography>
          For static images, you can use the{" "}
          <Typography weight="semibold">@2x</Typography> and{" "}
          <Typography weight="semibold">@3x</Typography> suffixes to provide files
          for different screen densities.
        </Typography>
        <Image
          source={require("@/assets/images/react-logo.png")}
          className="h-24 w-24 self-center"
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <Typography color="primary">Learn more</Typography>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="Styling with NativeWind">
        <Typography>
          Colors, spacing, and typography are applied with NativeWind utility
          classes backed by tailwind.config.js.
        </Typography>
        <ExternalLink href="https://www.nativewind.dev/">
          <Typography color="primary">Learn more</Typography>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="Animations">
        <Typography>
          This template includes an example of an animated component. The{" "}
          <Typography weight="semibold">components/hello-wave.tsx</Typography>{" "}
          component uses the powerful{" "}
          <Typography weight="semibold" className="font-mono">
            react-native-reanimated
          </Typography>{" "}
          library to create a waving hand animation.
        </Typography>
        {Platform.select({
          ios: (
            <Typography>
              The{" "}
              <Typography weight="semibold">
                components/parallax-scroll-view.tsx
              </Typography>{" "}
              component provides a parallax effect for the header image.
            </Typography>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -90,
    left: -35,
    position: "absolute",
  },
});
