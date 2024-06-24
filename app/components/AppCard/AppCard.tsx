import { Radius } from "@/app/config/Radius";
import { ReactNode } from "react";
import {
  Image,
  ImageResizeMode,
  ImageStyle,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { styles } from "./styles";

export type AppCardProps = {
  radius?: keyof typeof Radius;
  image?: string;
  children?: ReactNode;
  imageResizeMode?: ImageResizeMode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

export const AppCard = (props: AppCardProps) => {
  const {
    radius = "md",
    image,
    children,
    imageResizeMode = "cover",
    style,
    contentStyle,
    imageStyle,
  } = props;

  const stylesWithParameters = styles({ radius });

  return (
    <View style={[stylesWithParameters.container, style]}>
      {image != null && (
        <Image
          resizeMode={imageResizeMode}
          style={[stylesWithParameters.image, imageStyle]}
          src={image}
        />
      )}
      <View style={[stylesWithParameters.content, contentStyle]}>
        {children}
      </View>
    </View>
  );
};
