// Page wide variables  
var viewModel = null;

// View model for the index page
function IndexViewModel() {
	// Global settings
	this.lang = ko.observable("en");
	this.app = ko.observable("DPT Board");

	// i18n bindings
	this.title = ko.computed(function(){i18n.setLocale(this.lang()); return this.app() + " - " + i18n.__("IndexTitle")}, this);
	this.systemBtn = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("System")}, this);
	this.controlBtn = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("Control")}, this);
	this.graphicControlBtn = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("GraphicControl")}, this);
	this.buttonControlBtn = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("ButtonControl")}, this);
	this.settingsBtn = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("Settings")}, this);
	this.systemTitle = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("System")}, this);
	this.storageTitle = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("Storage")}, this);
	this.neworkTitle = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("Network")}, this);
	
	this.overviewSysName = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("OverviewSysName")}, this);
	this.overviewBoardModel = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("OverviewBoardModel")}, this);
	this.overviewBoardStatus = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("OverviewBoardStatus")}, this);
	this.networkPort1 = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("NetworkPort1")}, this);
	this.networkPort2 = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("NetworkPort2")}, this);
	this.networkWiFiState = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("NeworkWiFiState")}, this);
	this.storageState = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("StorageState")}, this);
	this.storageSpace = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("StorageSpace")}, this);
	this.systemLoadStatus = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("SystemLoad")}, this);
	this.ramUsageStatus = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("RamUsage")}, this);
	
	this.stateOk = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("StateOk")}, this);
	this.stateConnected = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("StateConnected")}, this);
	this.stateNotConnected = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("StateNotConnected")}, this);
	this.stateInstalled = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("StateInstalled")}, this);
	this.stateNotInstalled = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("StateNotInstalled")}, this);
	
	// Data bindings observable
	this.freeStorage = ko.observable(0);
	this.totalStorage = ko.observable(0);
	this.dataSysName = ko.observable("");
	this.dataModelName = ko.observable("");
	this.dataConnStateOne = ko.observable(false);
	this.dataConnStateTwo = ko.observable(false);
	this.dataSSID = ko.observable("");
	this.dataUSBStor = ko.observable("");
	this.dataSystemLoad = ko.observable("");
	this.totalRAM = ko.observable(0);
	this.freeRAM = ko.observable(0);
	
	
	// Data bindings computed 
	this.storageMessage = ko.computed(function(){
		return (this.totalStorage() - this.freeStorage()) + "/" + this.totalStorage() + " Mb";
	}, this);
	
	this.ramMessage = ko.computed(function(){
		freeRamMiB = Math.round((this.freeRAM()/10.24)/100);
		totalRamMiB = Math.round((this.totalRAM()/10.24)/100);
		return (totalRamMiB - freeRamMiB) + "/" + totalRamMiB + " Mb";
	},this);
	
	this.textConnStateOne = ko.computed(function(){
		i18n.setLocale(this.lang());
		return this.dataConnStateOne() ? i18n.__("StateConnected") : i18n.__("StateNotConnected");
	}, this);
	
	this.textConnStateTwo = ko.computed(function(){
		i18n.setLocale(this.lang());
		return this.dataConnStateTwo() ? i18n.__("StateConnected") : i18n.__("StateNotConnected");
	}, this);
	
	this.textUSBStor = ko.computed(function(){
		i18n.setLocale(this.lang());
		switch(this.dataUSBStor()){
			case "mounted":
				return i18n.__("StateInstalledAndMounted");
			case "notmounted":
				return i18n.__("StateInstalledNotMounted");
			case "notinstalled":
				return i18n.__("StateNotInstalled");
		}
	}, this);
	
	// Style bindings
	this.style_storageWidth = ko.computed(function(){
		return ((this.totalStorage() - this.freeStorage())/this.totalStorage())*100;
	}, this);
	
	this.styleConnStateOne = ko.computed(function(){
		return this.dataConnStateOne() ? "label-success" : "label-default";
	}, this);
	
	this.styleConnStateTwo = ko.computed(function(){
		return this.dataConnStateTwo() ? "label-success" : "label-default";
	}, this);
	
	this.styleUSBStor = ko.computed(function(){
		switch(this.dataUSBStor()){
			case "mounted":
				return "label-success";
			case "notmounted":
				return "label-info";
			case "notinstalled":
				return "label-default";
		}
	}, this);
	
	this.style_ramWidth = ko.computed(function(){
		return ((this.totalRAM() - this.freeRAM())/this.totalRAM())*100;
	}, this);
	
	/**
	 * Change the UI locale
	 * @locale: the new UI locale
	 */
	this.setLocale = function(locale) {
		this.lang(locale);
		i18n.setLocale(this.lang());
	}
	
	/**
	 * Set the storage space data
	 * @free the number of free megabytes
	 * @total the full available disk space in megabytes
	 */ 
	this.setDiskSpace = function(free, total) {
		this.freeStorage(free);
		this.totalStorage(total);
	}
	
	/**
	 * Set the USB disk state
	 * @state string displaying disk state information
	 */
	this.setDiskState = function(state) {
		this.dataUSBStor(state);
	}
	
	/**
     * Set the LAN port connection states
	 * @port the first port state, true when connected
	 * @port the second port state, true when connected
	 * @ssid the WiFi network name currently transmitting or connected to
	 */
	this.setConnectionState = function(port1, port2, ssid) {
		this.dataConnStateOne(port1);
		this.dataConnStateTwo(port2);
		this.dataSSID(ssid);
	}
	
	/**
	 * Update board information 
	 * @name the system name
	 * @model the board model
	 */
	this.setBoardInfo = function(name, model) {
		this.dataSysName(name);
		this.dataModelName(model);
	}
	
	/**
	 * Update system statistics
	 * @load the average system load
	 * @totalram the total KiB of RAM installed in the system
	 * @freeram the total KiB of free RAM installed in the system
	 */
	this.setSystemInfo = function(load, totalram, freeram) {
		this.dataSystemLoad(load);
		this.totalRAM(totalram);
		this.freeRAM(freeram);
	}
}

/* Update the information page with polling */
function updateInfo() {
	dpt_getSystemOverview(function(data) {
		// Update the view 
		viewModel.setBoardInfo(data.sysname, data.model);
		viewModel.setConnectionState(data.eth0_connected, data.eth1_connected, data.ssid);
		viewModel.setDiskState(data.usb_state);
		viewModel.setDiskSpace(data.usb_free, data.usb_total);
		viewModel.setSystemInfo(data.system_load, data.ram_total, data.ram_free);
		
		// Start polling
		setTimeout(updateInfo, 1000);
	});
}

$('document').ready(function(){
	// Activate knockout framework
	viewModel = new IndexViewModel();
	ko.applyBindings(viewModel, document.getElementById("htmldoc"));
	
	// Start polling
	updateInfo();
});


