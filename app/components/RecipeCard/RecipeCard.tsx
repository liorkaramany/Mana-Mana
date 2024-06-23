import { FullRecipe } from "@/app/models/recipe";
import Feather from "@expo/vector-icons/Feather";
import { View } from "react-native";
import { AppButton } from "../AppButton";
import { AppCard, AppCardProps } from "../AppCard";
import { AppRating } from "../AppRating";
import { AppText } from "../AppText";
import { UserWithAvatar } from "../UserWithAvatar";
import { styles } from "./styles";

export type RecipeCardProps = Pick<
  AppCardProps,
  "radius" | "imageResizeMode" | "style" | "imageStyle" | "contentStyle"
> & {
  recipe: FullRecipe;
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
        <AppRating
          style={styles.rating}
          startingValue={recipe.rating ?? 0}
          readonly
          imageSize={32}
        />
      </AppCard>
    </View>
  );
};
