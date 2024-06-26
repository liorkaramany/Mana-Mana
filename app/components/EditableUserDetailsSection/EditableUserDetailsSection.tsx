import { UserDetails } from "@/app/models/user";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { AppButton } from "../AppButton";
import { AppImagePicker } from "../AppImagePicker";
import { AppTextInput } from "../AppTextInput";
import { styles } from "./styles";

export type EditableUserDetailsSectionValue = Pick<
  UserDetails,
  "name" | "image"
>;

export type EditableUserDetailsSectionProps = {
  userDetails?: EditableUserDetailsSectionValue;
  defaultUserDetails?: EditableUserDetailsSectionValue;
  onUserDetailsChange?: (userDetails: EditableUserDetailsSectionValue) => void;
  onConfirm?: (userDetails: EditableUserDetailsSectionValue) => void;
  onCancel?: () => void;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_USER_DETAILS: EditableUserDetailsSectionValue = {
  name: "",
  image: null,
};

export const EditableUserDetailsSection = (
  props: EditableUserDetailsSectionProps
) => {
  const {
    userDetails,
    onUserDetailsChange,
    defaultUserDetails = DEFAULT_USER_DETAILS,
    onConfirm,
    onCancel,
    style,
  } = props;

  const [innerUserDetails, setInnerUserDetails] =
    useState<EditableUserDetailsSectionValue>(defaultUserDetails);

  const finalUserDetails = userDetails ?? innerUserDetails;
  const finalOnUserDetailsChange = onUserDetailsChange ?? setInnerUserDetails;

  const emptyName = finalUserDetails.name.length === 0;

  const confirmDisabled = emptyName;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputs}>
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
      <View style={styles.actionsContainer}>
        <AppButton
          disabled={confirmDisabled}
          onPress={() => onConfirm?.(finalUserDetails)}
          variant="neutral"
          style={styles.actionButton}
          title={<Feather name="check" size={20} />}
        />
        <AppButton
          onPress={onCancel}
          variant="neutral"
          style={styles.actionButton}
          title={<Feather name="x" size={20} />}
        />
      </View>
    </View>
  );
};
