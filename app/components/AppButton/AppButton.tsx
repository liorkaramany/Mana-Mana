import { Pressable, PressableProps, Text } from "react-native";
import { styles } from "./styles";
import { Radius } from "@/app/config/Radius";

export type ButtonVariant = "primary" | "secondary" | "neutral";

export type AppButtonProps = PressableProps & {
  title: string;
  variant?: ButtonVariant;
  radius?: keyof typeof Radius;
};

export const AppButton = (props: AppButtonProps) => {
  const { title, radius = "md", variant = "primary", style, ...rest } = props;

  return (
    <Pressable
      style={({ pressed }) => [
        styles({ variant, radius }).container,
        pressed && styles({ variant, radius }).containerPressed,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
      {...rest}
    >
      <Text style={styles({ variant, radius }).title}>{title}</Text>
    </Pressable>
  );
};
