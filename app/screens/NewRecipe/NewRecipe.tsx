import {
  CategoryResponse,
  CategoryResponseItem,
  categoriesApi,
} from "@/app/api/categoriesApi";
import { AppButton } from "@/app/components/AppButton";
import { AppImagePicker } from "@/app/components/AppImagePicker";
import { AppMultiSelect } from "@/app/components/AppMultiSelect";
import { AppText } from "@/app/components/AppText";
import { AppTextInput } from "@/app/components/AppTextInput";
import { EditableIngredients } from "@/app/components/EditableIngredients";
import { EditableInstructions } from "@/app/components/EditableInstructions";
import { DEFAULT_INGREDIENT } from "@/app/consts";
import { RecipeIngredient } from "@/app/models/recipe";
import { StackParamList } from "@/app/types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { styles } from "./styles";
import { NewRecipeSection } from "@/app/components/NewRecipeSection";

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

  const uploadRecipe = async () => {};

  return (
    <View style={styles.page}>
      <AppTextInput placeholder="Recipe Title" size="lg" style={styles.title} />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <AppImagePicker />
        <NewRecipeSection title="Tags">
          <AppMultiSelect
            items={categories?.categories}
            uniqueKey="idCategory"
            displayKey="strCategory"
            selectedItems={selectedCategories}
            onSelectedItemsChange={setSelectedCategories}
          />
        </NewRecipeSection>
        <NewRecipeSection title="Ingredients">
          <EditableIngredients
            ingredients={ingredients}
            onIngredientsChange={setIngredients}
          />
        </NewRecipeSection>
        <NewRecipeSection title="Instructions">
          <EditableInstructions
            instructions={instructions}
            onInstructionsChange={setInstructions}
          />
        </NewRecipeSection>
        <AppButton
          title="Upload"
          onPress={uploadRecipe}
          size="lg"
          style={styles.uploadButton}
        />
      </ScrollView>
    </View>
  );
};
