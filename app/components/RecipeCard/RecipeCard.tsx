import { Recipe } from "@/app/models/recipe";
import { User } from "@/app/models/user";
import { Image, View } from "react-native";
import { AppCard, AppCardProps } from "../AppCard";
import { AppText } from "../AppText";
import { styles } from "./styles";
import { UserWithAvatar } from "../UserWithAvatar";
import { AppButton } from "../AppButton";
import Feather from "@expo/vector-icons/Feather";

export type RecipeWithAuthor = Omit<Recipe, "author"> & { author: User };

export type RecipeCardProps = Pick<
  AppCardProps,
  "radius" | "imageResizeMode" | "style" | "imageStyle" | "contentStyle"
> & {
  recipe: RecipeWithAuthor;
  onEdit?: () => void;
  onDelete?: () => void;
  withActions?: boolean;
};

export const RecipeCard = (props: RecipeCardProps) => {
  const { recipe, onEdit, onDelete, withActions = false, ...rest } = props;

  const ingredientsList = recipe.ingredients
    .map((ingredient) => `\u2022 ${ingredient.name}: ${ingredient.amount}`)
    .join("\n");

  const instructionsList = recipe.instructions
    .map((instruction, index) => `${index + 1}. ${instruction}`)
    .join("\n");

  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        <UserWithAvatar name={recipe.author.name} image={recipe.author.image} />
        {withActions && (
          <View style={styles.actionButtons}>
            <AppButton
              onPress={onEdit}
              variant="neutral"
              size="sm"
              style={styles.actionButton}
              title={<Feather name="edit-2" size={20} />}
            />
            <AppButton
              onPress={onDelete}
              variant="neutral"
              size="sm"
              style={styles.actionButton}
              title={<Feather name="trash-2" size={20} />}
            />
          </View>
        )}
      </View>
      <AppCard {...rest} image={recipe.image ?? undefined}>
        <AppText type="defaultSemiBold">{recipe.title}</AppText>
        <AppText>Ingredients</AppText>
        <AppText numberOfLines={4}>{ingredientsList}</AppText>
        <AppText>Instructions</AppText>
        <AppText numberOfLines={4}>{instructionsList}</AppText>
      </AppCard>
    </View>
  );
};
