import { CategoryResponse } from "@/app/api/categoriesApi";
import { AppButton } from "@/app/components/AppButton";
import { AppImagePicker } from "@/app/components/AppImagePicker";
import { AppMultiSelect } from "@/app/components/AppMultiSelect";
import { AppTextInput } from "@/app/components/AppTextInput";
import { EditableIngredients } from "@/app/components/EditableIngredients";
import { EditableInstructions } from "@/app/components/EditableInstructions";
import { RecipeFormSection } from "@/app/components/RecipeFormSection";
import { DEFAULT_RECIPE_FORM } from "@/app/consts";
import { Recipe } from "@/app/models/recipe";
import { useEffect, useState } from "react";
import { ScrollView, StyleProp, View, ViewStyle } from "react-native";
import { styles } from "./styles";

export type RecipeFormValueType = Omit<Recipe, "author">;

export type RecipeFormProps = {
  categoryResponse: CategoryResponse;
  recipe?: RecipeFormValueType;
  onRecipeFormSubmit?: (recipe: RecipeFormValueType) => void;
  recipeFormSubmitText?: string;
  style?: StyleProp<ViewStyle>;
};

export const RecipeForm = (props: RecipeFormProps) => {
  const {
    categoryResponse,
    recipe,
    onRecipeFormSubmit,
    recipeFormSubmitText = "Upload",
    style,
  } = props;

  const [innerRecipe, setInnerRecipe] =
    useState<RecipeFormValueType>(DEFAULT_RECIPE_FORM);

  useEffect(() => {
    if (recipe != null) {
      setInnerRecipe(recipe);
    }
  }, [recipe]);

  const isTitleEmpty = innerRecipe.title.length === 0;
  const noTags = innerRecipe.tags.length === 0;
  const emptyInstructionsExist = innerRecipe.instructions.some(
    (instruction) => instruction.length === 0
  );
  const emptyIngredientsExist = innerRecipe.ingredients.some(
    (ingredient) => ingredient.name.length === 0 || ingredient.amount === 0
  );
  const noImage = innerRecipe.image == null;
  const disabledSubmitButton =
    isTitleEmpty ||
    noTags ||
    emptyInstructionsExist ||
    emptyIngredientsExist ||
    noImage;

  const getInnerRecipePropertySetter = <T extends keyof RecipeFormValueType>(
    property: T
  ) => {
    return (value: RecipeFormValueType[T]) =>
      setInnerRecipe({ ...innerRecipe, [property]: value });
  };

  return (
    <View style={style}>
      <AppTextInput
        placeholder="Recipe Title"
        size="lg"
        style={styles.title}
        value={innerRecipe.title}
        onChangeText={getInnerRecipePropertySetter("title")}
      />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <AppImagePicker
          imageUri={innerRecipe.image ?? undefined}
          onChangeImageUri={(value) =>
            getInnerRecipePropertySetter("image")(value ?? null)
          }
        />
        <RecipeFormSection title="Tags">
          <AppMultiSelect
            items={categoryResponse.categories}
            uniqueKey="strCategory"
            displayKey="strCategory"
            selectedItems={innerRecipe.tags}
            onSelectedItemsChange={getInnerRecipePropertySetter("tags")}
          />
        </RecipeFormSection>
        <RecipeFormSection title="Ingredients">
          <EditableIngredients
            ingredients={innerRecipe.ingredients}
            onIngredientsChange={getInnerRecipePropertySetter("ingredients")}
          />
        </RecipeFormSection>
        <RecipeFormSection title="Instructions">
          <EditableInstructions
            instructions={innerRecipe.instructions}
            onInstructionsChange={getInnerRecipePropertySetter("instructions")}
          />
        </RecipeFormSection>
        <AppButton
          disabled={disabledSubmitButton}
          title={recipeFormSubmitText}
          onPress={() => onRecipeFormSubmit?.(innerRecipe)}
          size="lg"
          style={styles.uploadButton}
        />
      </ScrollView>
    </View>
  );
};
