import { SourceDatasets } from './sourcesDatasets.const'
import { cleanupMapboxCopySelectedLayerJson } from './utils/cleanupMapboxCopySelectedLayerJson'
import { sourceDatasetIdUrl } from './utils/sourceDatasetIdUrl'

export const sourcesDatasetsBrandenburg: SourceDatasets = [
  {
    regionKey: ['bb', 'bb-adfc'],
    ...sourceDatasetIdUrl('bb-radnetz-barnim'),
    name: 'Radnetz Landkreis Barnim',
    type: 'vector',
    attributionHtml: '&copy; TODO',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: false,
      disableTranslations: true,
    },
    layers: [
      {
        id: 'bb-radnetz-barnim',
        type: 'line',
        paint: {
          'line-color': '#4f46e5',
          'line-opacity': 0.6,
          'line-width': 4,
        },
      },
    ],
  },
  {
    regionKey: ['bb'],
    ...sourceDatasetIdUrl('bb-ramboll-gemeinden'),
    name: '(Ramboll) Gemeinden',
    type: 'vector',
    attributionHtml: '&copy; LGB',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: false,
      disableTranslations: true,
    },
    layers: [
      {
        id: 'bb-ramboll-gemeinden',
        type: 'fill',
        paint: {
          'fill-color': [
            'match',
            ['get', 'Anzahl ZO + SPVN3000'],
            0,
            '#FED2C2',
            1,
            '#FFFFE7',
            2,
            '#DDF0C5',
            3,
            '#A6D6B5',
            '#A6D6B5',
          ],
          'fill-opacity': 0.8,
        },
      },
    ],
  },
  {
    regionKey: ['bb'],
    ...sourceDatasetIdUrl('bb-ramboll-spnv-3000'),
    name: '(Ramboll) SPNV 3000',
    type: 'vector',
    attributionHtml: '&copy; OpenStreetMap, Ramboll',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: false,
      disableTranslations: true,
    },
    layers: [
      {
        id: 'bb-ramboll-spnv-3000',
        type: 'circle',
        paint: {
          'circle-color': '#16a34a',
          'circle-radius': 6,
        },
      },
    ],
  },
  {
    regionKey: ['bb'],
    ...sourceDatasetIdUrl('bb-ramboll-zentrale-orte'),
    name: '(Ramboll) Zentrale Orte',
    type: 'vector',
    attributionHtml: '&copy; OpenStreetMap, Ramboll',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: false,
      disableTranslations: true,
    },
    layers: [
      {
        id: 'bb-zentrale-orte',
        type: 'circle',
        paint: {
          'circle-color': [
            'case',
            ['==', ['get', 'Oberzentrum'], 1],
            '#be185d',
            ['==', ['get', 'Mittelzentrum'], 1],
            '#4c1d95',
            '#1d4ed8',
          ],
          'circle-radius': [
            'case',
            ['==', ['get', 'Oberzentrum'], 1],
            12,
            ['==', ['get', 'Mittelzentrum'], 1],
            8,
            6,
          ],
        },
      },
    ],
  },
  {
    regionKey: ['bb'],
    ...sourceDatasetIdUrl('bb-ramboll-nachbarn'),
    name: '(Ramboll) Zentrale Orte: Nachbarn',
    type: 'vector',
    attributionHtml: '&copy; OpenStreetMap, Ramboll',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: false,
      disableTranslations: true,
    },
    layers: [
      {
        id: 'bb-ramboll-nachbarn',
        type: 'circle',
        paint: {
          'circle-color': '#a78bfa',
          'circle-radius': 6,
        },
      },
    ],
  },
  {
    regionKey: ['bb'],
    ...sourceDatasetIdUrl('bb-ramboll-minimal-spanning-tree'),
    name: '(Ramboll) minimal spanning tree',
    type: 'vector',
    attributionHtml: '&copy; Ramboll',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: false,
      disableTranslations: true,
    },
    layers: [
      {
        id: 'bb-ramboll-minimal-spanning-tree',
        type: 'line',
        paint: {
          'line-color': '#a78bfa',
          'line-width': 3,
          'line-opacity': 0.8,
        },
      },
    ],
  },
  {
    regionKey: ['bb'],
    ...sourceDatasetIdUrl('bb-ramboll-delauney-triangulation'),
    name: '(Ramboll) delauny triangulation',
    type: 'vector',
    attributionHtml: '&copy; Ramboll',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: false,
      disableTranslations: true,
    },
    layers: [
      {
        id: 'bb-ramboll-delauney-triangulation',
        type: 'line',
        paint: {
          'line-color': '#2e1065',
          'line-width': 1.5,
          'line-opacity': 0.8,
        },
      },
    ],
  },
  {
    // regionKey: ['bb', 'bb-adfc'],
    regionKey: ['bb-adfc'],
    ...sourceDatasetIdUrl('bb-radnetz-adfc'),
    name: 'Radnetz ADFC',
    subId: 'd', // d for 'default'
    type: 'vector',
    attributionHtml: '&copy; OpenStreetMap, ADFC',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: false,
      disableTranslations: true,
    },
    layers: [
      cleanupMapboxCopySelectedLayerJson([
        {
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          filter: [
            'match',
            ['get', 'description'],
            [
              'gehört zu Prignitz-Oberhavel',
              'gehört zu Havelland-Fläming',
              'gehört zu Uckermark-Barnim',
              'gehört zu Oderland-Spree',
              'gehört zu Lausitz-Spreewald',
            ],
            true,
            false,
          ],
          type: 'line',
          source: 'composite',
          id: 'area-line',
          paint: {
            'line-width': ['interpolate', ['linear'], ['zoom'], 7, 1.5, 22, 5],
            'line-dasharray': [2, 2, 2, 1],
            'line-color': '#edd2ce',
          },
          'source-layer': 'atlas-static-data-bb-radnetz--21o7zj',
        },
      ]),
      cleanupMapboxCopySelectedLayerJson([
        {
          filter: [
            'match',
            ['get', 'name'],
            [
              'Ring 5 Süd',
              'Ring 1b',
              'Ring 1',
              'Ring 2',
              'Ring 3',
              'Ring 4',
              'Ring 4 Alternativ Frankfurt - Küstrin-Kietz',
              'Ring 5 Nord',
              'Ring 4 Wunschroute alte Bahnlinie Von Rathenow nach NeustadtDosse.',
              'Ring 3 Alternative Beeskow - Lübben',
              'Ring 3a',
            ],
            true,
            false,
          ],
          type: 'line',
          source: 'composite',
          id: 'ring',
          paint: {
            'line-color': '#c20000',
            'line-opacity': 0.5,
            'line-width': 3,
          },
          'source-layer': 'atlas-static-data-bb-radnetz--21o7zj',
        },
      ]),
      cleanupMapboxCopySelectedLayerJson([
        {
          filter: [
            'match',
            ['get', 'name'],
            [
              '111 Von Oranienburg nach Liebenwalde',
              '112 Von Lehnitz nach Summt',
              '121 Von Neuhof nach Hammelspring',
              '122 Von Schildow nach Schönwalde',
              '131 Von Fürstenwerder nach Güstow',
              '132 Von Templin über Prenzlau nach Löcknitz',
              '133 Stegelitz Templin',
              '134 Von Lychen über Templin nach Angermünde_01012024',
              '135 Von Wandlitz nach Heckelberg',
              '136 Von Schönwalde nach Bernau',
              '137 Von Blankenburg nach Zepernick',
              '141 Von Pasewalk nach Gryfino',
              '142 Von Prenzlau nach Penkun',
              '143 Von Greiffenberg nach Wallmow',
              '144 Von Schwedt nach Krajnik Dolny',
              '145 Von Angermünde nach Bad Freienwalde (Oder)',
              '145a Von Oderberg nach Niederfinow',
              '146 Von Bernau nach Blumberg',
              '151 Von Neuglietzen (Altküstrincehen) nach Wriezen',
              '152 Von Bad Freienwalde (Oder) nach Straußberg (Prötzel)',
              '153 Von Falkenberg (Mark) nach Leuenberg',
              '154 Von Tempelfelde nach Leuenberg',
              '155 Von Börnicke nach Petershagen',
              '161 Von Schulzendorf nach Reichenow',
              '162 Von Werftpfuhl nach Gielsdorf',
              '163 Von Werneuchen über Altlandsberg, Hoppegarten nach Köpenick',
              '164 Von Ahrensfelde nach Altlandsberg Nord',
              '171 Von Letschin nach Frankfurt (Oder)',
              '172 Von Letschin nach Lieberose',
              '172a Von Friedland nach Pinnow',
              '173 Von Strausberg nach Kagel',
              '173a Von Werder nach Müncheberg',
              '174 Von Hönow nach Garzin',
              '175 Von Petershagen nach Rüdersdorf bei Berlin',
              '176 Von Fredersdorf-Vogelsdorf nach Hessenwinkel',
              '177 Von Bollensdorf nach Eggersdorf',
              '178 Von Bollensdorf nach Bruchmühle',
              '178a Von Rahnsdorf nach Woltersdorf',
              '179 Von Neuenhagen bei Berlin nach Hönow',
              '179a Von Dahlwitz-Hoppegarten nach Friedrichshagen',
              '181 Von Seelow nach Tempelberg',
              '182 Von Müncheberg nach Behlendorf',
              '183 Von Kienbaum nach Groß Rietz',
              '184 Von Hennickendorf nach Hangelsberg',
              '185 Von Hennickendorf nach Hangelsberg',
              '185a Von Rüdersdorf nach Hinterberge',
              '185b Von Rüdersdorf bei Berlin nach Erkner',
              '185b Wunschroute',
              '186 gewünschte Route',
              '186 Von Grünheide (Mark) nach Tesla',
              '191 Von Pagram nach Markendorf',
              '192 Von Jacobsdorf nach Eisenhüttenstadt',
              '193 Von Fürstenwalde nach Neu Zittau',
              '193 Von Markgrafpieske nach Storkow (Mark)',
              '193b Von Spreenhagen nach Kablow',
              '201Von Eisenhüttenstadt nach Weißwasser',
              '202 Von Müllrose nach Peitz',
              '203 Von Storkow (Mark) nach Lübben',
              '211 Von Cottbus nach Hoyerswerda',
              '212 Von Cottbus nach Senftenberg',
              '213 Von Märkisch Buchholz nach Groß Lubolz',
              '214 Von Königs Wusterhausen nach Klein Köris',
              '215 Von Königs Wusterhausen nach Mittenwalde',
              '216 Von Königs Wusterhausen nach Schönefeld',
              '217 Von Zeuthen nach Dahlewitz',
              '221 Von Calau nach Finsterwalde',
              '222 Von Lübben nach Luckau',
              '223 Von Lübben (Spreewald) nach Golßen',
              '224 Von Selchow nach Mahlow',
              '225 Von Waßmannsdorf nach Rudow',
              '226 Von Schönefeld nach Grünau',
              '227 Von Schönefeld nach Adlershof',
              '231 Von Lauchhammer nach Langennaundorf',
              '232 Von Luckau nach Herzberg (Elster)',
              '233 Von Baruth/Mark nach Lutherstadt Wittenberg',
              '234 Von Lindenbrück nach Stücken',
              '235 Von Klein Kienitz nach Ludwigsfelde-Industriepark-West',
              '241 Von Schönefeld nach Potsdam-West',
              '241a Von Wildenbruch nach Michendorf',
              '242 Von Groß Schulzendorf nach Ludwigsfelde',
              '251 Von Schönhagen nach Potsdam',
              '252 Von Struveshof nach Michendorf',
              '252a Von Nudow nach Nuthetal',
              '261 Von Lutherstadt Wittenberg nach Bad Belzig',
              '262 Von Seddiner See nach Potsdam-Süd',
              '263 Von Michendorf nach Ferch-Linewitz',
              '264 Von Michendorf nach Caputh',
              '271 Von Coswig (Anhalt) nach Reetzerhütten',
              '272 Von Wiesenburg/Mark nach Görzke',
              '273 Von Schwanebeck nach Dippmannsdorf',
              '274 Von Beelitz-Heilstätten nach Werder',
              '281 Von Magdeburgerforth nach Priort',
              '282 Von Golzow nach Prützke',
              '283 Von Potsdam nach Wustermark',
              '284 Von Neu Fahrland nach Elstal',
              '291 Von Brandenburg a.H. nach Fohrde',
              '292 Von Klein Kreutz nach Nauen',
              '301 Von Pritzerbe nach Rathenow',
              '302 Von Stechow nach Lentzke',
              '303 Havelkanal HF 14 / HF 21 / HF 17',
              '311 Von Lenzen (Elbe) nach Plau am See',
              '312 Von Weisen nach Karstädt',
              '313 Von Wittenberge nach Putlitz',
              '314 Von Kyritz nach Havelberg Richtung Stendal',
              '315 Von Neustadt (Dosse) nach Neuruppin',
              '316 Von Falkenhagen über Perwenitz nach Marwitz',
              '316 Von Nauen nach Bötzow',
              '317 Von Falkenhagen über Perwenitz nach Marwitz',
              '318 Von Spandau nach Hennigsdorf',
              '321 Von Perleberg nach Meyenburg',
              '322 Von Kyritz nach Wittstock/Dose',
              '323 Von Wusterhausen/Dose nach Kränzlin',
              '324 Von Protzen nach Klein-Mutz',
              '325 Von Kremmen nach Oranienburg',
              '326 Von Hohenschöpping nach Bergfelde',
              '327 Von Heiligensee nach Schildow',
              '331 Von Wittstock/Dosse nach Röbel/Müritz',
              '332 Von Wittstock/Dosse nach Mirow',
              '333 Von Neuruppin nach Rheinsberg',
              '334 Wittstock - Mirow auf Bahnlinie',
              '341 Von Prebelow über Wesenberg nach Godendorf',
              '342 Von Köpernitz nach Zehdenick',
              '343 Von Lindow (Mark) nach Menz',
              '344 Von Keller nach Gransee',
              '345 Von Herzberg (Mark) nach Wulkow',
            ],
            true,
            false,
          ],
          type: 'line',
          source: 'composite',
          id: 'quer',
          paint: {
            'line-color': '#005266',
            'line-opacity': 0.5,
            'line-width': 3,
          },
          'source-layer': 'atlas-static-data-bb-radnetz--21o7zj',
        },
      ]),
      cleanupMapboxCopySelectedLayerJson([
        {
          filter: [
            'match',
            ['get', 'name'],
            [
              'Strahl 34 Von Mirow nach Beetz',
              'Strahl 24 Von Gröditz nach Mahlow',
              'Strahl 13 Von Woldegk nach Blankenburg',
              'Strahl 14 Von Pasewalk nach Neu-Hohenschönhausen',
              'Strahl 25a Von Ludwigsfelde nach Stahnsdorf',
              'Strahl 22 Von Ruhland nach Schönefeld',
              'Strahl 29 Von Genthin nach Geltow/Potsdam',
              'Strahl 16 Von Europaradbrücke nach Neu-Hohenschönhausen',
              'Strahl 27 Von Roßlau nach Wannsee RE7',
              'Strahl 15 Von Neuglietzen nach Bernau',
              'Strahl 12 Von Fürstenberg/Havel nach Blankenfelde',
              'Strahl 26 Von Lutherstadt Wittenberg nach Potsdam B2',
              'Strahl 20 Von Fürstenberg (Oder) nach Storkow (Mark)',
              'Strahl 17 Von Groß Neuendorf nach Dahlwitz-Hoppegarten',
              'Strahl 32 Von Grabow nach Heiligensee',
              'Strahl 31 Von Dömitz nach Spandau',
              'Strahl 18 Von Küstrin-Kietz nach Erkner',
              'Strahl 25 Von Torgau nach Marienfelde',
              'Strahl 33 Von Parchim nach Sommerfeld',
              'Strahl 30 Von Röxe nach Spandau/Wilhelmstadt',
              'Strahl 17 gewünschte Route',
              'Strahl 25b Von Ludwigsfelde nach Teltow',
              'Strahl 14 gewünschte Route',
              'Strahl 21 Von Forst (Lausitz) nach Schmöckwitz',
              'Strahl 28 Von Magdeburgerforth nach Potsdam',
              'Strahl 11 Von Neustrelitz nach Hermsdorf',
              'Strahl 23 Von Ruhland nach Buckow',
              'Strahl 19 Von Frankfurt (Oder) nach Köpenick',
              'Strahl 32 a Von Parchim nach Kyritz',
              'Strahl 18a Von Booßen nach Tempelberg',
            ],
            true,
            false,
          ],
          type: 'line',
          source: 'composite',
          id: 'strahl',
          paint: {
            'line-color': '#8100c2',
            'line-width': 3,
            'line-opacity': 0.5,
          },
          'source-layer': 'atlas-static-data-bb-radnetz--21o7zj',
        },
      ]),
    ],
  },
  {
    // regionKey: ['bb', 'bb-adfc'],
    regionKey: ['bb-adfc'],
    ...sourceDatasetIdUrl('bb-radnetz-adfc'),
    name: 'Radnetz ADFC (Datenabgleich)',
    subId: 'complete',
    type: 'vector',
    attributionHtml: '&copy; OpenStreetMap, ADFC',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: false,
      disableTranslations: true,
    },
    layers: [
      {
        filter: [
          'match',
          ['get', 'name'],
          [
            'Ring 5 Süd',
            'Ring 1b',
            'Ring 1',
            'Ring 2',
            'Ring 3',
            'Ring 4',
            'Ring 4 Alternativ Frankfurt - Küstrin-Kietz',
            'Ring 5 Nord',
            'Ring 4 Wunschroute alte Bahnlinie Von Rathenow nach NeustadtDosse.',
            'Ring 3 Alternative Beeskow - Lübben',
            'Ring 3a',
          ],
          true,
          false,
        ],
        type: 'line',
        id: 'ring',
        paint: {
          'line-color': 'black',
          'line-width': 4,
          'line-opacity': 1,
          'line-offset': 4,
        },
      },
      {
        filter: [
          'match',
          ['get', 'name'],
          [
            '111 Von Oranienburg nach Liebenwalde',
            '112 Von Lehnitz nach Summt',
            '121 Von Neuhof nach Hammelspring',
            '122 Von Schildow nach Schönwalde',
            '131 Von Fürstenwerder nach Güstow',
            '132 Von Templin über Prenzlau nach Löcknitz',
            '133 Stegelitz Templin',
            '134 Von Lychen über Templin nach Angermünde_01012024',
            '135 Von Wandlitz nach Heckelberg',
            '136 Von Schönwalde nach Bernau',
            '137 Von Blankenburg nach Zepernick',
            '141 Von Pasewalk nach Gryfino',
            '142 Von Prenzlau nach Penkun',
            '143 Von Greiffenberg nach Wallmow',
            '144 Von Schwedt nach Krajnik Dolny',
            '145 Von Angermünde nach Bad Freienwalde (Oder)',
            '145a Von Oderberg nach Niederfinow',
            '146 Von Bernau nach Blumberg',
            '151 Von Neuglietzen (Altküstrincehen) nach Wriezen',
            '152 Von Bad Freienwalde (Oder) nach Straußberg (Prötzel)',
            '153 Von Falkenberg (Mark) nach Leuenberg',
            '154 Von Tempelfelde nach Leuenberg',
            '155 Von Börnicke nach Petershagen',
            '161 Von Schulzendorf nach Reichenow',
            '162 Von Werftpfuhl nach Gielsdorf',
            '163 Von Werneuchen über Altlandsberg, Hoppegarten nach Köpenick',
            '164 Von Ahrensfelde nach Altlandsberg Nord',
            '171 Von Letschin nach Frankfurt (Oder)',
            '172 Von Letschin nach Lieberose',
            '172a Von Friedland nach Pinnow',
            '173 Von Strausberg nach Kagel',
            '173a Von Werder nach Müncheberg',
            '174 Von Hönow nach Garzin',
            '175 Von Petershagen nach Rüdersdorf bei Berlin',
            '176 Von Fredersdorf-Vogelsdorf nach Hessenwinkel',
            '177 Von Bollensdorf nach Eggersdorf',
            '178 Von Bollensdorf nach Bruchmühle',
            '178a Von Rahnsdorf nach Woltersdorf',
            '179 Von Neuenhagen bei Berlin nach Hönow',
            '179a Von Dahlwitz-Hoppegarten nach Friedrichshagen',
            '181 Von Seelow nach Tempelberg',
            '182 Von Müncheberg nach Behlendorf',
            '183 Von Kienbaum nach Groß Rietz',
            '184 Von Hennickendorf nach Hangelsberg',
            '185 Von Hennickendorf nach Hangelsberg',
            '185a Von Rüdersdorf nach Hinterberge',
            '185b Von Rüdersdorf bei Berlin nach Erkner',
            '185b Wunschroute',
            '186 gewünschte Route',
            '186 Von Grünheide (Mark) nach Tesla',
            '191 Von Pagram nach Markendorf',
            '192 Von Jacobsdorf nach Eisenhüttenstadt',
            '193 Von Fürstenwalde nach Neu Zittau',
            '193 Von Markgrafpieske nach Storkow (Mark)',
            '193b Von Spreenhagen nach Kablow',
            '201Von Eisenhüttenstadt nach Weißwasser',
            '202 Von Müllrose nach Peitz',
            '203 Von Storkow (Mark) nach Lübben',
            '211 Von Cottbus nach Hoyerswerda',
            '212 Von Cottbus nach Senftenberg',
            '213 Von Märkisch Buchholz nach Groß Lubolz',
            '214 Von Königs Wusterhausen nach Klein Köris',
            '215 Von Königs Wusterhausen nach Mittenwalde',
            '216 Von Königs Wusterhausen nach Schönefeld',
            '217 Von Zeuthen nach Dahlewitz',
            '221 Von Calau nach Finsterwalde',
            '222 Von Lübben nach Luckau',
            '223 Von Lübben (Spreewald) nach Golßen',
            '224 Von Selchow nach Mahlow',
            '225 Von Waßmannsdorf nach Rudow',
            '226 Von Schönefeld nach Grünau',
            '227 Von Schönefeld nach Adlershof',
            '231 Von Lauchhammer nach Langennaundorf',
            '232 Von Luckau nach Herzberg (Elster)',
            '233 Von Baruth/Mark nach Lutherstadt Wittenberg',
            '234 Von Lindenbrück nach Stücken',
            '235 Von Klein Kienitz nach Ludwigsfelde-Industriepark-West',
            '241 Von Schönefeld nach Potsdam-West',
            '241a Von Wildenbruch nach Michendorf',
            '242 Von Groß Schulzendorf nach Ludwigsfelde',
            '251 Von Schönhagen nach Potsdam',
            '252 Von Struveshof nach Michendorf',
            '252a Von Nudow nach Nuthetal',
            '261 Von Lutherstadt Wittenberg nach Bad Belzig',
            '262 Von Seddiner See nach Potsdam-Süd',
            '263 Von Michendorf nach Ferch-Linewitz',
            '264 Von Michendorf nach Caputh',
            '271 Von Coswig (Anhalt) nach Reetzerhütten',
            '272 Von Wiesenburg/Mark nach Görzke',
            '273 Von Schwanebeck nach Dippmannsdorf',
            '274 Von Beelitz-Heilstätten nach Werder',
            '281 Von Magdeburgerforth nach Priort',
            '282 Von Golzow nach Prützke',
            '283 Von Potsdam nach Wustermark',
            '284 Von Neu Fahrland nach Elstal',
            '291 Von Brandenburg a.H. nach Fohrde',
            '292 Von Klein Kreutz nach Nauen',
            '301 Von Pritzerbe nach Rathenow',
            '302 Von Stechow nach Lentzke',
            '303 Havelkanal HF 14 / HF 21 / HF 17',
            '311 Von Lenzen (Elbe) nach Plau am See',
            '312 Von Weisen nach Karstädt',
            '313 Von Wittenberge nach Putlitz',
            '314 Von Kyritz nach Havelberg Richtung Stendal',
            '315 Von Neustadt (Dosse) nach Neuruppin',
            '316 Von Falkenhagen über Perwenitz nach Marwitz',
            '316 Von Nauen nach Bötzow',
            '317 Von Falkenhagen über Perwenitz nach Marwitz',
            '318 Von Spandau nach Hennigsdorf',
            '321 Von Perleberg nach Meyenburg',
            '322 Von Kyritz nach Wittstock/Dose',
            '323 Von Wusterhausen/Dose nach Kränzlin',
            '324 Von Protzen nach Klein-Mutz',
            '325 Von Kremmen nach Oranienburg',
            '326 Von Hohenschöpping nach Bergfelde',
            '327 Von Heiligensee nach Schildow',
            '331 Von Wittstock/Dosse nach Röbel/Müritz',
            '332 Von Wittstock/Dosse nach Mirow',
            '333 Von Neuruppin nach Rheinsberg',
            '334 Wittstock - Mirow auf Bahnlinie',
            '341 Von Prebelow über Wesenberg nach Godendorf',
            '342 Von Köpernitz nach Zehdenick',
            '343 Von Lindow (Mark) nach Menz',
            '344 Von Keller nach Gransee',
            '345 Von Herzberg (Mark) nach Wulkow',
          ],
          true,
          false,
        ],
        type: 'line',
        id: 'quer',
        paint: {
          'line-color': 'black',
          'line-width': 4,
          'line-opacity': 1,
          'line-offset': 4,
        },
      },
      {
        filter: [
          'match',
          ['get', 'name'],
          [
            'Strahl 34 Von Mirow nach Beetz',
            'Strahl 24 Von Gröditz nach Mahlow',
            'Strahl 13 Von Woldegk nach Blankenburg',
            'Strahl 14 Von Pasewalk nach Neu-Hohenschönhausen',
            'Strahl 25a Von Ludwigsfelde nach Stahnsdorf',
            'Strahl 22 Von Ruhland nach Schönefeld',
            'Strahl 29 Von Genthin nach Geltow/Potsdam',
            'Strahl 16 Von Europaradbrücke nach Neu-Hohenschönhausen',
            'Strahl 27 Von Roßlau nach Wannsee RE7',
            'Strahl 15 Von Neuglietzen nach Bernau',
            'Strahl 12 Von Fürstenberg/Havel nach Blankenfelde',
            'Strahl 26 Von Lutherstadt Wittenberg nach Potsdam B2',
            'Strahl 20 Von Fürstenberg (Oder) nach Storkow (Mark)',
            'Strahl 17 Von Groß Neuendorf nach Dahlwitz-Hoppegarten',
            'Strahl 32 Von Grabow nach Heiligensee',
            'Strahl 31 Von Dömitz nach Spandau',
            'Strahl 18 Von Küstrin-Kietz nach Erkner',
            'Strahl 25 Von Torgau nach Marienfelde',
            'Strahl 33 Von Parchim nach Sommerfeld',
            'Strahl 30 Von Röxe nach Spandau/Wilhelmstadt',
            'Strahl 17 gewünschte Route',
            'Strahl 25b Von Ludwigsfelde nach Teltow',
            'Strahl 14 gewünschte Route',
            'Strahl 21 Von Forst (Lausitz) nach Schmöckwitz',
            'Strahl 28 Von Magdeburgerforth nach Potsdam',
            'Strahl 11 Von Neustrelitz nach Hermsdorf',
            'Strahl 23 Von Ruhland nach Buckow',
            'Strahl 19 Von Frankfurt (Oder) nach Köpenick',
            'Strahl 32 a Von Parchim nach Kyritz',
            'Strahl 18a Von Booßen nach Tempelberg',
          ],
          true,
          false,
        ],
        type: 'line',
        id: 'strahl',
        paint: {
          'line-color': 'black',
          'line-width': 4,
          'line-opacity': 1,
          'line-offset': 4,
        },
      },
    ],
  },
]
