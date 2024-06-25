import Feather from "@expo/vector-icons/Feather";
import { TouchableHighlight, TouchableOpacity } from "react-native";
import Popover from "react-native-popover-view";
import { AppText } from "../AppText";
import { styles } from "./styles";
import { useState } from "react";

export type HeaderOptionsMenuProps = {
  onSignOut?: () => void;
};

export const HeaderOptionsMenu = (props: HeaderOptionsMenuProps) => {
  const { onSignOut } = props;

  const [showPopover, setShowPopover] = useState<boolean>(false);

  return (
    <Popover
      popoverStyle={styles.popover}
      isVisible={showPopover}
      onRequestClose={() => setShowPopover(false)}
      from={
        <TouchableOpacity onPress={() => setShowPopover(true)}>
          <Feather name="more-vertical" size={24} />
        </TouchableOpacity>
      }
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
    </Popover>
  );
};
