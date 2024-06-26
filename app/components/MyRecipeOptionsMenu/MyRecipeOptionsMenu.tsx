import Feather from "@expo/vector-icons/Feather";
import { TouchableHighlight, TouchableOpacity } from "react-native";
import Popover from "react-native-popover-view";
import { AppText } from "../AppText";
import { styles } from "./styles";
import { useRef, useState } from "react";

export type MyRecipeOptionsMenuProps = {
  recipeId: string;
  onEdit?: (recipeId: string) => void;
  onDelete?: (recipeId: string) => void;
};

export const MyRecipeOptionsMenu = (props: MyRecipeOptionsMenuProps) => {
  const { recipeId, onEdit, onDelete } = props;

  const touchable = useRef(null);

  return (
    <>
      <TouchableOpacity ref={touchable} onPress={() => onEdit(recipeId)}>
        <Feather name="delete" size={24} />
      </TouchableOpacity>
    </>
  );
};
