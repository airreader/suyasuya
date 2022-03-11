// Compiled using ts2gas 3.4.4 (TypeScript 3.5.3)
var exports = exports || {};
var module = module || { exports: exports };
function doGet(req) {
    return HtmlService.createTemplateFromFile('index').evaluate().setTitle('すやすやおやすみさん').addMetaTag('viewport', 'width=device-width, initial-scale=1, user-scalable=no');
}
function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
