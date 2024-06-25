import Feather from "@expo/vector-icons/Feather";
import { TouchableHighlight, TouchableOpacity } from "react-native";
import Popover from "react-native-popover-view";
import { AppText } from "../AppText";
import { styles } from "./styles";

export type HeaderOptionsMenuProps = {
  onSignOut?: () => void;
};

export const HeaderOptionsMenu = (props: HeaderOptionsMenuProps) => {
  const { onSignOut } = props;

  return (
    <Popover
      from={
        <TouchableOpacity>
          <Feather name="more-vertical" size={24} />
        </TouchableOpacity>
      }
    >
      <TouchableHighlight onPress={onSignOut} style={styles.option}>
        <AppText>Sign out</AppText>
      </TouchableHighlight>
    </Popover>
  );
};
