// Page wide variables  
var viewModel = null;

// View model for the control page
function ViewModel() {
	// Global settings
	this.lang = ko.observable("en");
	this.app = ko.observable("DPT Board");
	this.title = ko.computed(function(){i18n.setLocale(this.lang()); return this.app() + " - " + i18n.__("ButtoncontrolTitle")}, this);
	
	// The IO buttons observable array
	this.buttons = ko.observableArray([]);
	
	// Add an IO port button
	this.addIOButton = function(btnr)
	{
		// Fill up the template
		this.buttons.push({
				text: 'IO port ' + btnr,
				iobutton: false,
				number: btnr
		});
		
		// Attach a handler to button
		$('#iobutton-' + btnr).bind('switch-change', function(event, data){
			// Set the IO port on the new state
			dpt_setIO(btnr, data.value);
		});
		
	}
	
	/**
	 * Change the UI locale
	 * @locale: the new UI locale
	 */
	this.setLocale = function(locale) {
		this.lang(locale);
		i18n.setLocale(this.lang());
	}
}

/* 
 * Set the state of a button.
 * @btnr: the number of the button. 
 * @state: the new button state.
 */
function setIOBtnState(btnr, state)
{
		$('#iobutton-' + btnr).bootstrapSwitch('setState', state);
}

/*
 * Initialise IO ports
 */
function initIOPorts() {
	dpt_getIOLayout(function(nrports, ports){
		
		// Add a button for every port 
		for(i = 0; i < nrports; ++i) {
			// Append button to HTML DOM
			viewModel.addIOButton(ports[i]);
		}
	});
}

/* Update the information page with polling */
function updateInfo() {

}

$('document').ready(function(){
	$('#extern-menu').load('menu.html', function(){
		// Initialise buttons 
		initIOPorts();
	
		// Activate knockout framework
		viewModel = new ViewModel();
		addMenuBindings(viewModel);
		ko.applyBindings(viewModel, document.getElementById("htmldoc"));
		
		// Start polling
		updateInfo();
	});
});

