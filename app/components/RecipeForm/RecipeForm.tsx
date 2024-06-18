import { CategoryResponse, categoriesApi } from "@/app/api/categoriesApi";
import { AppButton } from "@/app/components/AppButton";
import { AppImagePicker } from "@/app/components/AppImagePicker";
import { AppMultiSelect } from "@/app/components/AppMultiSelect";
import { AppTextInput } from "@/app/components/AppTextInput";
import { EditableIngredients } from "@/app/components/EditableIngredients";
import { EditableInstructions } from "@/app/components/EditableInstructions";
import { NewRecipeSection } from "@/app/components/NewRecipeSection";
import { DEFAULT_RECIPE_FORM } from "@/app/consts";
import { Recipe } from "@/app/models/recipe";
import { useEffect, useState } from "react";
import { ScrollView, StyleProp, View, ViewStyle } from "react-native";
import { styles } from "./styles";

export type RecipeFormReturnType = Omit<Recipe, "id" | "author">;

export type RecipeFormProps = {
  categories: CategoryResponse;
  recipe?: Recipe;
  onRecipeFormSubmit?: (recipe: RecipeFormReturnType) => void;
  recipeFormSubmitText?: string;
  style?: StyleProp<ViewStyle>;
};

export const RecipeForm = (props: RecipeFormProps) => {
  const {
    categories,
    recipe,
    onRecipeFormSubmit,
    recipeFormSubmitText = "Upload",
    style,
  } = props;

  const [innerRecipe, setInnerRecipe] =
    useState<RecipeFormReturnType>(DEFAULT_RECIPE_FORM);

  useEffect(() => {
    if (recipe != null) {
      setInnerRecipe(recipe);
    }
  }, [recipe]);

  const getInnerRecipePropertySetter = <T extends keyof RecipeFormReturnType>(
    property: T
  ) => {
    return (value: RecipeFormReturnType[T]) =>
      setInnerRecipe({ ...innerRecipe, [property]: value });
  };

  return (
    <View style={style}>
      <AppTextInput placeholder="Recipe Title" size="lg" style={styles.title} />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <AppImagePicker
          imageUri={innerRecipe.image}
          onChangeImageUri={getInnerRecipePropertySetter("image")}
        />
        <NewRecipeSection title="Tags">
          <AppMultiSelect
            items={categories.categories}
            uniqueKey="idCategory"
            displayKey="strCategory"
            selectedItems={innerRecipe.tags}
            onSelectedItemsChange={getInnerRecipePropertySetter("tags")}
          />
        </NewRecipeSection>
        <NewRecipeSection title="Ingredients">
          <EditableIngredients
            ingredients={innerRecipe.ingredients}
            onIngredientsChange={getInnerRecipePropertySetter("ingredients")}
          />
        </NewRecipeSection>
        <NewRecipeSection title="Instructions">
          <EditableInstructions
            instructions={innerRecipe.instructions}
            onInstructionsChange={getInnerRecipePropertySetter("instructions")}
          />
        </NewRecipeSection>
        <AppButton
          title={recipeFormSubmitText}
          onPress={() => onRecipeFormSubmit?.(innerRecipe)}
          size="lg"
          style={styles.uploadButton}
        />
      </ScrollView>
    </View>
  );
};
