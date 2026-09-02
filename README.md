# Plexglass

Eine **kinoreife Medienserver-Dashboard-Karte** für Home Assistant — für
**Plex**, **Jellyfin** und **Emby**. Aktive Streams mit Poster-Backdrop und
Live-Fortschritt, Mediathek-Statistiken, „Zuletzt hinzugefügt"-Regal,
Aktivitäts-Graph, Meistgesehen-Ranking und Overseerr/Jellyseerr-Anfragen —
im Look von Plex bzw. Tautulli, vollständig Theme-kompatibel (Light & Dark).

> Schwesterkarte zu [Weatherglass](https://github.com/BobMcGlobus/Weatherglass)
> und der [Health Card](https://github.com/BobMcGlobus/HealthCard) — gleiche
> Bedienung, gleiche Editor-Logik, nur fürs Heimkino.

## Features

- ▶️ **Läuft gerade** (`type: now_playing`): Jede aktive Wiedergabe als Poster-Karte mit **unscharfem Backdrop**, Titel/Episode (S7 · E48), **Nutzer-Avatar**, Abspielgerät, Pause-/Puffer-Badge und einem **live mitlaufenden Fortschrittsbalken** (Position wird sekündlich aus `media_position` extrapoliert — ganz ohne Polling). Media Player werden **automatisch erkannt** (`match`, Standard nach Marke) oder fest per `players` gesetzt. Dieselbe Wiedergabe, die von **zwei Integrationen** gemeldet wird (z. B. die Plex-Integration *und* der eigene Media Player des Fernsehers/Apple TV, auf dem die Plex-App läuft), wird **automatisch zusammengefasst** — anhand gleicher Laufzeit/Titel/Position, ohne zwei echte Zuschauer zu vermischen. Keine doppelten Karten mehr. Alternativ `layout: compact` für schmale Zeilen. Tautulli-Sensoren liefern die Kopfzeilen-Chips: **Stream-Anzahl, Direct Play, Transkodierung, Bandbreite**.
- 🗄️ **Mediathek** (`type: stats`): Bibliotheksgrößen als Kachel-Grid (Filme, Serien, Anime, …) mit Icon-Chips, lokalisierten Zahlen (1.473) und Formaten: `number`, `bytes` (18,4 TB), `duration`, `text`.
- 🆕 **Zuletzt hinzugefügt** (`type: recently_added`): horizontales **Poster-Regal** mit NEU-Badge (< 48 h) und „vor 6 Stunden"-Zeiten. Quelle wahlweise ein Sensor im [upcoming-media-card-Format](https://github.com/custom-cards/upcoming-media-card) **oder direkt die Plex-/Jellyfin-API** (`url` + `token` — Poster kommen dann direkt vom Server).
- 📈 **Aktivität** (`type: activity`): Stufen-Flächen-Chart der Stream-Anzahl mit **Zeitraum-Umschalter 24 h / 7 T / 30 T / 90 T** (`range`-Tabs), Jetzt/Spitzen-Chips. Kurze Fenster kommen aus der Recorder-History (WebSocket), **30 T/90 T aus den täglichen Langzeit-Statistiken** — die überleben das Purge-Fenster. Ranges frei konfigurierbar über `ranges`.
- 🔹 **Mini-Karte** (`custom:plexglass-mini-card`): eigenständige kompakte Badge für die **aktuelle Aktivität** — Stream-Anzahl groß, Direct-Play/Transkodierung/Bandbreite als Chips, Online-Punkt und eine **Sparkline** der letzten Stunden. Ideal für eine Übersichts-/Header-Zeile im Dashboard. Zählt entweder einen Tautulli-Sensor oder die aktiven Media Player.
- 🏆 **Meistgesehen** (`type: top`): Medaillen-Ranking (Gold/Silber/Bronze) aus den Tautulli-Sensoren Top Film / Top Serie / Top Nutzer.
- 📨 **Anfragen** (`type: requests`): Overseerr/Jellyseerr — Ausstehend/Genehmigt/In Arbeit/Verfügbar als Kacheln. Quelle: Sensoren (z. B. aus der Overseerr-Integration) oder direkt die API (`url` + `token`, ein Aufruf auf `/api/v1/request/count`).
- 🎨 **Marken-Akzente** (`brand`): Plex-Bernstein (Default), Jellyfin-Lila/Blau, Emby-Grün, Tautulli, Neutral (Theme-Farbe) — oder frei per `accent`. Die Marke steuert auch die Auto-Erkennung der Player.
- 📱 **Minimal-Modus** (`collapsed: true`): fürs mobile Dashboard schrumpft die Karte auf eine kompakte Vorschau — wer gerade streamt (eine Zeile pro Stream mit Nutzer) bzw. „Gerade läuft nichts". Ein **Tipp öffnet ein Popup** mit der kompletten Karte (alle Sektionen). Schließen per X, Hintergrund-Tipp oder Escape.
- 🟢 **Server-Status**: `status_entity` zeigt einen pulsierenden Online-Punkt neben dem Titel.
- 🎭 **5 Kartenstile** über `card_style`: Standard, Liquid Glass, Material You, Bubble, Magic Mirror — identisch zu Weatherglass/Health Card.
- 🫥 **Einbettbar**: `background: false` und `flush` für die Nutzung in Containern.
- 🖱️ **Visueller Editor**: Sektionen per UI hinzufügen, sortieren, konfigurieren — inklusive Zeilen-Editor für Entitäten (Name, Icon, Format).
- 🌍 Deutsch & Englisch (automatisch nach HA-Sprache).

## Installation

### HACS

1. HACS → *Custom repositories* → dieses Repository als Typ **Dashboard** hinzufügen
2. „Plexglass" installieren
3. Die Ressource wird automatisch registriert

### Manuell

1. [`dist/plexglass-card.js`](dist/plexglass-card.js) nach `config/www/plexglass-card.js` kopieren
2. *Einstellungen → Dashboards → ⋮ → Ressourcen* → `/local/plexglass-card.js` als **JavaScript-Modul** hinzufügen

## Voraussetzungen

| Datenquelle | Liefert | Hinweis |
| --- | --- | --- |
| [Plex-Integration](https://www.home-assistant.io/integrations/plex/) | `media_player`-Entitäten pro aktiver Wiedergabe (inkl. Poster) | Kern von `now_playing` |
| [Tautulli-Integration](https://www.home-assistant.io/integrations/tautulli/) | Stream-Anzahl, Direct Play/Transcode, Bandbreite, Top-Statistiken | Chips, `activity`, `top` |
| [Jellyfin-Integration](https://www.home-assistant.io/integrations/jellyfin/) | `media_player`-Entitäten | `brand: jellyfin` erkennt sie automatisch |
| Plex-/Jellyfin-API direkt | „Zuletzt hinzugefügt" mit Original-Postern | `url` + `token` in der Sektion |
| Overseerr/Jellyseerr | Anfrage-Zähler | Sensoren oder API (`url` + API-Key) |

Bibliotheksgrößen: In der Plex-Integration sind die Library-Sensoren
(`sensor.plex_<server>_library_*`) standardmäßig **deaktiviert** — unter
*Einstellungen → Geräte & Dienste → Plex → Entitäten* aktivieren.

## Konfiguration

Minimal (mit visueller Editor-Unterstützung):

```yaml
type: custom:plexglass-card
title: Plex
sections:
  - type: now_playing
```

Vollausbau (Beispiel für einen Server „Domovoi" mit Tautulli):

```yaml
type: custom:plexglass-card
title: Domovoi
subtitle: Plex Media Server
brand: plex                      # plex | jellyfin | emby | tautulli | neutral
card_style: default              # default | glass | material | bubble | mirror
status_entity: binary_sensor.plex_domovoi
sections:
  - type: now_playing
    count_entity: sensor.tautulli_stream_count
    direct_entity: sensor.tautulli_stream_count_direct_play
    transcode_entity: sensor.tautulli_stream_count_transcode
    bandwidth_entity: sensor.tautulli_total_bandwidth
    # players: [media_player.plex_wohnzimmer]   # sonst: Auto-Erkennung
    # layout: compact
  - type: stats
    columns: 3
    stats:
      - entity: sensor.plex_domovoi_library_filme
        icon: mdi:movie-open
      - entity: sensor.plex_domovoi_library_serien
        icon: mdi:television-classic
      - entity: sensor.plex_domovoi_library_anime
        icon: mdi:sword
      - entity: sensor.plex_domovoi_library_musik
        icon: mdi:music
      - entity: sensor.mediathek_groesse
        icon: mdi:harddisk
        format: bytes            # 18,4 TB
  - type: recently_added
    url: http://192.168.2.10:32400
    token: !secret plex_token
    limit: 12
  - type: activity
    entity: sensor.tautulli_stream_count
    # Zeitraum-Umschalter (Standard: 24 h / 7 T / 30 T / 90 T)
    # ranges: [24, 168, 720, 2160]
  - type: top
    entities:
      - entity: sensor.tautulli_top_movie
        icon: mdi:movie-star
      - entity: sensor.tautulli_top_tv
        icon: mdi:television-classic
      - entity: sensor.tautulli_top_user
        icon: mdi:account-star
  - type: requests
    url: http://192.168.2.10:5055
    token: !secret overseerr_api_key
```

### Sektionen

| Typ | Zweck |
| --- | --- |
| `now_playing` | Aktive Streams (Poster-Karten oder kompakte Zeilen) |
| `stats` | Kachel-Grid beliebiger Sensoren (Bibliotheksgrößen, Speicher, …) |
| `recently_added` | Poster-Regal — Sensor oder direkte Plex-/Jellyfin-API |
| `activity` | Verlaufs-Chart eines numerischen Sensors mit Zeitraum-Umschalter |
| `top` | Ranking-Zeilen (Tautulli-Top-Sensoren) |
| `requests` | Overseerr/Jellyseerr-Zähler (Sensoren oder API) |
| `custom` | Wie `stats` — freie Sensor-Kacheln |

### Alle Optionen

**Karte:** `title`, `subtitle`, `brand`, `accent`, `card_style`,
`status_entity`, `background` (false = ohne Kartenhintergrund), `flush`
(randlos), `collapsed` (Minimal-Modus: kompakte Vorschau, Tipp öffnet ein
Popup mit allen Sektionen — ideal fürs mobile Dashboard), `sections` (Liste).

**`now_playing`:** `players` (Liste; leer = Auto-Erkennung), `match`
(Filter-Substring für die Erkennung, Standard = Marke), `layout`
(`full`/`compact`), `show_idle`, `count_entity`, `direct_entity`,
`transcode_entity`, `bandwidth_entity` (kbps).

**`stats`/`custom`/`top`/`requests` (Sensor-Modus):** `stats` bzw. `entities` —
Liste aus Entity-IDs oder Objekten `{entity, name, icon, attribute, unit,
format, color}`; `columns` (1–4).

**`recently_added`:** `entity` (Sensor, upcoming-media-card-Format) **oder**
`url` + `token` (+ `api: plex|jellyfin`, bei Jellyfin optional `user_id`);
`limit`.

**`activity`:** `entity` (Standard: `count_entity` der now_playing-Sektion),
`ranges` (Zeitraum-Tabs in Stunden, Standard `[24, 168, 720, 2160]`; `[]`
blendet den Umschalter aus), `hours` (fester Zeitraum ohne Umschalter),
`color`. Ranges über 7 Tage nutzen automatisch die täglichen
Langzeit-Statistiken.

**`requests` (API-Modus):** `url` + `token` (Overseerr/Jellyseerr API-Key),
`columns`.

Jede Sektion: `title` (eigene Überschrift, leerer String blendet sie aus),
`icon`.

### Mini-Karte

Eine eigenständige, kompakte Karte für die aktuelle Aktivität — ideal als
Header-Zeile über der großen Karte oder in einer Grid-Übersicht:

```yaml
type: custom:plexglass-mini-card
title: Domovoi
brand: plex
status_entity: binary_sensor.plex_domovoi
count_entity: sensor.tautulli_stream_count      # leer = aktive Player zählen
direct_entity: sensor.tautulli_stream_count_direct_play
transcode_entity: sensor.tautulli_stream_count_transcode
bandwidth_entity: sensor.tautulli_total_bandwidth
hours: 24                                        # Sparkline-Fenster
```

Optionen: `title`, `brand`, `accent`, `card_style`, `count_entity`, `match`
(Auto-Erkennung ohne `count_entity`), `direct_entity`, `transcode_entity`,
`bandwidth_entity`, `entity` (Sparkline-Quelle, Standard `count_entity`),
`hours`, `status_entity`, `background`.

### Hinweise zur direkten API

- **Plex** liefert die nötigen CORS-Header — `url` + `X-Plex-Token` genügen.
  Token findest du z. B. in der Plex-Web-App über *Medieninfo → XML anzeigen*
  (Parameter `X-Plex-Token`).
- **Jellyfin**: Unter *Administration → Netzwerk* die Dashboard-Domain in die
  CORS-Hosts aufnehmen, API-Key unter *Administration → API-Schlüssel*.
- **Overseerr/Jellyseerr** setzt selbst keine CORS-Header — wenn der Browser
  die Anfrage blockt, nutze stattdessen Sensoren (z. B. die
  Overseerr-Integration aus HACS) im `entities`-Modus; die Karte zeigt in dem
  Fall einen entsprechenden Fehlerhinweis.

## Entwicklung

```bash
npm install
npx vite        # Dev-Preview mit Fake-Daten unter http://localhost:5220
npm run build   # dist/plexglass-card.js
```

## Lizenz

MIT
