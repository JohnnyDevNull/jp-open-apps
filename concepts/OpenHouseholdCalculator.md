# Open Household Calculators - MVP-Konzept

## Einleitung
Dieses Dokument dient als zentrale Sammlung für das Konzept des "Open Household Calculators" (OHC). Es handelt sich um eine App, die als MVP (Minimum Viable Product) entwickelt werden soll. Die App ist eigenständig und positioniert sich neben zwei weiteren Apps des Stakeholders im NX Monorepo unter https://github.com/JohnnyDevNull/jp-open-apps, deren Namen und Funktionen noch zu klären sind.

**Ziel:** Eine Community-Driven-Plattform für Haushaltsberechnungen zu schaffen, die nützliche Rechner für Alltagsaufgaben bietet, mit einem starken Fokus auf Benutzersicherheit, Datenschutz und Barrierefreiheit. Das Konzept wurde iterativ ausgearbeitet, basierend auf den Antworten des Stakeholders.

**Rollen:**
- **Du:** Stakeholder und Ideengeber – Du gibst die Vision und Anforderungen vor.
- **Ich:** Product Owner (definiere Features und Prioritäten), Software Architect (entwerfe die technische Struktur) und Tech Lead (überwache die Umsetzung).

## Aktueller Status
- **Version:** 1.5 (Finale Iteration basierend auf Stakeholder-Input)
- **Datum:** 05. Oktober 2025
- **Offene Punkte:** Klärung der anderen Apps (Namen/Funktionen), Open-Source-Lizenz vs. Monetarisierung.

## Vision und Positionierung
**Beschreibung:** OHC ist eine eigenständige, Community-Driven-Progressive Web App (PWA) für Haushaltsrechner, die Benutzern hilft, alltägliche Berechnungen durchzuführen. Der Fokus des MVP liegt auf der Verwaltung und Berechnung von Einnahmen und Ausgaben für verschiedene Haushaltstypen (Single, Paar, Familie mit Kindern, Kleinunternehmer mit mehreren Haushalten/Wohnungen). Benutzer können flexible "Container" erstellen, die individuell benannt werden und Einnahmen, Ausgaben, Versicherungen, Steuern, Käufe/Verkäufe enthalten. Diese Container können kategorisiert und verschlagwortet werden, um detaillierte Auswertungen zu ermöglichen (z.B. Guthaben oder Verbindlichkeiten). Ein zentrales Anliegen ist die Sicherheit der Benutzerdaten, sodass nichts Ungewolltes passiert und Daten geschützt sind, sowie Barrierefreiheit, um ein breites Publikum anzusprechen. Daten werden lokal gespeichert, manuell eingegeben und haben keinen Bezug zu Adressen oder Bankdaten; der Benutzer ist für die eingegebenen Daten verantwortlich. Die App wird als statische PWA ausgeliefert, ohne serverseitigen Code. Weitere Features wie Energieverbrauchsrechner, CO2-Fußabdruck, Einkaufslisten-Optimierung, Währungskurs-API, Budget-Vorhersagen, Konsumverhaltensanalysen, Verschlüsselung oder Multi-Device-Synchronisation (z.B. via Websockets) sind für spätere Iterationen geplant. Im MVP teilt die App keine Daten mit anderen Apps des Stakeholders. Daten-Sharing oder Import-Funktionen (z.B. über einen Server) sind für zukünftige Iterationen denkbar. Ob die App Open-Source sein soll, ist noch unklar, da Monetarisierungsoptionen geprüft werden.

**Zielgruppe:** Breite Gruppe, einschließlich Singles, Paare, Familien und Kleinunternehmer, die ihre Finanzen (z.B. für Haushalte oder Wohnungen) flexibel verwalten und auswerten möchten.

