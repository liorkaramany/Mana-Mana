import { ActivityIndicator, Modal, View } from "react-native";
import { AppText } from "../AppText";
import { styles } from "./styles";
import { Colors } from "@/app/config/Colors";

export type SignOutModalLoadingProps = {
  visible?: boolean;
};

export const SignOutModalLoading = (props: SignOutModalLoadingProps) => {
  const { visible = false } = props;

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ActivityIndicator color={Colors.tint} size={48} />
          <AppText style={styles.modalText}>Signing out...</AppText>
        </View>
      </View>
    </Modal>
  );
};
