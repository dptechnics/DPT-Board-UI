// View model for the index page
function IndexViewModel() {
	// Global settings
	this.lang = ko.observable("en");
	this.app = ko.observable("DPT WoodBOX");

	// i18n bindings
	this.title = ko.computed(function(){i18n.setLocale(this.lang()); return this.app() + " - " + i18n.__("Index")}, this);
	this.overviewBtn = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("Overview")}, this);
	this.multimediaBtn = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("Multimedia")}, this);
	this.settingsBtn = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("Settings")}, this);
	this.systemTitle = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("System")}, this);
	this.storageTitle = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("Storage")}, this);
	this.neworkTitle = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("Network")}, this);
	
	this.overviewNasName = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("OverviewNasName")}, this);
	this.overviewNasModel = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("OverviewNasModel")}, this);
	this.overviewNasStatus = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("OverviewNasStatus")}, this);
	this.networkPort1 = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("NetworkPort1")}, this);
	this.networkPort2 = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("NetworkPort2")}, this);
	this.networkWiFiState = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("NeworkWiFiState")}, this);
	this.storageState = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("StorageState")}, this);
	this.storageSpace = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("StorageSpace")}, this);
	
	this.stateOk = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("StateOk")}, this);
	this.stateConnected = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("StateConnected")}, this);
	this.stateNotConnected = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("StateNotConnected")}, this);
	this.stateInstalled = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("StateInstalled")}, this);
	this.stateNotInstalled = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("StateNotInstalled")}, this);
	
	/**
	 * Change the UI locale
	 * @locale: the new UI locale
	 */
	this.setLocale = function(locale) {
		this.lang(locale);
		i18n.setLocale(this.lang());
	}
}

// Activate knockout framework
var viewModel = new IndexViewModel();
ko.applyBindings(viewModel, document.getElementById("htmldoc"));