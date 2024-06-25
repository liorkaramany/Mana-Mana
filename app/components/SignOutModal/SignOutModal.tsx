import { Modal, View } from "react-native";
import { AppButton } from "../AppButton";
import { AppText } from "../AppText";
import { styles } from "./styles";

export type SignOutModalProps = {
  visible?: boolean;
  onClose?: () => void;
  onSignOut?: () => void;
};

export const SignOutModal = (props: SignOutModalProps) => {
  const { visible = false, onClose, onSignOut } = props;

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
            Are you sure you want to sign out?
          </AppText>
          <View style={styles.actions}>
            <AppButton
              title="Sign out"
              onPress={() => {
                onClose?.();
                onSignOut?.();
              }}
            />
            <AppButton variant="neutral" title="Cancel" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};
