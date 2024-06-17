import Feather from "@expo/vector-icons/Feather";
import { View } from "react-native";
import { AppButton } from "../AppButton";
import { AppNumberInput } from "../AppNumberInput";
import { styles } from "./styles";
import { AppTextInput } from "../AppTextInput";
import { RecipeIngredient } from "@/app/models/recipe";
import { DEFAULT_INGREDIENT } from "@/app/consts";

export type EditableIngredientProps = {
  ingredient?: RecipeIngredient;
  onIngredientChange?: (ingredient: RecipeIngredient) => void;
  defaultIngredient?: RecipeIngredient;
  defaultAmount?: number;
  addDisabled?: boolean;
  removeDisabled?: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
};

export const EditableIngredient = (props: EditableIngredientProps) => {
  const {
    ingredient,
    onIngredientChange,
    defaultIngredient = DEFAULT_INGREDIENT,
    addDisabled,
    removeDisabled,
    onAdd,
    onRemove,
  } = props;

  const finalIngredient = ingredient ?? defaultIngredient;

  return (
    <View style={styles.container}>
      <AppTextInput
        value={finalIngredient.name}
        onChangeText={(name) =>
          onIngredientChange?.({ ...finalIngredient, name })
        }
        defaultValue={defaultIngredient.name}
        placeholder="Enter ingredient"
        style={styles.textInput}
      />
      <AppNumberInput
        precision={1}
        minValue={0}
        value={finalIngredient.amount}
        onChangeValue={(amount) =>
          onIngredientChange?.({
            ...finalIngredient,
            amount: amount ?? defaultIngredient.amount,
          })
        }
        defaultValue={defaultIngredient.amount.toString()}
        style={styles.numberInput}
      />
      <AppButton
        disabled={addDisabled}
        onPress={onAdd}
        variant="neutral"
        style={styles.actionButton}
        title={<Feather name="plus" size={18} />}
      />
      <AppButton
        disabled={removeDisabled}
        onPress={onRemove}
        variant="neutral"
        style={styles.actionButton}
        title={<Feather name="minus" size={18} />}
      />
    </View>
  );
};
