// Page wide variables  
var viewModel = null;

// View model for the control page
function ViewModel() {
	// Global settings
	this.lang = ko.observable("en");
	this.app = ko.observable("DPT Board");
	this.title = ko.computed(function(){i18n.setLocale(this.lang()); return this.app() + " - " + i18n.__("RobotcontrolTitle")}, this);

	// i18n bindings
	
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
 * Initialise the buttons
 */
function initButtonHandlers() {
	$('#btn-forward').on('touchstart mousedown',function(){
		dptr_moveForward();
	});
	
	$('#btn-forward').on('touchend mouseup',function(){
		dptr_stopMotor();
	});
	
	$('#btn-backward').on('touchstart mousedown',function(){
		dptr_moveBackward();
	});
	
	$('#btn-backward').on('touchend mouseup',function(){
		dptr_stopMotor();
	});
	
	$('#btn-left').on('touchstart mousedown',function(){
		dptr_moveLeft();
	});
	
	$('#btn-left').on('touchend mouseup',function(){
		dptr_stopMotor();
	});
	
	$('#btn-right').on('touchstart mousedown',function(){
		dptr_moveRight();
	});
	
	$('#btn-right').on('touchend mouseup',function(){
		dptr_stopMotor();
	});
}

/* Update the information page with polling */
function updateInfo() {

}

$('document').ready(function(){	
	$('#extern-menu').load('menu.html', function(){
		// Initialise buttons 
		initButtonHandlers();
	
		// Activate knockout framework
		viewModel = new ViewModel();
		addMenuBindings(viewModel);
		ko.applyBindings(viewModel, document.getElementById("htmldoc"));
		
		// Start polling
		updateInfo();
	});
});

