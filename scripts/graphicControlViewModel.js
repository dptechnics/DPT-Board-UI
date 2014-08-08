// Page wide variables  
var viewModel = null;

// View model for the control page
function IndexViewModel() {
	// Global settings
	this.lang = ko.observable("en");
	this.app = ko.observable("DPT Board");

	// i18n bindings
	this.title = ko.computed(function(){i18n.setLocale(this.lang()); return this.app() + " - " + i18n.__("GraphcontrolTitle")}, this);
	this.systemBtn = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("System")}, this);
	this.controlBtn = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("Control")}, this);
	this.graphicControlBtn = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("GraphicControl")}, this);
	this.buttonControlBtn = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("ButtonControl")}, this);
	this.settingsBtn = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("Settings")}, this);
	this.systemTitle = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("System")}, this);
	this.storageTitle = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("Storage")}, this);
	this.neworkTitle = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("Network")}, this);
	
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

function installModuleHandlers(){
	$('#io7').click(function(){
		dpt_toggleIO("7");
	});
	
	$('#io6').click(function(){
		dpt_toggleIO("6");
	});
}

$('document').ready(function(){
	// Activate knockout framework
	viewModel = new IndexViewModel();
	ko.applyBindings(viewModel, document.getElementById("htmldoc"));
	
	// Install module SVG handlers
	installModuleHandlers();
	
	// Start polling
	updateInfo();
});

