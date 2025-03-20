// ==UserScript==
// @name         atlas local / staging / production switcher
// @namespace    http://tampermonkey.net/
// @version      2024-06-07
// @description  adds a menu in the top left corner to switch between localdev, staging and production sites
// @author       el sueño
// @match        https://tilda-geo.de/*
// @match        https://staging.tilda-geo.de/*
// @match        http://127.0.0.1:5173/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=radverkehrsatlas.de
// @grant        none
// ==/UserScript==

;(function () {
  'use strict'

  function getAttrs(origin) {
    const base = `
        background: #666;
        border: 1px solid white;
        margin: 2px 0;
        padding: 0 6px;
        border-radius: 3px;
    `
    const active = `
        background: #F99;
        cursor: default;
    `
    const style = `style="${location.origin === origin ? base + active : base}"`
    const onclick =
      location.origin === origin
        ? ''
        : `onClick="
          (
            () => {
              location = location.toString().replace(location.origin, '${origin}');
              return false;
            }
          )();
          return false;
        "`
    return [style, onclick].join(' ')
  }

  function addSwitcher() {
    const LOCAL = 'http://127.0.0.1:5173'
    const STAGING = 'https://staging.tilda-geo.de'
    const PRODUCTION = 'https://tilda-geo.de'

    document.getElementById('switcher')?.remove()
    document.body.insertAdjacentHTML(
      'beforeend',
      `<div
        id="switcher"
        style="
            background: black;
            color: white;
            border-right: 1px solid white;
            border-bottom: 1px solid white;
            border-bottom-right-radius: 6px;
            padding: 3px 6px;
            position: absolute;
            z-index: 9999;
            cursor: default;
        "
    >
        <button ${getAttrs(LOCAL)}>L</button>
        <button ${getAttrs(STAGING)}>S</button>
        <button ${getAttrs(PRODUCTION)}>P</button>

    </div>`,
    )
  }

  window.addEventListener('load', (event) => {
    setTimeout(addSwitcher, 5000)
  })
})()
