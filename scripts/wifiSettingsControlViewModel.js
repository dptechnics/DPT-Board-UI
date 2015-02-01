/**
 * The page viewmodel, this is auto-instantiated in global.js
 * @param {Knockout viewmodel} gvm - the global knockout viewmodel
 * @returns {void}
 */
function pageViewModel(gvm) {
    // Page title
    gvm.title = ko.computed(function(){i18n.setLocale(gvm.lang()); return gvm.app() + " - " + i18n.__("WiFiSettingsTitle");}, gvm);

    // Page buttons 
    gvm.wifiStatusTitle = ko.computed(function(){i18n.setLocale(gvm.lang()); return i18n.__("WiFiStatus");}, gvm);
    gvm.wifiMode = ko.computed(function(){i18n.setLocale(gvm.lang()); return i18n.__("WiFiMode");}, this);
    gvm.signalStrength = ko.computed(function(){i18n.setLocale(gvm.lang()); return i18n.__("WiFiSignalStrength");}, gvm);
    gvm.wifiAvailableNetworks = ko.computed(function(){i18n.setLocale(gvm.lang()); return i18n.__("wifiAvailableNetworks");}, gvm);
    gvm.wifiSecurity = ko.computed(function(){i18n.setLocale(gvm.lang()); return i18n.__("WiFiSecurity");}, gvm);

    // Data bindings 
    gvm.strengthMessage = ko.observable('0%');
    gvm.wifiNeworks = ko.observableArray([]);

    // Style bindings
    gvm.style_wifiStrength = ko.computed(function(){
        return 35;
    }, this);
    
    /*
     * Update the location dropdown list
     */
    gvm.updateWiFiNetworks = function(data) {
        // Show best quality WiFi networks first
        sortJsonResult(data, 'quality', false);
        
        $.each(data, function(i, item){
            var sec = item.secured ? '-sec' : '';
            
            // Get wifi strength class from quality 
            if(item.quality >= 75) {
                item.iconclass = 'wifi-strength' + sec + '-high';
            } else if (item.quality >= 50) {
                item.iconclass = 'wifi-strength' + sec + '-medhigh';
            } else if (item.quality >= 25) {
                item.iconclass = 'wifi-strength' + sec + '-medlow';
            } else {
                item.iconclass = 'wifi-strength' + sec + '-low';
            }
            
            // Add index
            item.index = i;
            item.wifiSecurity = gvm.wifiSecurity;
            
            // Add the network to the array
            gvm.wifiNeworks.push(item);
            
            /* Add listener to listitem */
            $("#wifi-" + i).click(function(){
                // Show connection modal
                showConnectionModal(item);
            });
        });
    };
}

function initPage() {
    dpt_getWifiScan(viewModel.updateWiFiNetworks, function(){
        alert('error');
    });
}

/**
 * Sorting function based on: http://stackoverflow.com/questions/881510/jquery-sorting-json-by-values
 * @param {type} json the json array of json objects to sort
 * @param {type} fieldname the fieldname in the object you want to sort.
 * @param {type} asc true for ascending
 * @returns {undefined}
 */
function sortJsonResult(json, fieldname, asc) {
    json = json.sort(function(a, b){
        if (asc) 
            return (a[fieldname] > b[fieldname]);
        else 
            return (b[fieldname] > a[fieldname]);
    });
}

/**
 * Show a modal where the user can enter WiFi information and connect to the network. 
 * @param {type} networkdata WiFi network information.
 */
function showConnectionModal(networkdata) {
    BootstrapDialog.show({
        title: i18n.__("ModalWiFiTitle") + " " + networkdata.ssid,
        message: $('<div></div>').load('modals/wifi-modal.html'),
        buttons: [{
            label: 'Cancel',
            action: function(dialog) {
                dialog.close();
            }
        }, {
            label: 'Connect',
            action: function(dialog) {
                dialog.setTitle('Title 2');
            }
        }]
    });
}