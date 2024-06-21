import { Recipe } from "@/app/models/recipe";
import { User } from "@/app/models/user";
import { AppCard, AppCardProps } from "../AppCard";
import { AppText } from "../AppText";

export type RecipeWithAuthor = Omit<Recipe, "author"> & { author: User };

export type RecipeCardProps = Pick<
  AppCardProps,
  "radius" | "imageResizeMode" | "style" | "imageStyle" | "contentStyle"
> & { recipe: RecipeWithAuthor };

export const RecipeCard = (props: RecipeCardProps) => {
  const { recipe, ...rest } = props;

  const ingredientsList = recipe.ingredients
    .map((ingredient) => `\u2022 ${ingredient.name}: ${ingredient.amount}`)
    .join("\n");

  const instructionsList = recipe.instructions
    .map((instruction, index) => `${index + 1}. ${instruction}`)
    .join("\n");

  return (
    <AppCard {...rest} image={recipe.image ?? undefined}>
      <AppText type="defaultSemiBold">{recipe.title}</AppText>
      <AppText>Ingredients</AppText>
      <AppText numberOfLines={4}>{ingredientsList}</AppText>
      <AppText>Instructions</AppText>
      <AppText numberOfLines={4}>{instructionsList}</AppText>
    </AppCard>
  );
};
