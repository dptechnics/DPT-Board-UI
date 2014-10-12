// Page wide variables  
var viewModel = null;

// View model for the control page
function ViewModel() {
	// Global settings
	this.lang = ko.observable("en");
	this.app = ko.observable("DPT Board");
	this.title = ko.computed(function(){i18n.setLocale(this.lang()); return this.app() + " - " + i18n.__("GraphcontrolTitle")}, this);

	
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
	$('#extern-menu').load('menu.html', function(){
		// Activate knockout framework
		viewModel = new ViewModel();
		addMenuBindings(viewModel);
		ko.applyBindings(viewModel, document.getElementById("htmldoc"));
		
		// Install module SVG handlers
		installModuleHandlers();
	
		// Start polling
		updateInfo();
	});
});

