import { UserDetails } from "@/app/models/user";
import { useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { styles } from "./styles";
import { AppImagePicker } from "../AppImagePicker";
import { AppTextInput } from "../AppTextInput";
import Feather from "@expo/vector-icons/Feather";

export type EditableUserDetailsSectionValue = Pick<
  UserDetails,
  "name" | "image"
>;

export type EditableUserDetailsSectionProps = {
  userDetails?: EditableUserDetailsSectionValue;
  onUserDetailsChange?: (userDetails: EditableUserDetailsSectionValue) => void;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_USER_DETAILS: EditableUserDetailsSectionValue = {
  name: "",
  image: null,
};

export const EditableUserDetailsSection = (
  props: EditableUserDetailsSectionProps
) => {
  const { userDetails, onUserDetailsChange, style } = props;

  const [innerUserDetails, setInnerUserDetails] =
    useState<EditableUserDetailsSectionValue>(DEFAULT_USER_DETAILS);

  const finalUserDetails = userDetails ?? innerUserDetails;
  const finalOnUserDetailsChange = onUserDetailsChange ?? setInnerUserDetails;

  return (
    <View style={[styles.container, style]}>
      <AppImagePicker
        renderNoPermission={<Feather name="camera-off" size={28} />}
        renderUploadImage={<Feather name="upload" size={28} />}
        onChangeImageUri={(imageUri) =>
          finalOnUserDetailsChange({
            ...finalUserDetails,
            image: imageUri ?? null,
          })
        }
        imageUri={finalUserDetails.image ?? undefined}
        style={styles.profileImage}
        removeButtonStyle={styles.removeProfileImageButton}
      />
      <AppTextInput
        placeholder="Who are you?"
        size="lg"
        value={finalUserDetails.name}
        onChangeText={(name) =>
          finalOnUserDetailsChange({ ...finalUserDetails, name })
        }
        style={styles.name}
      />
    </View>
  );
};
