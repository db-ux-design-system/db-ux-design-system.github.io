import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";

type ColorMode = "light" | "dark";

interface ColorModeContextValue {
    colorMode: ColorMode;
    setColorMode: (colorMode: ColorMode) => void;
    toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue | undefined>(undefined);

export const ColorModeProvider = ({ children }: { children: ReactNode }) => {
    const [colorMode, setColorMode] = useState<ColorMode>("light");

    useEffect(() => {
        const stored = window.localStorage.getItem("db-ux-mode");
        if (stored === "light" || stored === "dark") {
            setColorMode(stored);
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem("db-ux-mode", colorMode);

        const shell = document.querySelector(".db-shell");
        if (shell instanceof HTMLElement) {
            shell.setAttribute("data-mode", colorMode);
        }
    }, [colorMode]);

    const setMode = (next: ColorMode) => {
        setColorMode(next);
    };

    const toggleColorMode = () => {
        setColorMode((prev) => (prev === "light" ? "dark" : "light"));
    };

    const value: ColorModeContextValue = { colorMode, setColorMode: setMode, toggleColorMode };

    return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
};

export const useColorMode = (): ColorModeContextValue => {
    const ctx = useContext(ColorModeContext);
    if (!ctx) {
        throw new Error("useColorMode must be used inside a ColorModeProvider");
    }
    return ctx;
};