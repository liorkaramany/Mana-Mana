import { Colors } from "@/app/config/Colors";
import Color from "color";
import { Rating, SwipeRatingProps } from "react-native-ratings";

export type AppRatingProps = SwipeRatingProps;

export const AppRating = (props: AppRatingProps) => {
  const {
    showRating = false,
    fractions = 1,
    type = "custom",
    tintColor = Colors.white,
    ratingColor = Colors.tint,
    ratingBackgroundColor = Color(Colors.white).darken(0.15).toString(),
    jumpValue = 0.5,
    ...rest
  } = props;

  return (
    <Rating
      showRating={showRating}
      fractions={fractions}
      type={type}
      tintColor={tintColor}
      ratingColor={ratingColor}
      jumpValue={jumpValue}
      ratingBackgroundColor={ratingBackgroundColor}
      {...rest}
    />
  );
};
