import Feather from "@expo/vector-icons/Feather";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";
import { AppButton } from "../AppButton";
import { AppTextInput, AppTextInputProps } from "../AppTextInput";
import { styles } from "./styles";
import CurrencyInput, { CurrencyInputProps } from "react-native-currency-input";

export type AppNumberInputProps = Omit<CurrencyInputProps, "style"> &
  Pick<AppTextInputProps, "size" | "radius"> & {
    style?: StyleProp<ViewStyle>;
    textInputStyle?: StyleProp<TextStyle>;
  };

const iconsSizes: Record<NonNullable<AppNumberInputProps["size"]>, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

export const AppNumberInput = (props: AppNumberInputProps) => {
  const {
    style,
    textInputStyle,
    radius = "md",
    size = "md",
    precision = 0,
    ...rest
  } = props;

  const stylesWithParameters = styles({ size, radius });

  const incrementValue = () => {
    if (
      props.value != null &&
      (props.maxValue == null || props.value + 1 <= props.maxValue)
    ) {
      onChange(props.value + 1);
    }
  };

  const decrementValue = () => {
    if (
      props.value != null &&
      (props.minValue == null || props.value - 1 >= props.minValue)
    ) {
      onChange(props.value - 1);
    }
  };

  const onChange = (value: AppNumberInputProps["value"]) => {
    if (value != null) {
      props.onChangeValue?.(+value.toFixed(precision));
    }
  };

  return (
    <View style={[stylesWithParameters.container, style]}>
      <CurrencyInput
        onChangeValue={onChange}
        precision={precision}
        delimiter=","
        separator="."
        placeholder="u promised"
        style={[stylesWithParameters.input, textInputStyle]}
        renderTextInput={(textInputProps) => (
          <AppTextInput radius="no" size={size} {...textInputProps} />
        )}
        {...rest}
      />
      <View style={stylesWithParameters.buttonsContainer}>
        <AppButton
          variant="neutral"
          radius="no"
          size="sm"
          style={stylesWithParameters.button}
          title={<Feather name="chevron-up" size={iconsSizes[size]} />}
          onPress={incrementValue}
        />
        <AppButton
          variant="neutral"
          radius="no"
          size="sm"
          style={stylesWithParameters.button}
          title={<Feather name="chevron-down" size={iconsSizes[size]} />}
          onPress={decrementValue}
        />
      </View>
    </View>
  );
};
