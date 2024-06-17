import {
  CategoryResponse,
  CategoryResponseItem,
  categoriesApi,
} from "@/app/api/categoriesApi";
import { AppImagePicker } from "@/app/components/AppImagePicker";
import { AppMultiSelect } from "@/app/components/AppMultiSelect";
import { AppText } from "@/app/components/AppText";
import { AppTextInput } from "@/app/components/AppTextInput";
import {
  DEFAULT_INGREDIENT,
  EditableIngredients,
} from "@/app/components/EditableIngredients";
import { EditableInstructions } from "@/app/components/EditableInstructions";
import { RecipeIngredient } from "@/app/models/recipe";
import { StackParamList } from "@/app/types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { styles } from "./styles";

export type UploadRecipeScreenProps = NativeStackScreenProps<
  StackParamList,
  "NewRecipe"
>;

export const NewRecipe = (props: UploadRecipeScreenProps) => {
  const { navigation, route } = props;

  const [categories, setCategories] = useState<CategoryResponse | undefined>();
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryResponseItem[]
  >([]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([
    { ...DEFAULT_INGREDIENT },
  ]);

  useEffect(() => {
    categoriesApi.getAllCategories().then(setCategories);
  }, []);

  return (
    <View style={styles.page}>
      <AppTextInput placeholder="Recipe Title" size="lg" />
      <EditableInstructions
        instructions={instructions}
        onInstructionsChange={setInstructions}
        ListHeaderComponent={
          <View style={styles.scrollView}>
            <AppImagePicker />
            <AppText type="defaultSemiBold">Tags</AppText>
            <AppMultiSelect
              items={categories?.categories}
              uniqueKey="idCategory"
              displayKey="strCategory"
              selectedItems={selectedCategories}
              onSelectedItemsChange={setSelectedCategories}
            />
            <AppText type="defaultSemiBold">Ingredients</AppText>
            <EditableIngredients
              ingredients={ingredients}
              onIngredientsChange={setIngredients}
            />
            <AppText type="defaultSemiBold">Instructions</AppText>
          </View>
        }
      />
    </View>
  );
};
