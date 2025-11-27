import { DBSwitch, DBTooltip } from "@db-ux/react-core-components";
import { useColorMode } from "@template/context/color-mode-context.tsx";

const ColorModeSwitch = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const isDark = colorMode === "dark";

    return (
        <DBSwitch
            checked={isDark}
            visualAid
            icon="sun"
            iconTrailing="moon"
            showLabel={false}
            onChange={toggleColorMode}>
            <DBTooltip>
                Switch color scheme (light/dark)
            </DBTooltip>
            Switch color scheme (light/dark)
        </DBSwitch>
    );
};

export default ColorModeSwitch;