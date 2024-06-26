import Feather from "@expo/vector-icons/Feather";
import { TouchableHighlight, TouchableOpacity } from "react-native";
import Popover from "react-native-popover-view";
import { AppText } from "../AppText";
import { styles } from "./styles";
import { useRef, useState } from "react";

export type HeaderOptionsMenuProps = {
  onSignOut?: () => void;
  onMyAccount?: () => void;
};

export const HeaderOptionsMenu = (props: HeaderOptionsMenuProps) => {
  const { onSignOut, onMyAccount } = props;

  const touchable = useRef(null);
  const [showPopover, setShowPopover] = useState<boolean>(false);

  return (
    <>
      <TouchableOpacity ref={touchable} onPress={() => setShowPopover(true)}>
        <Feather name="more-vertical" size={24} />
      </TouchableOpacity>
      <Popover
        from={touchable}
        popoverStyle={styles.popover}
        isVisible={showPopover}
        onRequestClose={() => setShowPopover(false)}
      >
        <TouchableOpacity
          onPress={() => {
            setShowPopover(false);
            onSignOut?.();
          }}
          style={styles.option}
        >
          <AppText>Sign out</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setShowPopover(false);
            onMyAccount?.();
          }}
          style={styles.option}
        >
          <AppText>My Account</AppText>
        </TouchableOpacity>
      </Popover>
    </>
  );
};
