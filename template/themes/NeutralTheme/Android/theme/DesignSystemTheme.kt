package replace

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.core.view.WindowCompat
import replace.DesignSystemColorScheme.Companion.getColorSchemeDark
import replace.DesignSystemColorScheme.Companion.getColorSchemeLight
import replace.DesignSystemDimensions.Companion.getDimensionsExpressiveMobile
import replace.DesignSystemDimensions.Companion.getDimensionsExpressiveTablet
import replace.DesignSystemDimensions.Companion.getDimensionsFunctionalMobile
import replace.DesignSystemDimensions.Companion.getDimensionsFunctionalTablet
import replace.DesignSystemDimensions.Companion.getDimensionsRegularMobile
import replace.DesignSystemDimensions.Companion.getDimensionsRegularTablet
import replace.DesignSystemTextStyles.Companion.getTextStyles
import replace.DesignSystemTypography.Companion.getTypographyExpressiveMobile
import replace.DesignSystemTypography.Companion.getTypographyExpressiveTablet
import replace.DesignSystemTypography.Companion.getTypographyFunctionalMobile
import replace.DesignSystemTypography.Companion.getTypographyFunctionalTablet
import replace.DesignSystemTypography.Companion.getTypographyRegularMobile
import replace.DesignSystemTypography.Companion.getTypographyRegularTablet
import replace.core.DSDensity
import replace.neutral.NeutralTheme


object DesignSystemTheme {
    val colors: DesignSystemColorScheme
        @Composable
        @ReadOnlyComposable
        get() = LocalColors.current

    val activeColor: DSColorVariant
        @Composable
        @ReadOnlyComposable
        get() = LocalActiveColor.current

    val dimensions: DesignSystemDimensions
        @Composable
        @ReadOnlyComposable
        get() = LocalDimensions.current

    val typography: DesignSystemTextStyles
        @Composable
        @ReadOnlyComposable
        get() = LocalTypography.current
}

interface DSTheme {
    val colorMap: Map<String, Color>
    val dimensionsMap: Map<String, Dp>
    val typographyMap: Map<String, TextUnit>
}

internal val LocalTheme = staticCompositionLocalOf<DSTheme> { NeutralTheme }

@Composable
fun DesignSystemTheme(
    theme: DSTheme = NeutralTheme,
    density: DSDensity = DSDensity.REGULAR,
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val isTablet = LocalConfiguration.current.screenWidthDp > 768
    // typography
    val typography: DesignSystemTextStyles = when(isTablet) {
        true ->
            when (density) {
                DSDensity.FUNCTIONAL -> getTextStyles(getTypographyFunctionalTablet(theme.typographyMap))
                DSDensity.EXPRESSIVE -> getTextStyles(getTypographyExpressiveTablet(theme.typographyMap))
                else -> getTextStyles(getTypographyRegularTablet(theme.typographyMap))
            }

        else -> when (density) {
            DSDensity.FUNCTIONAL -> getTextStyles(getTypographyFunctionalMobile(theme.typographyMap))
            DSDensity.EXPRESSIVE -> getTextStyles(getTypographyExpressiveMobile(theme.typographyMap))
            else -> getTextStyles(getTypographyRegularMobile(theme.typographyMap))
        }
    }

    // screen
    val dimensions: DesignSystemDimensions = when(isTablet) {
        true ->
            when (density) {
                DSDensity.FUNCTIONAL -> getDimensionsFunctionalTablet(theme.dimensionsMap)
                DSDensity.EXPRESSIVE -> getDimensionsExpressiveTablet(theme.dimensionsMap)
                else -> getDimensionsRegularTablet(theme.dimensionsMap)
            }

        else -> when (density) {
            DSDensity.FUNCTIONAL -> getDimensionsFunctionalMobile(theme.dimensionsMap)
            DSDensity.EXPRESSIVE -> getDimensionsExpressiveMobile(theme.dimensionsMap)
            else -> getDimensionsRegularMobile(theme.dimensionsMap)
        }
    }

    // colors
    val colorScheme: DesignSystemColorScheme = when {
        darkTheme -> getColorSchemeDark(theme.colorMap)
        else -> getColorSchemeLight(theme.colorMap)
    }
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.neutral.bgBasicLevel1Default.toArgb()
            window.navigationBarColor = colorScheme.neutral.bgBasicLevel1Default.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = darkTheme
        }
    }

    CompositionLocalProvider(
        LocalTheme provides theme,
        LocalColors provides colorScheme,
        LocalDimensions provides dimensions,
        LocalTypography provides typography,
    ) {
        content()
    }
}
