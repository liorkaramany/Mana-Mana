import { DEFAULT_INSTRUCTIONS } from "@/app/consts";
import { View } from "react-native";
import { EditableInstruction } from "../EditableInstruction/EditableInstruction";
import { styles } from "./styles";

export type EditableInstructionsProps = {
  defaultInstructions?: string[];
  instructions?: string[];
  onInstructionsChange?: (instructions: string[]) => void;
};

export const EditableInstructions = (props: EditableInstructionsProps) => {
  const {
    instructions,
    onInstructionsChange,
    defaultInstructions = DEFAULT_INSTRUCTIONS,
  } = props;

  const finalInstructions = instructions ?? defaultInstructions;

  const changeInstruction = (index: number, newInstruction: string) => {
    onInstructionsChange?.(finalInstructions.with(index, newInstruction));
  };

  const addInstruction = (index: number) => {
    onInstructionsChange?.(finalInstructions.toSpliced(index + 1, 0, ""));
  };

  const removeInstruction = (index: number) => {
    onInstructionsChange?.(finalInstructions.toSpliced(index, 1));
  };

  return (
    <View style={styles.container}>
      {finalInstructions.map((instruction, index) => (
        <EditableInstruction
          key={index}
          removeDisabled={finalInstructions.length === 1}
          instruction={instruction}
          onInstructionChange={(newInstruction) =>
            changeInstruction(index, newInstruction)
          }
          onAdd={() => addInstruction(index)}
          onRemove={() => removeInstruction(index)}
        />
      ))}
    </View>
  );
};
