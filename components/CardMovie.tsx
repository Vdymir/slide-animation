import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
} from "react-native";
import React, { useEffect } from "react";
import { Character } from "@/interface/Characters.interface";
import Animated, {
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  type SharedValue,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColor } from "@/hooks/useThemeColor";
const { width, height } = Dimensions.get("screen");

interface Props {
  character: Character;
  translateX: SharedValue<number>;
  index: number;
}
const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

export default function CardCharacter({ character, translateX, index }: Props) {
  const opacity = useSharedValue(1);
  const statusColor = character.status === "Alive" ? "green" : "red";
  const backgroundColor = useThemeColor({}, "background");

  const cStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];
    const translateY = interpolate(translateX.value, inputRange, [0, -150, 0]);
    const opacity = interpolate(translateX.value, inputRange, [0, 1, 0]);
    const rotate = interpolate(translateX.value, inputRange, [0.5, 0, -0.5]);
    return {
      opacity,

      transform: [{ translateY }, { rotate: `${rotate}rad` }],
    };
  });

  const imgStyle = useAnimatedStyle(() => {
    const translateXImage = interpolate(
      translateX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [width, 0, width]
    );

    return {
      transform: [{ translateX: translateXImage }],
    };
  });

  useEffect(() => {
    opacity.value = withRepeat(withSpring(0.5, { duration: 800 }), -1, true);
    return () => {
      cancelAnimation(opacity);
    };
  }, []);

  return (
    <View>
      <AnimatedImageBackground
        source={{ uri: character.image }}
        style={[{ width, height: height / 1.8 }, imgStyle]}
      >
        <LinearGradient
          colors={["transparent", backgroundColor]}
          style={{
            height: height / 1.8,
          }}
        ></LinearGradient>
      </AnimatedImageBackground>
      <Animated.View style={[style.main, cStyle]}>
        <View style={style.card}>
          <Image source={{ uri: character.image }} style={style.image} />
          <View style={style.title_container}>
            <Text style={style.name}>{character.name}</Text>
            <Animated.View
              style={[
                style.status,
                {
                  opacity,
                  backgroundColor: statusColor,
                },
              ]}
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const style = StyleSheet.create({
  main: {
    width,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },
  card: {
    width: width * 0.8,
    height: 360,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#EEEEEE",
    gap: 10,
  },
  image: {
    width: "100%",
    height: 300,
  },
  title_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    fontStyle: "italic",
  },
  status: {
    width: 15,
    height: 15,
    borderRadius: 15,
  },
});
