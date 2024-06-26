import { Image, View } from "react-native";
import { AppText } from "../AppText";
import { styles } from "./styles";

export type UserWithAvatarProps = {
  image?: string | null;
  name: string;
};

export const UserWithAvatar = (props: UserWithAvatarProps) => {
  const { image = null, name } = props;

  return (
    <View style={styles.container}>
      <Image
        resizeMode="cover"
        style={styles.image}
        source={
          image == null
            ? require("../../assets/images/default-user-icon.png")
            : { uri: image }
        }
      />
      <AppText type="title" style={styles.name}>
        {name}
      </AppText>
    </View>
  );
};
