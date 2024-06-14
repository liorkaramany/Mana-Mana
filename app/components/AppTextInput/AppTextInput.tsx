import { Radius } from "@/app/config/Radius";
import { TextInput, TextInputProps } from "react-native";
import { styles } from "./styles";

export type TextInputSize = "sm" | "md" | "lg";

export type AppTextInputProps = TextInputProps & {
  size?: TextInputSize;
  radius?: keyof typeof Radius;
};

export const AppTextInput = (props: AppTextInputProps) => {
  const { size = "md", radius = "md", style, ...rest } = props;

  const stylesWithParameters = styles({ size, radius });

  return (
    <TextInput {...rest} style={[stylesWithParameters.container, style]} />
  );
};
