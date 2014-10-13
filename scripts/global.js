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
 * @param {string} locale - the new locale in two letters
 * @returns {boolean} returns false to prevent event propagation
 */
function setLang(locale) {
    viewModel.setLocale(locale);
    
    // Close navbar when open
    $(".navbar-collapse").stop().css({ 'height': '1px' }).removeClass('in').addClass("collapse");
    $(".navbar-toggle").stop().removeClass('collapsed');
    return false;
}

/**
 * The system global viewmodel
 * @returns {GlobalViewModel}
 */
function GlobalViewModel()
{
    // Application settings
    this.lang = ko.observable("en");
    this.app = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("AppName");}, this);
        
    // I18N bindings
    this.systemBtn = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("System");}, this);
    this.controlBtn = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("Control");}, this);
    this.graphicControlBtn = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("GraphicControl");}, this);
    this.buttonControlBtn = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("ButtonControl");}, this);
    this.robotControlBtn = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("RobotControl");}, this);
    this.kunioControlBtn = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("KunioControl");}, this);	
    this.settingsBtn = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("Settings");}, this);
    this.wifiSettingsBtn = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("WiFiSettings");}, this);

    /**
     * Change the UI locale
     * @param {string} locale - the new UI locale
     */
    this.setLocale = function(locale) {
        this.lang(locale);
        i18n.setLocale(this.lang());
    };
    
    // Instantiate page viewmodel
    pageViewModel(this);
}

/**
 * This function is called after page initialisation. 
 * When a function calld 'updateInfo' is active this
 * will be called every second. 
 * @returns {void}
 */
function pollingFunc() {
    // Start polling if this function is present 
    if(typeof updateInfo == 'function'){
        if(updateInfo()){
            // Start polling
            setTimeout(updateInfo, 1000);    
        }
    }
}

/**
 * Page initialisation function
 */
$('document').ready(function(){
    $('#extern-menu').load('menu.html', function(){
        // Activate knockout framework
        viewModel = new GlobalViewModel();
        ko.applyBindings(viewModel, document.getElementById("htmldoc"));
        
        // Execute page specific initialisation if present
        if(typeof initPage == 'function'){
            initPage();
        }
        
        // Call the polling function
        pollingFunc();
    });
});