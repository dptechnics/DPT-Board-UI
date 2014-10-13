/**
 * The page viewmodel, gvm is auto-instantiated in global.js
 * @param {Knockout viewmodel} gvm description: the global knockout viewmodel
 * @returns {void}
 */
function pageViewModel(gvm) {
    // Page title
    gvm.title = ko.computed(function(){i18n.setLocale(gvm.lang()); return gvm.app() + " - " + i18n.__("KuniocontrolTitle");}, gvm);

    // I18N bindings
    gvm.kunioOutputPanel = ko.computed(function(){i18n.setLocale(gvm.lang()); return i18n.__("KunIOOutputPorts");}, gvm);
    gvm.kunioInputPanel = ko.computed(function(){i18n.setLocale(gvm.lang()); return i18n.__("KunIOInputPorts");}, gvm);
    gvm.kunioInstallPanel = ko.computed(function(){i18n.setLocale(gvm.lang()); return i18n.__("KunIOInstalOverview");}, gvm);
    gvm.kunioConnectedModules = ko.computed(function(){i18n.setLocale(gvm.lang()); return i18n.__("KunIONumberModules");}, gvm);
    gvm.kunioConnectedOutputs = ko.computed(function(){i18n.setLocale(gvm.lang()); return i18n.__("KunIONumberModules");}, gvm);
    gvm.kunioConnectedInputs = ko.computed(function(){i18n.setLocale(gvm.lang()); return i18n.__("KunIONumberModules");}, gvm);
}