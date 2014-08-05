// Page wide variables  
var viewModel = null;

// View model for the control page
function IndexViewModel() {
	// Global settings
	this.lang = ko.observable("en");
	this.app = ko.observable("DPT Module");

	// i18n bindings
	this.title = ko.computed(function(){i18n.setLocale(this.lang()); return this.app() + " - " + i18n.__("ButtoncontrolTitle")}, this);
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

/* Toggle an IO pin on the board 
 * @name the name of the io pin, only the number
 */
function togleIO(name){
	
	// Get the current pin state 
	$.getJSON(AJAX_PREFXIX + '/api/gpio/' + name, function(data) {
		// Toggle the pin
		$.ajax({
			type: "PUT",
			contentType: "application/json; charset=utf-8",
			url: AJAX_PREFXIX + '/api/gpio/' + name + '/' + (data.state == 0 ? 1 : 0),
			dataType: "json"
		});
	});
}

function installModuleHandlers(){
	$('#io7').click(function(){
		togleIO("7");
	});
	
	$('#io6').click(function(){
		togleIO("6");
	});
}

$('document').ready(function(){
	// Activate knockout framework
	viewModel = new IndexViewModel();
	ko.applyBindings(viewModel, document.getElementById("htmldoc"));
	
	// Install bootstrap-switch on selected checkboxes
	 $('input:checkbox').bootstrapSwitch();
	
	// Install module button handlers
	installModuleHandlers();
	
	// Start polling
	updateInfo();
});

