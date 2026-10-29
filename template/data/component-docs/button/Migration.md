#### General

> **Note**
> For a general installation or migration process check out this [documentation](https://www.npmjs.com/package/@db-ux/core-components).

#### DB UI Core ➡ DB UX Design System Core components

##### class

| Before       | Status | After       | Description |
| ------------ | :----: | ----------- | ----------- |
| `elm-button` |   🔁   | `db-button` |             |

##### sizes

| Before    | Status | After | Description                                                                                                                                                                                   |
| --------- | :----: | :---: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `large`   |   ❌   |  ❌   | it became obsolete mainly due to our [density](https://marketingportal.extranet.deutschebahn.com/marketingportal/Design-Anwendungen/db-ux-design-system-v3/principles/densities) introduction |
| `regular` |   ❌   |  ❌   | there is a default (`medium`) now                                                                                                                                                             |

##### variants

| Before              | Status | After      | Description                                                  |
| ------------------- | :----: | ---------- | ------------------------------------------------------------ |
| `primary`           |   ❌   | ❌         | not valid anymore, use `outlined` buttons for those purposes |
| `brand-primary`     |   🔁   | `primary`  |                                                              |
| `secondary-outline` |   🔁   | `outlined` |                                                              |
| `secondary-solid`   |   🔁   | `solid`    |                                                              |
| `tertiary-plain`    |   🔁   | `text`     |                                                              |

##### icons

| Before         | Status | After    | Description                                                       |
| -------------- | :----: | -------- | ----------------------------------------------------------------- |
| `iconTrailing` |   ❌   | ❌       | not valid anymore, for buttons only icons before text are allowed |
| `iconOnly`     |   🔁   | `noText` |                                                                   |
