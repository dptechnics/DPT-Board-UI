// Page wide variables  
var viewModel = null;

// View model for the control page
function ViewModel() {
	// Global settings
	this.lang = ko.observable("en");
	this.app = ko.observable("DPT Board");
	this.title = ko.computed(function(){i18n.setLocale(this.lang()); return this.app() + " - " + i18n.__("KuniocontrolTitle")}, this);

	// i18n bindings
	this.kunioOutputPanel = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("KunIOOutputPorts")}, this);
	this.kunioInputPanel = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("KunIOInputPorts")}, this);
	this.kunioInstallPanel = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("KunIOInstalOverview")}, this);
	this.kunioConnectedModules = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("KunIONumberModules")}, this);
	this.kunioConnectedOutputs = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("KunIONumberModules")}, this);
	this.kunioConnectedInputs = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("KunIONumberModules")}, this);

	
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

