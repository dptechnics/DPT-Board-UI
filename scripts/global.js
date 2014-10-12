// Page wide variables  
var viewModel = null;

// Instantiate localisation 
var i18n = new I18n({
    directory: "locales",
    locale: "en",
    extension: ".json"
});

/**
 * Change the UI locale
 * @param {String} locale description: the new locale in two letters
 * @returns {Boolean} description: returns false to prevent event propagation
 */
function setLang(locale) {
    viewModel.setLocale(locale);
    /* Close navbar when open */
    $(".navbar-collapse").stop().css({ 'height': '1px' }).removeClass('in').addClass("collapse");
    $(".navbar-toggle").stop().removeClass('collapsed');
    return false;
}

/**
 * Add the menubar actions to the pages viewmodel
 * @param {Knockout ViewModel} viewmodel description: the page's viewModel
 * @returns {void}
 */
function addGobalViewModelParams(viewmodel)
{
    // Application settings
    viewmodel.app = ko.computed(function(){i18n.setLocale(viewmodel.lang()); return i18n.__("AppName");}, viewmodel);
        
    // I18N bindings
    viewmodel.systemBtn = ko.computed(function(){i18n.setLocale(viewmodel.lang()); return i18n.__("System");}, viewmodel);
    viewmodel.controlBtn = ko.computed(function(){i18n.setLocale(viewmodel.lang()); return i18n.__("Control");}, viewmodel);
    viewmodel.graphicControlBtn = ko.computed(function(){i18n.setLocale(viewmodel.lang()); return i18n.__("GraphicControl");}, viewmodel);
    viewmodel.buttonControlBtn = ko.computed(function(){i18n.setLocale(viewmodel.lang()); return i18n.__("ButtonControl");}, viewmodel);
    viewmodel.robotControlBtn = ko.computed(function(){i18n.setLocale(viewmodel.lang()); return i18n.__("RobotControl");}, viewmodel);
    viewmodel.kunioControlBtn = ko.computed(function(){i18n.setLocale(viewmodel.lang()); return i18n.__("KunioControl");}, viewmodel);	
    viewmodel.settingsBtn = ko.computed(function(){i18n.setLocale(viewmodel.lang()); return i18n.__("Settings");}, viewmodel);
    viewmodel.wifiSettingsBtn = ko.computed(function(){i18n.setLocale(viewmodel.lang()); return i18n.__("WiFiSettings");}, viewmodel);

    /**
     * Change the UI locale
     * @param {String} locale description: the new UI locale
     */
    viewmodel.setLocale = function(locale) {
        viewmodel.lang(locale);
        i18n.setLocale(viewmodel.lang());
    };
}