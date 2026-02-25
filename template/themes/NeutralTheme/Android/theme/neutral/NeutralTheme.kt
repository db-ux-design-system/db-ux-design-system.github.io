package replace.neutral

import replace.DSTheme
import replace.neutral.data.NeutralColorMap
import replace.neutral.data.NeutralDimensionsMap
import replace.neutral.data.NeutralTypographyMap

object NeutralTheme : DSTheme {
    override val colorMap = NeutralColorMap
    override val dimensionsMap = NeutralDimensionsMap
    override val typographyMap = NeutralTypographyMap
}
