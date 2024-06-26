import { UserDetails } from "@/app/models/user";
import { Image, StyleProp, View, ViewStyle } from "react-native";
import { AppText } from "../AppText";
import { styles } from "./styles";

export type UserDetailsSectionProps = {
  userDetails: UserDetails;
  style?: StyleProp<ViewStyle>;
};

export const UserDetailsSection = (props: UserDetailsSectionProps) => {
  const { userDetails, style } = props;

  return (
    <View style={[styles.container, style]}>
      <Image
        source={
          userDetails?.image == null
            ? require("@/app/assets/images/default-user-icon.png")
            : { uri: userDetails.image }
        }
        style={styles.profileImage}
      />
      <AppText type="title" style={styles.name}>
        {userDetails?.name}
      </AppText>
    </View>
  );
};
