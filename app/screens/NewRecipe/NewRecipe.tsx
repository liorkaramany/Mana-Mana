import {
  CategoryResponse,
  CategoryResponseItem,
  categoriesApi,
} from "@/app/api/categoriesApi";
import { AppImagePicker } from "@/app/components/AppImagePicker";
import { AppMultiSelect } from "@/app/components/AppMultiSelect";
import { AppText } from "@/app/components/AppText";
import { AppTextInput } from "@/app/components/AppTextInput";
import { StackParamList } from "@/app/types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { styles } from "./styles";
import { EditableInstructions } from "@/app/components/EditableInstructions";

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
            <AppText type="defaultSemiBold">Instructions</AppText>
          </View>
        }
      />
    </View>
  );
};
