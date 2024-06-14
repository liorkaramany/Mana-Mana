import { Radius } from "@/app/config/Radius";
import Feather from "@expo/vector-icons/Feather";
import { ReactNode } from "react";
import SectionedMultiSelect, {
  SectionedMultiSelectProps,
} from "react-native-sectioned-multi-select";
import { styles } from "./styles";

export type MultiSelectSize = "sm" | "md" | "lg";

export type AppMultiSelectProps<T> = Omit<
  SectionedMultiSelectProps<T>,
  "IconRenderer"
> &
  Partial<Pick<SectionedMultiSelectProps<T>, "IconRenderer">> & {
    size?: MultiSelectSize;
    radius?: keyof typeof Radius;
  };

export const AppMultiSelect = <T,>(props: AppMultiSelectProps<T>) => {
  const { size = "md", radius = "md", ...rest } = props;

  const stylesWithParameters = styles({ size, radius });

  return (
    <SectionedMultiSelect
      icons={{
        search: { name: "search", size: 16 },
        arrowDown: { name: "chevron-down", size: 16 },
        arrowUp: { name: "chevron-up", size: 16 },
        cancel: { name: "x", size: 16 },
        check: { name: "check", size: 16 },
        close: { name: "x", size: 16 },
      }}
      IconRenderer={Feather as unknown as ReactNode}
      selectToggleIconComponent={<Feather name="chevron-down" size={16} />}
      styles={{
        selectToggle: stylesWithParameters.selectToggle,
        selectToggleText: stylesWithParameters.selectToggleText,
      }}
      {...rest}
    />
  );
};
