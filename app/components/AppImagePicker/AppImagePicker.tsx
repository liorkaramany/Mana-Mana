import { Radius } from "@/app/config/Radius";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Image,
  ImageResizeMode,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { AppButton } from "../AppButton";
import { AppText } from "../AppText";
import { styles } from "./styles";

export type AppImagePickerProps = {
  imageUri?: string;
  onChangeImageUri?: (imageUri: string | undefined) => void;
  resizeMode?: ImageResizeMode;
  disabled?: boolean;
  radius?: keyof typeof Radius;
  style?: StyleProp<ViewStyle>;
  removeButtonStyle?: StyleProp<ViewStyle>;
};

export const AppImagePicker = (props: AppImagePickerProps) => {
  const {
    imageUri,
    onChangeImageUri,
    resizeMode = "cover",
    disabled = false,
    radius = "md",
    style,
    removeButtonStyle,
  } = props;

  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  const [innerImageUri, setInnerImageUri] = useState<string | undefined>();

  const finalImageUri = imageUri ?? innerImageUri;
  const finalOnChangeImageUri = onChangeImageUri ?? setInnerImageUri;

  const stylesWithParameters = styles({ radius });

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      finalOnChangeImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={[stylesWithParameters.container, style]}>
      {!status?.granted ? (
        <AppButton
          disabled={disabled}
          onPress={requestPermission}
          variant="neutral"
          radius="no"
          title={
            <View style={stylesWithParameters.grantPermissionButtonContent}>
              <Feather name="image" size={24} />
              <AppText
                type="defaultSemiBold"
                style={stylesWithParameters.grantPermissionButtonContentText}
              >
                No camera permission granted{"\n"}press to grant or grant
                through the settings
              </AppText>
            </View>
          }
          style={stylesWithParameters.uploadImageButton}
        />
      ) : (
        <AppButton
          disabled={disabled}
          onPress={selectImage}
          variant="neutral"
          radius="no"
          title={
            finalImageUri != null ? (
              <Image
                resizeMode={resizeMode}
                source={{ uri: finalImageUri }}
                style={stylesWithParameters.image}
              />
            ) : (
              <View style={stylesWithParameters.uploadImageButtonContent}>
                <Feather name="upload" size={24} />
                <AppText
                  type="defaultSemiBold"
                  style={stylesWithParameters.uploadImageButtonContentText}
                >
                  Upload an image
                </AppText>
              </View>
            )
          }
          style={stylesWithParameters.uploadImageButton}
        />
      )}
      {status?.granted && finalImageUri != null && (
        <AppButton
          disabled={disabled}
          radius="xl"
          variant="neutral"
          style={[stylesWithParameters.removeImageButton, removeButtonStyle]}
          title={<Feather name="x" size={16} />}
          onPress={() => finalOnChangeImageUri(undefined)}
        />
      )}
    </View>
  );
};
