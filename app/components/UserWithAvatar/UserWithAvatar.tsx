import { User } from "@/app/models/user";
import { Image, View } from "react-native";
import { AppText } from "../AppText";
import { styles } from "./styles";

export type UserWithAvatarProps = User;

export const UserWithAvatar = (props: UserWithAvatarProps) => {
  const { image, name } = props;

  return (
    <View style={styles.container}>
      <Image resizeMode="cover" style={styles.image} source={{ uri: image }} />
      <AppText type="title" style={styles.name}>
        {name}
      </AppText>
    </View>
  );
};
