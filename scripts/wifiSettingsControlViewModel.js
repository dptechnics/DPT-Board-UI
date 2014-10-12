// Page wide variables  
var viewModel = null;

// View model for the control page
function ViewModel() {
	// Global settings
	this.lang = ko.observable("en");
	this.app = ko.observable("DPT Board");
	this.title = ko.computed(function(){i18n.setLocale(this.lang()); return this.app() + " - " + i18n.__("WiFiSettingsTitle")}, this);
	
	// Page buttons 
	this.wifiStatusTitle = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("WiFiStatus")}, this);
	this.wifiMode = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("WiFiMode")}, this);
	this.signalStrength = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("WiFiSignalStrength")}, this);
	
	// Data bindings 
	this.strengthMessage = ko.observable('0%');
	
	// Style bindings
	this.style_wifiStrength = ko.computed(function(){
		return 35;
	}, this);
	
	/**
	 * Change the UI locale
	 * @locale: the new UI locale
	 */
	this.setLocale = function(locale) {
		this.lang(locale);
		i18n.setLocale(this.lang());
	}
}

/* Update the information page with polling */
function updateInfo() {

}

$('document').ready(function(){
	
	$('#extern-menu').load('menu.html', function(){
		// Activate knockout framework
		viewModel = new ViewModel();
		addMenuBindings(viewModel);
		ko.applyBindings(viewModel, document.getElementById("htmldoc"));
		
		// Start polling
		updateInfo();
	});
});

