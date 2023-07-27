import { FeatureCollection } from 'geojson'
import React from 'react'
import { CircleLayer, Layer, Source, useMap } from 'react-map-gl'

export const DynamicSources: React.FC = () => {
  const { mainMap } = useMap()

  const geodata: FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [9.1056061, 48.9143774],
        },
        properties: {
          id: 3758142,
          url: 'https://api.openstreetmap.org/api/0.6/notes/3758142.json',
          comment_url: 'https://api.openstreetmap.org/api/0.6/notes/3758142/comment.json',
          close_url: 'https://api.openstreetmap.org/api/0.6/notes/3758142/close.json',
          date_created: '2023-06-30 08:23:31 UTC',
          status: 'open',
          comments: [
            {
              date: '2023-06-30 08:23:31 UTC',
              action: 'opened',
              text: 'Die Stadt Markgröningen hat wegen erheblicher Sicherheitsmängel den Weg durch das Leudelsbachtal vom Klärwerk an bis Mitte 2024 vollständig gesperrt.',
              html: '<p>Die Stadt Markgröningen hat wegen erheblicher Sicherheitsmängel den Weg durch das Leudelsbachtal vom Klärwerk an bis Mitte 2024 vollständig gesperrt.</p>',
            },
            {
              date: '2023-07-26 11:30:12 UTC',
              uid: 1068246,
              user: 'ghostrider44',
              user_url: 'https://api.openstreetmap.org/user/ghostrider44',
              action: 'commented',
              text: 'Hier befindet sich kein Leudelsbach. Diese Stelle hier ist auf Gemarkung Tamm. \nDer Weg am Leudelsbach Höhe Kläranlage sollte noch geprüft werden.',
              html: '<p>Hier befindet sich kein Leudelsbach. Diese Stelle hier ist auf Gemarkung Tamm. \n<br />Der Weg am Leudelsbach Höhe Kläranlage sollte noch geprüft werden.</p>',
            },
          ],
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [9.3904653, 48.9675118],
        },
        properties: {
          id: 3798360,
          url: 'https://api.openstreetmap.org/api/0.6/notes/3798360.json',
          comment_url: 'https://api.openstreetmap.org/api/0.6/notes/3798360/comment.json',
          close_url: 'https://api.openstreetmap.org/api/0.6/notes/3798360/close.json',
          date_created: '2023-07-25 12:44:35 UTC',
          status: 'open',
          comments: [
            {
              date: '2023-07-25 12:44:35 UTC',
              uid: 19979070,
              user: 'Michael Strecker',
              user_url: 'https://api.openstreetmap.org/user/Michael%20Strecker',
              action: 'opened',
              text: 'Unable to answer "What are the opening hours here?" for https://osm.org/way/200494570 via StreetComplete 53.3:\n\nIt\'s an inactive beekeeper.',
              html: '<p>Unable to answer "What are the opening hours here?" for <a href="https://osm.org/way/200494570" rel="nofollow noopener noreferrer">https://osm.org/way/200494570</a> via StreetComplete 53.3:</p>\n\n<p>It\'s an inactive beekeeper.</p>',
            },
          ],
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [9.1284263, 48.9603999],
        },
        properties: {
          id: 3798197,
          url: 'https://api.openstreetmap.org/api/0.6/notes/3798197.json',
          comment_url: 'https://api.openstreetmap.org/api/0.6/notes/3798197/comment.json',
          close_url: 'https://api.openstreetmap.org/api/0.6/notes/3798197/close.json',
          date_created: '2023-07-25 11:51:04 UTC',
          status: 'open',
          comments: [
            {
              date: '2023-07-25 11:51:04 UTC',
              action: 'opened',
              text: 'Haug gibt es nicht mehr. Jetzt Versicherungsbüro',
              html: '<p>Haug gibt es nicht mehr. Jetzt Versicherungsbüro</p>',
            },
          ],
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [9.1263433, 48.9208539],
        },
        properties: {
          id: 3188399,
          url: 'https://api.openstreetmap.org/api/0.6/notes/3188399.json',
          comment_url: 'https://api.openstreetmap.org/api/0.6/notes/3188399/comment.json',
          close_url: 'https://api.openstreetmap.org/api/0.6/notes/3188399/close.json',
          date_created: '2022-05-21 10:18:37 UTC',
          status: 'open',
          comments: [
            {
              date: '2022-05-21 10:18:37 UTC',
              uid: 364163,
              user: 'st0rm-r1der',
              user_url: 'https://api.openstreetmap.org/user/st0rm-r1der',
              action: 'opened',
              text: 'Unable to answer "How many levels above the basement does this building have?" for https://osm.org/way/1029113143 via StreetComplete 43.1:\n\nTankstellen Dach',
              html: '<p>Unable to answer "How many levels above the basement does this building have?" for <a href="https://osm.org/way/1029113143" rel="nofollow noopener noreferrer">https://osm.org/way/1029113143</a> via StreetComplete 43.1:</p>\n\n<p>Tankstellen Dach</p>',
            },
            {
              date: '2022-09-18 14:50:24 UTC',
              uid: 14015983,
              user: 'jcrm07',
              user_url: 'https://api.openstreetmap.org/user/jcrm07',
              action: 'commented',
              text: '3 etagen',
              html: '<p>3 etagen</p>',
            },
            {
              date: '2023-06-25 18:52:58 UTC',
              uid: 13498153,
              user: 'Lizium',
              user_url: 'https://api.openstreetmap.org/user/Lizium',
              action: 'commented',
              text: 'das ist nicht das tankstellendach! \ndie hausnummern hier sind völlig durcheinander 26 ist zwischen 28 und 30?! \nbitte vor Ort korrigieren!',
              html: '<p>das ist nicht das tankstellendach! \n<br />die hausnummern hier sind völlig durcheinander 26 ist zwischen 28 und 30?! \n<br />bitte vor Ort korrigieren!</p>',
            },
            {
              date: '2023-07-01 14:16:22 UTC',
              uid: 364163,
              user: 'st0rm-r1der',
              user_url: 'https://api.openstreetmap.org/user/st0rm-r1der',
              action: 'commented',
              text: 'Vor Ort geprüft, 26 ist die Tankstelle, die 30 stimmt auch. Die 28 habe ich nicht auf Anhieb gefunden.',
              html: '<p>Vor Ort geprüft, 26 ist die Tankstelle, die 30 stimmt auch. Die 28 habe ich nicht auf Anhieb gefunden.</p>',
            },
            {
              date: '2023-07-01 17:16:57 UTC',
              uid: 364163,
              user: 'st0rm-r1der',
              user_url: 'https://api.openstreetmap.org/user/st0rm-r1der',
              action: 'commented',
              text: 'Vor Ort geprüft, 26 ist die Tankstelle, die 30 stimmt auch. Die 28 habe ich nicht auf Anhieb gefunden.',
              html: '<p>Vor Ort geprüft, 26 ist die Tankstelle, die 30 stimmt auch. Die 28 habe ich nicht auf Anhieb gefunden.</p>',
            },
            {
              date: '2023-07-01 17:22:50 UTC',
              uid: 364163,
              user: 'st0rm-r1der',
              user_url: 'https://api.openstreetmap.org/user/st0rm-r1der',
              action: 'commented',
              text: 'Das Problem hier ist, das es ein Gebäudekomplex ist.\nEine Lücke zwischen 26 und 3 gibt s auch nicht wirklich, da ist der hintere Teil der tankstelle/verkauf/lager',
              html: '<p>Das Problem hier ist, das es ein Gebäudekomplex ist.\n<br />Eine Lücke zwischen 26 und 3 gibt s auch nicht wirklich, da ist der hintere Teil der tankstelle/verkauf/lager</p>',
            },
            {
              date: '2023-07-23 18:06:43 UTC',
              uid: 14015983,
              user: 'jcrm07',
              user_url: 'https://api.openstreetmap.org/user/jcrm07',
              action: 'commented',
              text: '3 Etagen über der Tankstelle',
              html: '<p>3 Etagen über der Tankstelle</p>',
            },
          ],
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [9.125315, 48.9213079],
        },
        properties: {
          id: 3795222,
          url: 'https://api.openstreetmap.org/api/0.6/notes/3795222.json',
          comment_url: 'https://api.openstreetmap.org/api/0.6/notes/3795222/comment.json',
          close_url: 'https://api.openstreetmap.org/api/0.6/notes/3795222/close.json',
          date_created: '2023-07-23 17:53:59 UTC',
          status: 'open',
          comments: [
            {
              date: '2023-07-23 17:53:59 UTC',
              uid: 14015983,
              user: 'jcrm07',
              user_url: 'https://api.openstreetmap.org/user/jcrm07',
              action: 'opened',
              text: 'Geschlossen, Gebäude wird renoviert',
              html: '<p>Geschlossen, Gebäude wird renoviert</p>',
            },
          ],
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [9.3750351, 48.9281407],
        },
        properties: {
          id: 2043485,
          url: 'https://api.openstreetmap.org/api/0.6/notes/2043485.json',
          reopen_url: 'https://api.openstreetmap.org/api/0.6/notes/2043485/reopen.json',
          date_created: '2020-01-02 08:52:05 UTC',
          status: 'closed',
          closed_at: '2023-07-23 13:28:36 UTC',
          comments: [
            {
              date: '2020-01-02 08:52:05 UTC',
              uid: 10609701,
              user: 'bube1976',
              user_url: 'https://api.openstreetmap.org/user/bube1976',
              action: 'opened',
              text: 'komplizierteres Dach, da mehrer Anbauten\n\nvia StreetComplete 15.0\n\nAttached photo(s):\nhttps://westnordost.de/p/8823.jpg',
              html: '<p>komplizierteres Dach, da mehrer Anbauten</p>\n\n<p>via StreetComplete 15.0</p>\n\n<p>Attached photo(s):\n<br /><a href="https://westnordost.de/p/8823.jpg" rel="nofollow noopener noreferrer">https://westnordost.de/p/8823.jpg</a></p>',
            },
            {
              date: '2023-07-23 13:28:37 UTC',
              uid: 12705050,
              user: 'ticki_52',
              user_url: 'https://api.openstreetmap.org/user/ticki_52',
              action: 'closed',
              text: 'Was ist daran "kompliziert"? Das sind halt mehrere Satteldächer aneinander gebaut. Hab mal den anbau vom Hauptgebäude getrennt getagt. Sollte so passen.',
              html: '<p>Was ist daran "kompliziert"? Das sind halt mehrere Satteldächer aneinander gebaut. Hab mal den anbau vom Hauptgebäude getrennt getagt. Sollte so passen.</p>',
            },
          ],
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [9.3661438, 48.9295493],
        },
        properties: {
          id: 3603862,
          url: 'https://api.openstreetmap.org/api/0.6/notes/3603862.json',
          reopen_url: 'https://api.openstreetmap.org/api/0.6/notes/3603862/reopen.json',
          date_created: '2023-03-19 07:03:07 UTC',
          status: 'closed',
          closed_at: '2023-07-23 13:28:36 UTC',
          comments: [
            {
              date: '2023-03-19 07:03:07 UTC',
              uid: 15398,
              user: 'mappy123',
              user_url: 'https://api.openstreetmap.org/user/mappy123',
              action: 'opened',
              text: 'Nr. 55 doppelt, was stimmt?',
              html: '<p>Nr. 55 doppelt, was stimmt?</p>',
            },
            {
              date: '2023-07-23 13:28:36 UTC',
              uid: 12705050,
              user: 'ticki_52',
              user_url: 'https://api.openstreetmap.org/user/ticki_52',
              action: 'closed',
              text: 'erl.',
              html: '<p>erl.</p>',
            },
          ],
        },
      },
    ],
  }

  const layerProps: CircleLayer = {
    id: 'osmnoteslayer',
    source: 'osm-notes',
    // 'source-layer': 'default', // set in `datasets/process.cjs`
    type: 'circle',
    layout: {
      visibility: 'visible',
    },
    paint: {
      'circle-radius': 5,
      'circle-color': 'red',
      'circle-stroke-width': 1,
    },
  }

  return (
    <Source
      id="osm-notes"
      key="osm-notes"
      type="geojson"
      data={geodata}
      attribution="Source osm.org"
    >
      <Layer key="osmnoteslayer" {...layerProps} />
      {/* To get LayerHighlight working some more refactoring is needed to harmoize sourceData and datasetsData */}
      {/* <LayerHighlight {...layerProps} /> */}
    </Source>
  )
}
