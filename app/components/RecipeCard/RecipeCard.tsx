import {
  FullRecipe,
  RecipeRatingNotFoundError,
  findRecipeRating,
} from "@/app/models/recipe";
import Feather from "@expo/vector-icons/Feather";
import { TouchableOpacity, View } from "react-native";
import { AppButton } from "../AppButton";
import { AppCard, AppCardProps } from "../AppCard";
import { AppRating } from "../AppRating";
import { AppText } from "../AppText";
import { UserWithAvatar } from "../UserWithAvatar";
import { styles } from "./styles";
import { UserViewModel } from "@/app/viewmodels/user";
import { UserDetails } from "@/app/models/user";
import { useAsyncFocused } from "@/app/hooks/useAsyncFocused";
import Toast from "react-native-toast-message";
import { AppLoadingOverlay } from "../AppLoadingOverlay";

export type RecipeCardProps = Pick<
  AppCardProps,
  "radius" | "imageResizeMode" | "style" | "imageStyle" | "contentStyle"
> & {
  recipe: FullRecipe;
  onEdit?: (recipeId: string) => void;
  onDelete?: (recipeId: string) => void;
  isInUserFeed?: boolean;
  onUserPressed?: (user: UserDetails) => void;
};

export const RecipeCard = (props: RecipeCardProps) => {
  const { recipe, onEdit, onDelete, isInUserFeed, onUserPressed, ...rest } =
    props;
  const { currentUser } = UserViewModel();

  const { loading: isRatingLoading, response: rating } = useAsyncFocused({
    action: () =>
      currentUser == null
        ? Promise.resolve(null)
        : findRecipeRating(recipe.id, currentUser.uid),
    dependencies: [recipe.id, currentUser?.uid],
  });

  const ingredientsList = recipe.ingredients
    .map((ingredient) => `\u2022 ${ingredient.name}: ${ingredient.amount}`)
    .join("\n");

  const instructionsList = recipe.instructions
    .map((instruction, index) => `${index + 1}. ${instruction}`)
    .join("\n");

  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        {!isInUserFeed && (
          <TouchableOpacity onPress={() => onUserPressed?.(recipe.author)}>
            <UserWithAvatar
              name={recipe.author.name}
              image={recipe.author.image}
            />
          </TouchableOpacity>
        )}
        {currentUser?.uid == recipe.author.id && (
          <View style={styles.actionButtons}>
            <AppButton
              onPress={() => onEdit && onEdit(recipe.id)}
              variant="neutral"
              size="sm"
              style={styles.actionButton}
              title={<Feather name="edit-2" size={20} />}
            />
            <AppButton
              onPress={() => onDelete && onDelete(recipe.id)}
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
        <AppLoadingOverlay
          loading={isRatingLoading}
          contentStyle={styles.ratingLoadingContent}
        >
          <AppRating
            fractions={0}
            startingValue={rating?.rating ?? 0}
            imageSize={32}
          />
        </AppLoadingOverlay>
      </AppCard>
    </View>
  );
};
