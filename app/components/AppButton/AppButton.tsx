import { Pressable, PressableProps, Text, TextStyle } from "react-native";
import { styles } from "./styles";
import { Radius } from "@/app/config/Radius";

export type ButtonVariant = "primary" | "secondary" | "neutral";

export type ButtonSize = "sm" | "md" | "lg";

export type AppButtonProps = PressableProps & {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  radius?: keyof typeof Radius;
  titleStyle?: TextStyle;
};

export const AppButton = (props: AppButtonProps) => {
  const {
    title,
    variant = "primary",
    size = "md",
    radius = "md",
    titleStyle,
    style,
    ...rest
  } = props;

  return (
    <Pressable
      style={({ pressed }) => [
        styles({ variant, radius, size }).container,
        pressed && styles({ variant, radius, size }).containerPressed,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
      {...rest}
    >
      <Text style={[styles({ variant, radius, size }).title, titleStyle]}>
        {title}
      </Text>
    </Pressable>
  );
};
