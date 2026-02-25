package replace.db

import replace.DSTheme
import replace.db.data.DBColorMap
import replace.db.data.DBDimensionsMap
import replace.db.data.DBTypographyMap

object DBTheme : DSTheme {
    override val colorMap = DBColorMap
    override val dimensionsMap = DBDimensionsMap
    override val typographyMap = DBTypographyMap
}
