import { Colors } from "@/app/config/Colors";
import { ReactNode } from "react";
import { ActivityIndicator, StyleProp, View, ViewStyle } from "react-native";
import { styles } from "./styles";

export type AppLoadingOverlayProps = {
  children?: ReactNode;
  loading?: boolean;
  renderLoading?: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export const AppLoadingOverlay = (props: AppLoadingOverlayProps) => {
  const {
    children,
    loading = true,
    renderLoading,
    style,
    contentStyle,
  } = props;

  const finalRenderLoading =
    renderLoading != null ? (
      renderLoading
    ) : (
      <ActivityIndicator color={Colors.tint} size="large" />
    );

  return (
    <View
      pointerEvents={loading ? "none" : undefined}
      style={[styles.container, style]}
    >
      <View
        style={[loading && styles.loading, styles.contentWrapper, contentStyle]}
      >
        {children}
      </View>
      {loading && <View style={styles.indicator}>{finalRenderLoading}</View>}
    </View>
  );
};
