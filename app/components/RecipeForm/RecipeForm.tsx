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
import { AppText } from "../AppText";

export type RecipeFormValueType = Omit<Recipe, "author" | "image"> & {
  image?: Recipe["image"];
};

export type RecipeFormReturnType = Omit<Recipe, "author">;

export type RecipeFormProps = {
  categoryResponse: CategoryResponse;
  recipe?: RecipeFormValueType;
  onRecipeFormSubmit?: (recipe: RecipeFormReturnType) => void;
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

  const [wasSubmitPressed, setWasSubmitPressed] = useState<boolean>(false);

  useEffect(() => {
    if (recipe != null) {
      setInnerRecipe(recipe);
    }
  }, [recipe]);

  const emptyTitle = innerRecipe.title.length === 0;
  const noTags = innerRecipe.tags.length === 0;
  const emptyInstructionsExist = innerRecipe.instructions.some(
    (instruction) => instruction.length === 0
  );
  const emptyIngredientsExist = innerRecipe.ingredients.some(
    (ingredient) => ingredient.name.length === 0 || ingredient.amount === 0
  );
  const noImage = innerRecipe.image == null;
  const invalidRecipe =
    emptyTitle ||
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

  const handleSubmit = () => {
    if (!wasSubmitPressed) {
      setWasSubmitPressed(true);
    }

    if (!invalidRecipe) {
      onRecipeFormSubmit?.({ ...innerRecipe, image: innerRecipe.image! });
    }
  };

  return (
    <View style={style}>
      <View style={styles.title}>
        <AppTextInput
          placeholder="Recipe Title"
          size="lg"
          value={innerRecipe.title}
          onChangeText={getInnerRecipePropertySetter("title")}
        />
        {wasSubmitPressed && emptyTitle && (
          <AppText style={styles.errorText}>Title cannot be empty</AppText>
        )}
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View>
          <AppImagePicker
            imageUri={innerRecipe.image}
            onChangeImageUri={getInnerRecipePropertySetter("image")}
          />
          {wasSubmitPressed && noImage && (
            <AppText style={styles.errorText}>Image must be picked</AppText>
          )}
        </View>
        <RecipeFormSection title="Tags">
          <AppMultiSelect
            items={categoryResponse.categories}
            uniqueKey="strCategory"
            displayKey="strCategory"
            selectedItems={innerRecipe.tags}
            onSelectedItemsChange={getInnerRecipePropertySetter("tags")}
          />
          {wasSubmitPressed && noTags && (
            <AppText style={styles.errorText}>
              At least one tag has to be picked
            </AppText>
          )}
        </RecipeFormSection>
        <RecipeFormSection title="Ingredients">
          <EditableIngredients
            ingredients={innerRecipe.ingredients}
            onIngredientsChange={getInnerRecipePropertySetter("ingredients")}
          />
          {wasSubmitPressed && emptyIngredientsExist && (
            <AppText style={styles.errorText}>
              Every ingredient has to have a description and a positive amount
            </AppText>
          )}
        </RecipeFormSection>
        <RecipeFormSection title="Instructions">
          <EditableInstructions
            instructions={innerRecipe.instructions}
            onInstructionsChange={getInnerRecipePropertySetter("instructions")}
          />
          {wasSubmitPressed && emptyInstructionsExist && (
            <AppText style={styles.errorText}>
              Every instruction has to have content
            </AppText>
          )}
        </RecipeFormSection>
        <AppButton
          title={recipeFormSubmitText}
          onPress={handleSubmit}
          size="lg"
          style={styles.uploadButton}
        />
      </ScrollView>
    </View>
  );
};
