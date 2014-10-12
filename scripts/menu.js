/*
 * Process menu button bindings, this must be called
 * before applying bindings
 */
function addMenuBindings(viewmodel)
{
	viewmodel.systemBtn = ko.computed(function(){i18n.setLocale(viewmodel.lang()); return i18n.__("System")}, viewmodel);
	viewmodel.controlBtn = ko.computed(function(){i18n.setLocale(viewmodel.lang()); return i18n.__("Control")}, viewmodel);
	viewmodel.graphicControlBtn = ko.computed(function(){i18n.setLocale(viewmodel.lang()); return i18n.__("GraphicControl")}, viewmodel);
	viewmodel.buttonControlBtn = ko.computed(function(){i18n.setLocale(viewmodel.lang()); return i18n.__("ButtonControl")}, viewmodel);
	viewmodel.robotControlBtn = ko.computed(function(){i18n.setLocale(viewmodel.lang()); return i18n.__("RobotControl")}, viewmodel);
	viewmodel.kunioControlBtn = ko.computed(function(){i18n.setLocale(viewmodel.lang()); return i18n.__("KunioControl")}, viewmodel);	
	viewmodel.settingsBtn = ko.computed(function(){i18n.setLocale(viewmodel.lang()); return i18n.__("Settings")}, viewmodel);
	viewmodel.wifiSettingsBtn = ko.computed(function(){i18n.setLocale(viewmodel.lang()); return i18n.__("WiFiSettings")}, viewmodel);
}