**Annahmen:** 
- Plattform: Progressive Web App (PWA), systemunabhängig installierbar und über Browser nutzbar, statisch ausgeliefert.
- Open-Source: Offen – Open-Source (z.B. MIT, GPL) wird in Betracht gezogen, aber Monetarisierung muss geklärt werden.
- Integration: Eigenständig im MVP, mögliche Integration mit anderen Apps in späteren Versionen.
- Skalierbarkeit: Single-User auf einem Gerät im MVP, Multi-Device-Synchronisation (z.B. via Websockets) in späteren Iterationen.
- Risiken: Keine rechtlichen Probleme im MVP, da Daten manuell eingegeben und lokal gespeichert werden.

## User Stories
Als Product Owner liste ich die User Stories basierend auf den angegebenen MVP-Features. Diese sind final für das MVP.

- **US-001:** Als Haushaltsnutzer oder Kleinunternehmer möchte ich ein oder mehrere Haushalte anlegen und diesen eine eindeutige Bezeichnung sowie die Information, ob es sich um ein Haus oder eine Wohnung handelt, geben, um meine Finanzen zu organisieren.
- **US-002:** Als Haushaltsnutzer oder Kleinunternehmer möchte ich ein oder mehrere Personen anlegen, diesen einen eindeutigen Namen geben und angeben, ob es sich um einen Erwachsenen oder ein Kind handelt, um sie einem Haushalt zuzuweisen.
- **US-003:** Als Haushaltsnutzer oder Kleinunternehmer möchte ich ein oder mehrere Tiere anlegen und diesen einen eindeutigen Namen geben, um sie einem Haushalt zuzuweisen.
- **US-004:** Als Haushaltsnutzer oder Kleinunternehmer möchte ich Kosten für einen Haushalt, eine Person oder ein Tier konfigurieren können, um Ausgaben zu verfolgen.
- **US-005:** Als Haushaltsnutzer oder Kleinunternehmer möchte ich Einnahmen für einen Haushalt, eine Person oder ein Tier konfigurieren können, um Einkünfte zu verfolgen.
- **US-006:** Als Haushaltsnutzer oder Kleinunternehmer möchte ich einem Haushalt Personen und Tiere zuweisen können, um eine vollständige Übersicht der Finanzen zu erhalten.
- **US-007:** Als Haushaltsnutzer oder Kleinunternehmer möchte ich Einnahmen und Ausgaben kategorisieren und verschlagworten (z.B. "Miete", "Lebensmittel"), um detaillierte Auswertungen zu erstellen.
- **US-008:** Als App-Nutzer möchte ich Daten lokal in IndexedDB speichern, um Offline-Nutzung zu ermöglichen und Privatsphäre zu wahren.
- **US-009:** Als App-Nutzer möchte ich, dass meine Daten sicher sind und nichts Ungewolltes mit ihnen passiert, um mein Vertrauen in die App zu stärken.
- **US-010:** Als Haushaltsnutzer oder Kleinunternehmer möchte ich meine Daten im JSON-Format exportieren und importieren können, um Daten zu sichern oder zu übertragen.
- **US-011:** Als App-Nutzer möchte ich Anzeigeoptionen (z.B. Design-Einstellungen) im localStorage speichern, um meine Präferenzen zu behalten.
- **US-012:** Als Haushaltsnutzer oder Kleinunternehmer möchte ich eine grafische Übersicht (z.B. einen Graphen) meiner Finanzen sehen, um meine Einnahmen und Ausgaben visuell zu verstehen.
- **US-013:** Als App-Nutzer mit Behinderung möchte ich, dass die App barrierefrei ist (z.B. Screen-Reader-Kompatibilität, kontrastreiche Farben, Tastaturnavigation), um sie problemlos nutzen zu können.
- **US-014:** Als App-Nutzer möchte ich, dass die App so entwickelt wird, dass eine Verschlüsselung der Daten in einer späteren Iteration leicht integriert werden kann, um zukünftige Sicherheitsanforderungen zu erfüllen.
- **US-015:** Als App-Nutzer möchte ich, dass die App für einen einzelnen Benutzer auf einem Gerät optimiert ist, mit der Möglichkeit, später Multi-Device-Synchronisation (z.B. via Websockets) zu implementieren.

