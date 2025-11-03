// ==UserScript==
// @name         BetterBetterCanvas
// @namespace    mailto:ryanmichaelgarber@gmail.com
// @version      1.0.0
// @description  Enhances the BetterCanvas experience with additional features and improvements.
// @author       Ryan Garber
// @match        *://learn.vccs.edu/*
// @grant        GM.log
// @grant        GM.addStyle
// @grant        GM.getResourceText
// @resource     CSS index.user.css
// @run-at       document-idle
// @license      MIT
// ==/UserScript==

const BBC = {

    log: (message) => {
        GM.log(`[BBC] ${message}`);
    },

    start: async () => {
        BBC.log('Starting BetterBetterCanvas...');

        BBC.log('Adding styles...');
        const css = await GM.getResourceText('CSS');
        GM.addStyle(css);
        BBC.addStyleToShadow('atomic-search-desktop-widget', css);

        BBC.log('Started!'); 
    },

    addStyleToShadow: (name, css) => {
        const shadow = document.querySelector(name)?.shadowRoot;
        if (!shadow) {
            setTimeout(() => BBC.addStyleToShadow(name, css), 100);
            return;
        }

        BBC.log(`Found shadow '${name}', adding styles...`);
        const stylesheet = new CSSStyleSheet();
        stylesheet.replaceSync(css);
        shadow.adoptedStyleSheets.push(stylesheet);
    }

}

if (!unsafeWindow.BBC) {
    unsafeWindow.BBC = BBC;
    BBC.start();
}
