/**
 * The page viewmodel, this is auto-instantiated in global.js
 * @param {Knockout viewmodel} gvm - the global knockout viewmodel
 * @returns {void}
 */
function pageViewModel(gvm) {
    // Page title
    gvm.title = ko.computed(function(){i18n.setLocale(gvm.lang()); return gvm.app() + " - " + i18n.__("WiFiSettingsTitle");}, gvm);

    // Page buttons 
    gvm.wifiStatusTitle = ko.computed(function(){i18n.setLocale(gvm.lang()); return i18n.__("WiFiStatus");}, gvm);
    gvm.wifiMode = ko.computed(function(){i18n.setLocale(gvm.lang()); return i18n.__("WiFiMode");}, this);
    gvm.signalStrength = ko.computed(function(){i18n.setLocale(gvm.lang()); return i18n.__("WiFiSignalStrength");}, gvm);

    // Data bindings 
    gvm.strengthMessage = ko.observable('0%');

    // Style bindings
    gvm.style_wifiStrength = ko.computed(function(){
        return 35;
    }, this);
}