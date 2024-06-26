import { Modal, View } from "react-native";
import { AppButton } from "../AppButton";
import { AppText } from "../AppText";
import { styles } from "./styles";

export type DeleteModalProps = {
  visible?: boolean;
  onClose?: () => void;
  onDelete?: () => void;
};

export const DeleteModal = (props: DeleteModalProps) => {
  const { visible = false, onClose, onDelete } = props;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <AppText style={styles.modalText}>
            Are you sure you want to delete this recipe?
          </AppText>
          <View style={styles.actions}>
            <AppButton
              title="Delete"
              onPress={() => {
                onClose?.();
                onDelete?.();
              }}
            />
            <AppButton variant="neutral" title="Cancel" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};
