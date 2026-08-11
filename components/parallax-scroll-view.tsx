import type { PropsWithChildren, ReactElement } from 'react';
import { View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerClassName: string;
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerClassName,
}: Props) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <Animated.ScrollView
      ref={scrollRef}
      className="flex-1 bg-white"
      scrollEventThrottle={16}>
      <Animated.View
        className={`h-[250px] overflow-hidden ${headerClassName}`}
        style={headerAnimatedStyle}>
        {headerImage}
      </Animated.View>
      <View className="flex-1 gap-4 overflow-hidden p-8">{children}</View>
    </Animated.ScrollView>
  );
}
