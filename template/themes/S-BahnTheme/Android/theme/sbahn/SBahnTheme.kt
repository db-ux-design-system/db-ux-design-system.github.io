package replace.sbahn

import replace.DSTheme
import replace.sbahn.data.SBahnColorMap
import replace.sbahn.data.SBahnDimensionsMap
import replace.sbahn.data.SBahnTypographyMap

object SBahnTheme : DSTheme {
    override val colorMap = SBahnColorMap
    override val dimensionsMap = SBahnDimensionsMap
    override val typographyMap = SBahnTypographyMap
}
