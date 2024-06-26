import Feather from "@expo/vector-icons/Feather";
import { TouchableOpacity, View } from "react-native";
import { useRef } from "react";

export type MyRecipeOptionsMenuProps = {
  recipeId: string;
  onEdit?: (recipeId: string) => void;
  onDelete?: (recipeId: string) => void;
};

export const MyRecipeOptionsMenu = (props: MyRecipeOptionsMenuProps) => {
  const { recipeId, onEdit, onDelete } = props;

  const touchable = useRef(null);

  return (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        ref={touchable}
        onPress={() => onDelete && onDelete(recipeId)}
        style={{ marginRight: 16 }}
      >
        <Feather name="trash" size={24} />
      </TouchableOpacity>
      <TouchableOpacity
        ref={touchable}
        onPress={() => onEdit && onEdit(recipeId)}
        style={{ marginRight: 16 }}
      >
        <Feather name="edit" size={24} />
      </TouchableOpacity>
    </View>
  );
};
