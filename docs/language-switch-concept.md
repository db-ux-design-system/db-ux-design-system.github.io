# Language Switch – Konzept

## Ziel

Die gesamte Plattform soll auf Deutsch und Englisch verfügbar sein. Ein Toggle in der Shell schaltet zwischen den Sprachen um. Default ist Englisch.

---

## Architektur-Entscheidung: Astro i18n Routing (URL-basiert)

- EN-Seiten leben auf Root: `/products-and-services/foundations`
- DE-Seiten unter `/de/`-Prefix: `/de/products-and-services/foundations`
- Statischer Build, kein Server-Rendering nötig
- Astro's eingebautes i18n mit `prefixDefaultLocale: false`
- Fallback: Wenn eine DE-Seite nicht existiert, wird auf EN redirected

## Content-Struktur

```
content/pages/
├── products-and-services/foundations.mdx          ← EN (Root)
└── de/products-and-services/foundations.mdx       ← DE (/de/...)
```

Jede Seite kann unabhängig übersetzt werden. Nicht-übersetzte Seiten fallen auf EN zurück.

---

## Toggle-Komponente

> **Status: TBD** – Die konkrete Umsetzung wird noch diskutiert. Es gibt weitere Ideen neben dem hier beschriebenen Ansatz.

- Workaround bis eine dedizierte Language-Switcher-Komponente im Design System verfügbar ist
- Aktueller Ansatz: Ghost-Button mit `translation`-Icon in den Secondary Actions
- Zeigt die Zielsprache als Text ("DE" oder "EN")
- Klick navigiert zur `/de/...` oder `/...` Variante der aktuellen Seite
- Zusätzlich: `localStorage` speichert Präferenz für die nächste Session

---

## UI-Strings

```
template/i18n/
├── translations.ts    ← Typen + Lookup
├── en.ts              ← Shell-Strings EN
├── de.ts              ← Shell-Strings DE
└── useTranslation.ts  ← Hook: t('key')
```

Abgedeckt: Navigation Labels, Tooltips, Button-Texte, Footer. Der Hook liest die Sprache aus der URL (`/de/` Prefix = deutsch).

---

## Navigation

- `NavigationItem` hat ein `titleDe`-Feld
- NavItem zeigt `titleDe` wenn die aktuelle Locale DE ist
- Locale wird aus `window.location.pathname` abgeleitet (kein Context nötig für statische Seiten)

---

## Implementierungs-Status

### Bereits implementiert (geparkt auf `feat--language-switcher`)

- LanguageContext + Provider
- i18n Dictionary (en/de) mit useTranslation Hook
- LanguageSwitch-Komponente
- Shell-Integration (SecondaryActions)
- NavItem mit titleDe-Support
- UI-Strings übersetzt (Menü, Tooltip, Contact Us)

### Noch offen

- `astro.config.mjs` i18n-Config hinzufügen
- DE-Content unter `content/pages/de/` anlegen
- Toggle: Navigation statt Reload (`/de/current-path` ↔ `/current-path`)
- Locale aus URL statt localStorage ableiten
- Fallback-Handling (Redirect oder Notification wenn DE nicht existiert)
- Footer übersetzen

---

## Tonalität (DE)

Für den Management-Bereich (Products & Services) gilt:

- **Stilvoll, souverän** – Bahn-politisch korrekt, reputationswürdig, seriös, dienend
- **Faktisch, rational** – Faktenbasiert, kurz und auf den Punkt, keine Plattitüden
- **Klar, direkt** – Einfache Sprache, keine Abkürzungen ohne Erklärung, vertraut

Inklusiv gendern (z.B. "Designer:innen", "Entwickler:innen").
