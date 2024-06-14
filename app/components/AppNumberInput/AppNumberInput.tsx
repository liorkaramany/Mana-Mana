import { StyleProp, TextStyle, View, ViewStyle } from "react-native";
import { AppTextInput, AppTextInputProps } from "../AppTextInput";
import { styles } from "./styles";
import Feather from "@expo/vector-icons/Feather";
import { AppButton } from "../AppButton";

export type AppNumberInputProps = Omit<AppTextInputProps, "style"> & {
  style?: StyleProp<ViewStyle>;
  textInputStyle?: StyleProp<TextStyle>;
  min?: number;
  max?: number;
  allowDecimal?: boolean;
};

const iconsSizes: Record<NonNullable<AppNumberInputProps["size"]>, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

export const AppNumberInput = (props: AppNumberInputProps) => {
  const {
    min,
    max,
    allowDecimal = false,
    style,
    textInputStyle,
    radius = "md",
    size = "md",
    ...rest
  } = props;

  const stylesWithParameters = styles({ size, radius });

  return (
    <View style={[stylesWithParameters.container, style]}>
      <AppTextInput
        radius="no"
        style={[stylesWithParameters.input, textInputStyle]}
        size={size}
        {...rest}
      />
      <View style={stylesWithParameters.buttonsContainer}>
        <AppButton
          variant="neutral"
          radius="no"
          size="sm"
          style={stylesWithParameters.button}
          title={<Feather name="chevron-up" size={iconsSizes[size]} />}
        />
        <AppButton
          variant="neutral"
          radius="no"
          size="sm"
          style={stylesWithParameters.button}
          title={<Feather name="chevron-down" size={iconsSizes[size]} />}
        />
      </View>
    </View>
  );
};