## Architektur-Skizze
Als Software Architect skizziere ich eine Struktur, die die Anforderungen unterstützt:
- **Frontend:** Progressive Web App mit React, gestylt mit Material-UI für ein minimalistisches Design, statisch ausgeliefert ohne serverseitigen Code.
- **Datenbank:** IndexedDB für Haushalts-, Personen-, Tier- und Finanzdaten (JSON-Format); localStorage für Anzeigeoptionen.
- **Datenfluss:** Benutzer-Input (Haushalte, Personen, Tiere, Einnahmen/Ausgaben, manuell eingegeben) → Berechnung (JavaScript-Logik) → Ausgabe (UI mit Tabellen/Charts).
- **Modulare Struktur:** Module für Haushalte, Personen, Tiere, Finanzberechnungen, Kategorisierung/Verschlagwortung, Import/Export, Visualisierung, Barrierefreiheit. Die Architektur soll zukünftige Verschlüsselung (z.B. via Web Crypto API) und Multi-Device-Synchronisation (z.B. via Websockets) ermöglichen.
- **Offline-Fähigkeit:** Ermöglicht durch PWA und IndexedDB.
- **Monorepo:** Verwaltet im NX Monorepo unter https://github.com/JohnnyDevNull/jp-open-apps, zusammen mit anderen Projekten.

```
[Benutzer] --> [UI (Forms für Haushalte/Personen/Tiere, Material-UI)] --> [Berechnungs-Engine] --> [Ausgabe (Tabellen/Charts)] 
                                                              |
                                                              --> [IndexedDB (JSON-Daten, Vorbereitung für Verschlüsselung)] 
                                                              --> [localStorage (Anzeigeoptionen)]
```

## Tech-Stack
Als Tech Lead schlage ich vor:
- **Sprache/Framework:** JavaScript/TypeScript mit React (Create React App oder Vite für statische PWA, ohne Next.js).
- **UI-Bibliothek:** Material-UI (MUI) für ein minimalistisches, modernes Design, mit Fokus auf Barrierefreiheit (z.B. ARIA-Labels, kontrastreiche Farben).
- **Bibliotheken:** Math.js für Berechnungen, Chart.js für Visualisierungen, Workbox für PWA-Offline-Fähigkeit.
- **Datenbank:** IndexedDB für lokale Speicherung von JSON-Daten, localStorage für Anzeigeoptionen.
- **Sicherheit:** Vorbereitung für zukünftige Verschlüsselung (z.B. Web Crypto API) durch modularen Aufbau.
- **Synchronisation:** Vorbereitung für zukünftige Multi-Device-Synchronisation (z.B. via Websockets).
- **Monorepo:** NX für Projektstruktur und Verwaltung, integriert in https://github.com/JohnnyDevNull/jp-open-apps.
- **Deployment:** Vercel für statisches Web-Deployment.
- **Testing:** Jest für Unit-Tests, Cypress für End-to-End-Tests, axe-core für Barrierefreiheits-Tests.
- **Entwicklungsumgebung:** IntelliJ als IDE, unterstützt durch Junie AI und Grok 3 als AI-Assistenten.

## Solo-Dev-Plan
Als Tech Lead schlage ich einen Plan für dich als Solo-Entwickler vor, unterstützt durch IntelliJ, Junie AI und Grok 3:
- **Entwicklungsumgebung:** Nutze IntelliJ mit TypeScript, React (Create React App oder Vite), NX Monorepo und Material-UI. Konfiguriere ESLint und Prettier für sauberen Code.
- **Workflow:** 
  - **Setup (1 Woche):** Projekt im NX Monorepo initialisieren (React mit PWA), IndexedDB einrichten, Material-UI integrieren.
  - **Kernfeatures (4-6 Wochen):** Implementiere Module für Haushalte, Personen, Tiere, Einnahmen/Ausgaben, Kategorisierung/Verschlagwortung, JSON Import/Export.
  - **UI/UX (2-3 Wochen):** Erstelle minimalistische UI mit Material-UI, integriere einen Chart (Chart.js) für Finanzübersicht, implementiere Barrierefreiheit (ARIA-Labels, Tastaturnavigation, kontrastreiche Farben).
  - **Testing (2 Wochen):** Schreibe Unit-Tests (Jest), End-to-End-Tests (Cypress) und Barrierefreiheits-Tests (axe-core).
  - **Deployment (1 Woche):** Bereitstellung auf Vercel, Testen der PWA-Installation und Offline-Funktionalität.
