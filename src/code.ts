function doGet(req: GoogleAppsScript.Events.AppsScriptHttpRequestEvent): GoogleAppsScript.HTML.HtmlOutput {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('すやすやおやすみさん')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, user-scalable=no');
}

function include(filename: string): string {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
