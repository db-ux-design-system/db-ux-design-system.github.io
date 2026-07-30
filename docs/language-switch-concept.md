# Language Switch – Konzept

## Ziel

Die gesamte Plattform soll auf Deutsch und Englisch verfügbar sein. Ein Popover-Menü in der Shell schaltet zwischen den Sprachen um. Englisch ist die Basissprache – alle Inhalte existieren auf Englisch. Fehlende DE-Seiten fallen auf den EN-Content zurück.

---

## Architektur-Entscheidung: Astro i18n Routing (URL-basiert)

- EN-Seiten leben auf Root: `/products-and-services/foundations`
- DE-Seiten unter `/de/`-Prefix mit übersetzten Slugs: `/de/produkte-und-services/foundation`
- Statischer Build, kein Server-Rendering nötig
- Astro's eingebautes i18n mit `prefixDefaultLocale: false`
- Fallback: Wenn eine DE-Seite nicht existiert, wird die EN-Version angezeigt (im Dev per Middleware-Rewrite, im Build per Instant-Redirect)

### Fallback-Strategie

Astro's `fallbackType: 'rewrite'` funktioniert im statischen Build nicht korrekt mit `client:only` React-Komponenten (erzeugt leere Response-Bodies). Daher wird der Fallback über zwei Mechanismen gelöst:

- **Dev-Server:** Middleware fängt 404 auf `/de/...` ab und macht einen `context.rewrite()` auf die EN-Route. Der User bleibt auf der `/de/`-URL.
- **Production-Build:** Eine Catch-All-Route (`de/[...slug].astro`) erzeugt für jede EN-Seite ohne DE-Pendant eine HTML-Seite mit Instant-Redirect (meta refresh 0s + JS) auf die EN-Version.

Diese Lösung ist temporär – perspektivisch werden alle Seiten DE-Varianten haben.

## Content-Struktur

```
content/pages/
├── products-and-services/foundations.mdx                ← EN (Root)
└── de/produkte-und-services/foundation.mdx             ← DE (/de/...)
```

URL-Pfade werden pro Sprache übersetzt. Ein bidirektionales Slug-Mapping (`template/i18n/slug-mapping.ts`) übersetzt Pfad-Segmente zwischen EN und DE.

Jede Seite kann unabhängig übersetzt werden. Nicht-übersetzte Seiten fallen auf EN zurück.

---

## Toggle-Komponente

- Popover-Menü mit Globe-Icon in den Secondary Actions
- Zeigt die aktuelle Sprache als Text ("EN" oder "DE")
- Klick auf einen Eintrag navigiert zur übersetzten URL-Variante der aktuellen Seite
- Nutzt `getLocalizedPath()` aus dem Slug-Mapping für korrekte Pfad-Übersetzung

---

## URL-Slug-Mapping

```
template/i18n/slug-mapping.ts
```

Bidirektionale Segment-Übersetzung. Beispiele:

| EN | DE |
|----|-----|
| `products-and-services` | `produkte-und-services` |
| `components` | `komponenten` |
| `for-developer` | `fuer-entwicklerinnen` |
| `legal` | `rechtliches` |
| `about-us` | `ueber-uns` |
| `foundation` | `foundation` (bleibt) |
| `pattern` | `pattern` (bleibt) |

Genutzt von: LanguageSwitch, NavItem, Footer, Catch-All-Fallback, Content-Navigation.

---

## UI-Strings

```
template/i18n/
├── translations.ts    ← Typen + Lookup
├── en.ts              ← Shell-Strings EN
├── de.ts              ← Shell-Strings DE
├── useTranslation.ts  ← Hook: t('key')
└── slug-mapping.ts    ← URL-Pfad-Übersetzung
```

Abgedeckt: Navigation Labels, Tooltips, Button-Texte. Der Hook liest die Sprache aus dem Pathname-Prop (übergeben von Astro an Shell → LanguageProvider).

---

## Navigation

- `NavigationItem` hat ein `titleDe`-Feld (automatisch aus `content/pages/de/` Frontmatter gelesen, via `toEnSlug()` dem EN-Pendant zugeordnet)
- NavItem zeigt `titleDe` wenn die aktuelle Locale DE ist
- Locale wird aus dem `pathname`-Prop abgeleitet (übergeben von Astro)
- Nav-Links werden mit `/de/`-Prefix und übersetzten Slugs versehen wenn auf DE-Seiten
- Brand-Logo verlinkt auf `/de/` wenn auf DE-Seiten

---

## Locale-Awareness in Astro-Komponenten

Astro-Komponenten (Footer, ContactUsSection) erkennen die Sprache über `Astro.url.pathname` und zeigen den passenden Text. Home-Sections nutzen Props mit EN-Defaults – die DE-Seite übergibt die deutschen Texte.

---

## Implementierungs-Status

### Implementiert

- Astro i18n-Config (locales: en/de, prefixDefaultLocale: false)
- LanguageProvider (Sprache aus pathname-Prop, SSR-safe)
- LanguageSwitch-Popover (navigiert per übersetzte URL)
- i18n Dictionary (en/de) mit useTranslation Hook
- Bidirektionales Slug-Mapping (EN ↔ DE Pfad-Segmente)
- Shell-Integration (SecondaryActions)
- NavItem mit titleDe-Support (dynamisch aus DE-Frontmatter via toEnSlug-Matching)
- Nav-Links mit übersetzten DE-Slugs
- Brand locale-aware
- Footer locale-aware (Impressum/Datenschutz mit deutschen Pfaden)
- ContactUsSection locale-aware
- Home-Sections parametrierbar (Props für Texte)
- Middleware für Dev-Fallback (Rewrite auf EN)
- Catch-All-Route für Build-Fallback (Redirect auf EN)
- DE-Content: Home, Produkte & Services, Über uns, Rechtliches

### Noch offen

- Documentation-Bereich übersetzen (wartet auf Refactoring-Branch)
- Weitere Bereiche nachziehen (nach Bedarf)

---

## Tonalität (DE)

Für den Management-Bereich (Products & Services) gilt:

- **Stilvoll, souverän** – Bahn-politisch korrekt, reputationswürdig, seriös, dienend
- **Faktisch, rational** – Faktenbasiert, kurz und auf den Punkt, keine Plattitüden
- **Klar, direkt** – Einfache Sprache, keine Abkürzungen ohne Erklärung, vertraut

Inklusiv gendern (z.B. "Designer:innen", "Entwickler:innen").