- **Tools:** Nutze Junie AI und Grok 3 für Code-Vorschläge, Debugging und Optimierung.
- **Priorisierung:** Fokussiere auf Kernfeatures (US-001 bis US-007, US-010, US-012), dann Barrierefreiheit (US-013) und Datensicherheit/Offline-Fähigkeit (US-008, US-009, US-011, US-014, US-015).
- **Zeitaufwand:** Geschätzt 10-13 Wochen für einen erfahrenen Solo-Entwickler, abhängig von deinem Tempo und der Unterstützung durch AI-Tools. Die Timeline ist flexibel, ohne festes Fertigstellungsdatum.

## Roadmap
1. **Phase 1: Konzeptausarbeitung** (abgeschlossen) – Fragen gestellt, Plan finalisiert.
2. **Phase 2: MVP-Entwicklung** – Kernfeatures implementieren (Haushalte, Personen, Tiere, Einnahmen/Ausgaben, JSON Import/Export, statische PWA, minimalistisches Design mit Graphen, Barrierefreiheit, Single-User). Zeitrahmen flexibel, ca. 10-13 Wochen.
3. **Phase 3: Testing & Launch** – Beta-Release auf Vercel.
4. **Phase 4: Erweiterungen** – Basierend auf Feedback (z.B. Energieverbrauch, CO2-Fußabdruck, Einkaufslisten-Optimierung, Währungskurs-API, Budget-Vorhersagen, Konsumverhaltensanalyse durch Einkaufsbelege, Verschlüsselung, Multi-Device-Synchronisation).

## Risiken
- **Rechtliche Aspekte:** Keine rechtlichen Probleme im MVP, da Daten manuell eingegeben und lokal gespeichert werden, ohne Bezug zu Adressen oder Bankdaten.
- **Technische Hürden:** Potenzielle Herausforderungen bei der PWA-Entwicklung (z.B. Browser-Kompatibilität für IndexedDB oder Offline-Funktionalität) oder bei der Integration in ein NX Monorepo. Diese können durch gründliches Testen (Jest, Cypress, axe-core) minimiert werden.
- **Ressourcen:** Als Solo-Entwickler könnten Zeit und Kapazität eine Herausforderung sein, werden aber durch Unterstützung von Junie AI und Grok 3 sowie den Einsatz eines NX Monorepos für effiziente Projektverwaltung abgefedert.

## Offene Punkte
- **Andere Apps:** Klärung der Namen und Funktionen der anderen beiden Apps im NX Monorepo (https://github.com/JohnnyDevNull/jp-open-apps).
- **Open-Source vs. Monetarisierung:** Entscheidung, ob die App unter einer Open-Source-Lizenz (z.B. MIT, GPL) veröffentlicht wird oder Monetarisierungsoptionen verfolgt werden.

## Nächste Schritte
Das Konzept für das MVP ist nun vollständig ausgearbeitet. Als nächster Schritt wird empfohlen:
1. **Projektsetup im NX Monorepo:** Erstelle ein neues React-Projekt im NX Monorepo unter https://github.com/JohnnyDevNull/jp-open-apps, konfiguriere die PWA und integriere Material-UI sowie IndexedDB.
2. **Entwicklung beginnen:** Starte mit den Kernfeatures (Haushalte, Personen, Tiere, Einnahmen/Ausgaben, Kategorisierung/Verschlagwortung) gemäß dem Solo-Dev-Plan.
3. **Klärung offener Punkte:** Entscheide über Open-Source-Lizenz vs. Monetarisierung und kläre die Details der anderen Apps im Monorepo, um mögliche Synergien zu nutzen.
4. **Feedback einholen:** Teile das Konzept mit potenziellen Nutzern oder der Community (z.B. über GitHub), um frühzeitig Feedback zu erhalten.