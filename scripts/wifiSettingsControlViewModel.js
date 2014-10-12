/**
 * The page's viewmodel
 * @returns {void}
 */
function ViewModel() {
        // Viewmodel language
        this.lang = ko.observable("en");
        
	// Page title
	this.title = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("AppName") + " - " + i18n.__("WiFiSettingsTitle");}, this);
	
	// Page buttons 
	this.wifiStatusTitle = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("WiFiStatus");}, this);
	this.wifiMode = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("WiFiMode");}, this);
	this.signalStrength = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("WiFiSignalStrength");}, this);
	
	// Data bindings 
	this.strengthMessage = ko.observable('0%');
	
	// Style bindings
	this.style_wifiStrength = ko.computed(function(){
		return 35;
	}, this);
}

/**
 * This function is called after viewmodel setup to 
 * start a polling operation for page refresh. Timer
 * setup should occur in this function for good
 * error handling. 
 * @returns {void}
 */
function updateInfo() {

}

/**
 * Page initialisation function
 */
$('document').ready(function(){
    $('#extern-menu').load('menu.html', function(){
        // Activate knockout framework
        viewModel = new ViewModel();
        addGobalViewModelParams(viewModel);
        ko.applyBindings(viewModel, document.getElementById("htmldoc"));

        // Start polling
        updateInfo();
    });
});

