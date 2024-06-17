import { View } from "react-native";
import { styles } from "./styles";
import { AppTextInput } from "../AppTextInput";
import { AppButton } from "../AppButton";
import Feather from "@expo/vector-icons/Feather";

export type EditableInstructionProps = {
  instruction?: string;
  onInstructionChange?: (instruction: string) => void;
  defaultInstruction?: string;
  addDisabled?: boolean;
  removeDisabled?: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
};

export const EditableInstruction = (props: EditableInstructionProps) => {
  const {
    instruction,
    onInstructionChange,
    defaultInstruction,
    addDisabled,
    removeDisabled,
    onAdd,
    onRemove,
  } = props;

  return (
    <View style={styles.container}>
      <AppTextInput
        value={instruction}
        onChangeText={onInstructionChange}
        defaultValue={defaultInstruction}
        placeholder="Enter step"
        style={styles.textInput}
      />
      <AppButton
        disabled={addDisabled}
        onPress={onAdd}
        variant="neutral"
        style={styles.actionButton}
        title={<Feather name="plus" size={18} />}
      />
      <AppButton
        disabled={removeDisabled}
        onPress={onRemove}
        variant="neutral"
        style={styles.actionButton}
        title={<Feather name="minus" size={18} />}
      />
    </View>
  );
};
