import CardMovie from "@/components/CardMovie";
import useFetchMovies from "@/hooks/useFetchMovies";

import { ActivityIndicator, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

export default function Index() {
  const { data } = useFetchMovies();
  const translateX = useSharedValue(0);

  const handlerScroll = useAnimatedScrollHandler((event) => {
    translateX.value = event.contentOffset.x;
  });

  return (
    <View>
      {!data ? (
        <ActivityIndicator />
      ) : (
        <View>
          <Animated.ScrollView
            horizontal
            onScroll={handlerScroll}
            scrollEventThrottle={16}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {data?.map((character, index) => (
              <CardMovie
                key={character.id}
                character={character}
                translateX={translateX}
                index={index}
              />
            ))}
          </Animated.ScrollView>
        </View>
      )}
    </View>
  );
}
