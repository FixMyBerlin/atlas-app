# Places: Duplikate auflösen

Es gibt Daten, bei denen auf der Place-Node keine Details stehen, aber die Details and der Relation stehen.
Wir prozessieren jetzt beides (nodes und relations (centroid)).
Für fälle, wo sowohl node als auch reletion-centroid in den Daten sind, müssen wir eines löschen.
Grundsätzlich ist die node-Position vermutlich die bessere; dort fehlt aber dann die Daten.

Für diese Fälle…

- Option 1: Daten von Relation an Node verschieben; Relation-Node löschen.
- Option 2: Leere Node löschen, Relation-Node behalten.

# Wegenetz: Stummel-Stücke filtern

Siehe FRAGEN.md.

# Wegenetz: Indirekter Non-Access

Wir können verschneidungen von Flächen nutzen, um Wege aus dem Netz zu filtern, die kein explizites access-Tagging haben, aber für das Netz nicht relevant sind.

Beispiel:

- Alle Wege die innerhalb einer Fläche "Friedhof" liegen, können gefiltert werden.
  - Beispiel: https://www.openstreetmap.org/way/24276614
  - Durchdenken: Es könnte Wege geben, die innerhalb einer solchen Fläche explizit als bicycle=yes oder foot=yes oder access=yes getaggt sind; diese würden wir im Idealfall vom Filtern aussschließen
