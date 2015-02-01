/**
 * The page viewmodel, this is auto-instantiated in global.js
 * @param {Knockout viewmodel} gvm - the global knockout viewmodel
 * @returns {void}
 */
function pageViewModel(gvm) {
    // Page title
    gvm.title = ko.computed(function(){i18n.setLocale(gvm.lang()); return gvm.app() + " - " + i18n.__("FirmwareSettings");}, gvm);

    // Page buttons 
    gvm.firmwareStatusTitle = ko.computed(function(){i18n.setLocale(gvm.lang()); return i18n.__("FirmwareStatus");}, gvm);
    gvm.firmwareCheckBtn = ko.computed(function(){i18n.setLocale(gvm.lang()); return i18n.__("FirmwareCheckBtn");}, this);
    
    gvm.firmwareStatus = ko.computed(function(){i18n.setLocale(gvm.lang()); return i18n.__("FirmwareUpToDate");}, gvm);
    gvm.firmwareRelease = ko.computed(function(){i18n.setLocale(gvm.lang()); return i18n.__("FirmwareRelease");}, gvm);
    gvm.firmwareVersion = ko.computed(function(){i18n.setLocale(gvm.lang()); return i18n.__("FirmwareVersion");}, gvm);
    gvm.firmwareChangelog = ko.computed(function(){i18n.setLocale(gvm.lang()); return i18n.__("FirmwareChangelog");}, gvm);
    
    /* Data bindings */
    gvm.uptodate = ko.observable(false);
    gvm.releasedate = ko.observable("");
    gvm.version = ko.observable("");
    gvm.changelog = ko.observableArray();
    
    
    /* Up to date info text binding and style binding */
    gvm.firmwareStatusLabel = ko.computed(function(){
        i18n.setLocale(gvm.lang()); 
        return gvm.uptodate() ? i18n.__("FirmwareNoNewVersion") : i18n.__("FirmwareNewVersion");
    }, gvm);
    gvm.firmwareStatusStyle = ko.computed(function() {
        return gvm.uptodate ? "label-success" : "label-warning";
    }, viewModel);
    
    
}

function initPage() {
    dpt_getFirmwareInfo(function(data){
        viewModel.uptodate(data['up-to-date']);
        viewModel.releasedate(data['release-date']);
        viewModel.version(data['version']);
    },function(error){
        alert("Could not load firmware information")
    });
}