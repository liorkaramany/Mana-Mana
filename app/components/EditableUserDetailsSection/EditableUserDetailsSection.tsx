import { UserDetails } from "@/app/models/user";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { AppButton } from "../AppButton";
import { AppImagePicker } from "../AppImagePicker";
import { AppTextInput } from "../AppTextInput";
import { styles } from "./styles";
import { AppText } from "../AppText";

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
  const [wasConfirmPressed, setWasConfirmPressed] = useState<boolean>(false);

  const finalUserDetails = userDetails ?? innerUserDetails;
  const finalOnUserDetailsChange = onUserDetailsChange ?? setInnerUserDetails;

  const emptyName = finalUserDetails.name.length === 0;

  const invalidDetails = emptyName;

  const handleConfirmPress = () => {
    if (!wasConfirmPressed) {
      setWasConfirmPressed(true);
    }

    if (!invalidDetails) {
      onConfirm?.(finalUserDetails);
    }
  };

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
        <View style={styles.nameContainer}>
          <AppTextInput
            placeholder="Who are you?"
            size="lg"
            value={finalUserDetails.name}
            onChangeText={(name) =>
              finalOnUserDetailsChange({ ...finalUserDetails, name })
            }
          />
          {wasConfirmPressed && emptyName && (
            <AppText style={styles.errorText}>A name cannot be empty</AppText>
          )}
        </View>
      </View>
      <View style={styles.actionsContainer}>
        <AppButton
          onPress={handleConfirmPress}
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
