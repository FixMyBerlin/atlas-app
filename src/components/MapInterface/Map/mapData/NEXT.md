Gespräch mit Johannes:

- url konzept mit config={object}
- ~~aber erstmal das simulieren durch nachbauen~~ klappt nicht, da dann bei click auf topic kein rerender erfolgt
- contract: meine component haben immer eine funtkionsfähige config; fehler behebungen mache ich weiter oben
  - das ist wichtig; ich bin schon in das problem gelaufen.
    - siehe meine todos in geschichte.js zu url-validierung
    - aber auch in alle Select\* components, wo ich in diesem Stash jetzt ständig NULL safe sein will
    - ich will, dass zum zeitpunkt, wo meine components gerendered sind, der TS contract schon sagt, dass die URL present ist, so dass ich kein null-checking mehr machen muss

NOITZEN:

---

Lösungsoptionen:

- mapDataConfig umbauen zu flach, so dass es URL entspricht
- helper bauen, der mapDataConfig flach macht
- URL struktur umbauen, so dass sie Objekt enthält

---

Ich baue einen Helper, den ich in jeder meiner <Select\*> nutze.

Der macht mir ein neues Objekt aus meiner MapDataConfig

- Nur, was aktiv ist bzw. mit Default-Aktivheit
- Flache hierarchie
- Helper-Ids

Das ganze wird mit useXX "rerender save" gemacht

---

Alternativ könnte ich meinen State umbauen:
Ich habe ein config=OBJECT part in der URL, der ein spezielles conifg object repräsentiert, das ich initial baue.
Darin sind alle Daten, aber nur ihre IDs + AKtiv-Zustand vermkert.

Vorteil: Ich kann aus allen Objekten auf diesen zentralen State zugreifen.
Und den Teil der Config, der CONST ist, darüber auslesen.

ABER: Ich kann das auch einfach aus meinen jetzigen params mit einem helper konstruieren pro File. Das ist evtl. etwas ineffizienter; aber dürfte egal sein.
FLOW ist also: Ich ziehe alle daten aus der URL pro <Select\*> => Baue mir mein config Objekt => nutze das für die component.

```js
map = {…}
background = {}
config = [
  {
    topicId: string, // id
    active: false, // a
    styles: [
      {
        styleId: string, // id
        active: false, // a
        filters: [
          {
            fiterId: string, // id
            active: false // a
            options: [
              {
                optionId: string // id
                active: false // a
              },
              // {…}
            ]
          }
          // {…}
        ]
      },
      // {…}
    ] },
  // {…}
]
```
