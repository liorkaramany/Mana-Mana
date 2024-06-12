import { Pressable, PressableProps, Text } from "react-native";
import { styles } from "./styles";
import { Radius } from "@/app/config/Radius";

export type ButtonVariant = "primary" | "secondary" | "neutral";

export type ButtonSize = "sm" | "md" | "lg";

export type AppButtonProps = PressableProps & {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  radius?: keyof typeof Radius;
};

export const AppButton = (props: AppButtonProps) => {
  const {
    title,
    radius = "md",
    variant = "primary",
    size = "md",
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
      <Text style={styles({ variant, radius, size }).title}>{title}</Text>
    </Pressable>
  );
};
