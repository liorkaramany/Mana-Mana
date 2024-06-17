import { DEFAULT_INGREDIENT } from "@/app/consts";
import { RecipeIngredient } from "@/app/models/recipe";
import { View } from "react-native";
import { EditableIngredient } from "../EditableIngredient/EditableIngredient";
import { styles } from "./styles";

export type EditableIngredientsProps = {
  ingredients?: RecipeIngredient[];
  onIngredientsChange?: (ingredients: RecipeIngredient[]) => void;
  defaultIngredients?: RecipeIngredient[];
};

export const EditableIngredients = (props: EditableIngredientsProps) => {
  const {
    ingredients,
    onIngredientsChange,
    defaultIngredients = [{ ...DEFAULT_INGREDIENT }],
  } = props;

  const finalIngredients = ingredients ?? defaultIngredients;

  const changeIngredient = (index: number, newIngredient: RecipeIngredient) => {
    onIngredientsChange?.(finalIngredients.with(index, newIngredient));
  };

  const addIngredient = (index: number) => {
    onIngredientsChange?.(
      finalIngredients.toSpliced(index + 1, 0, { ...DEFAULT_INGREDIENT })
    );
  };

  const removeIngredient = (index: number) => {
    onIngredientsChange?.(finalIngredients.toSpliced(index, 1));
  };

  return (
    <View style={styles.container}>
      {finalIngredients.map((ingredient, index) => (
        <EditableIngredient
          removeDisabled={finalIngredients.length === 1}
          key={index}
          ingredient={ingredient}
          onIngredientChange={(newIngredient) =>
            changeIngredient(index, newIngredient)
          }
          onAdd={() => addIngredient(index)}
          onRemove={() => removeIngredient(index)}
        />
      ))}
    </View>
  );
};
