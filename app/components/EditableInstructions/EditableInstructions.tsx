import { FlatList, FlatListProps } from "react-native";
import { EditableInstruction } from "../EditableInstruction/EditableInstruction";
import { styles } from "./styles";

export type EditableInstructionsProps = Pick<
  FlatListProps<string>,
  "ListHeaderComponent" | "ListFooterComponent"
> & {
  defaultInstructions?: string[];
  instructions?: string[];
  onInstructionsChange?: (instructions: string[]) => void;
};

export const EditableInstructions = (props: EditableInstructionsProps) => {
  const {
    instructions,
    onInstructionsChange,
    defaultInstructions = [""],
    ListHeaderComponent,
    ListFooterComponent,
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
    <FlatList
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      contentContainerStyle={styles.flatListContentContainer}
      data={finalInstructions}
      renderItem={({ item, index }) => (
        <EditableInstruction
          removeDisabled={finalInstructions.length === 1}
          instruction={item}
          key={index}
          onInstructionChange={(newInstruction) =>
            changeInstruction(index, newInstruction)
          }
          onAdd={() => addInstruction(index)}
          onRemove={() => removeInstruction(index)}
        />
      )}
    />
  );
};
