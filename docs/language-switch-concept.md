# Language Switch – Konzept

## Ziel

Die gesamte Plattform soll auf Deutsch und Englisch verfügbar sein. Ein Toggle in der Shell schaltet zwischen den Sprachen um. Default ist Englisch.

---

## Architektur-Entscheidung: Astro i18n Routing (URL-basiert)

- EN-Seiten leben auf Root: `/products-and-services/foundations`
- DE-Seiten unter `/de/`-Prefix: `/de/products-and-services/foundations`
- Statischer Build, kein Server-Rendering nötig
- Astro's eingebautes i18n mit `prefixDefaultLocale: false`
- Fallback: Wenn eine DE-Seite nicht existiert, redirected die Middleware auf EN

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
- Klick navigiert zur `/de/...` oder `/...` Variante der aktuellen Seite (URL-basiert, kein Reload)

---

## UI-Strings

```
template/i18n/
├── translations.ts    ← Typen + Lookup
├── en.ts              ← Shell-Strings EN
├── de.ts              ← Shell-Strings DE
└── useTranslation.ts  ← Hook: t('key')
```

Abgedeckt: Navigation Labels, Tooltips, Button-Texte. Der Hook liest die Sprache aus der URL (`/de/` Prefix = deutsch).

---

## Navigation

- `NavigationItem` hat ein `titleDe`-Feld (automatisch aus `content/pages/de/` Frontmatter gelesen)
- NavItem zeigt `titleDe` wenn die aktuelle Locale DE ist
- Locale wird aus `window.location.pathname` abgeleitet
- Nav-Links werden mit `/de/`-Prefix versehen wenn auf DE-Seiten
- Brand-Logo verlinkt auf `/de/` wenn auf DE-Seiten

---

## Locale-Awareness in Astro-Komponenten

Astro-Komponenten (Footer, ContactUsSection) erkennen die Sprache über `Astro.url.pathname` und zeigen den passenden Text. Home-Sections nutzen Props mit EN-Defaults – die DE-Seite übergibt die deutschen Texte.

---

## Implementierungs-Status

### Implementiert

- Astro i18n-Config (locales, fallback de→en)
- LanguageContext + Provider (Sprache aus URL)
- LanguageSwitch-Komponente (navigiert per URL)
- i18n Dictionary (en/de) mit useTranslation Hook
- Shell-Integration (SecondaryActions)
- NavItem mit titleDe-Support (dynamisch aus DE-Frontmatter)
- Nav-Links + Brand locale-aware
- Footer locale-aware (Impressum/Datenschutz, Links mit Prefix)
- ContactUsSection locale-aware
- Home-Sections parametrierbar (Props für Texte)
- Middleware für dev Fallback (404 auf /de/ → EN redirect)
- DE-Content: Home, Products & Services, About Us, Legal

### Noch offen

- Documentation-Bereich übersetzen
- Weitere Bereiche nachziehen (nach Bedarf)

---

## Tonalität (DE)

Für den Management-Bereich (Products & Services) gilt:

- **Stilvoll, souverän** – Bahn-politisch korrekt, reputationswürdig, seriös, dienend
- **Faktisch, rational** – Faktenbasiert, kurz und auf den Punkt, keine Plattitüden
- **Klar, direkt** – Einfache Sprache, keine Abkürzungen ohne Erklärung, vertraut

Inklusiv gendern (z.B. "Designer:innen", "Entwickler:innen").
