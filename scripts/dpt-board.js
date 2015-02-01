/*
 * DPT-Board javascript library version 0.1
 * (c) 2014 DPTechnics
 * Author: Daan Pape
 *
 * Requires: JQuery
 */
 
/* Ajax prefix, mostly used for development */
var DPT_AJAX_PREFIX = "http://192.168.0.243/";

/**
 * Get general system information.
 * @param {function} callback function to call when data is ready.
 * @param {function} errorhandler function to call when an error occurs.
 * @returns {undefined}
 */
function dpt_getSystemOverview(callback, errorhandler)
{
    $.getJSON(DPT_AJAX_PREFIX + 'api/overview', callback).error(errorhandler);
}

/**
 * Get the currently available IO ports in the system.
 * @param {function} callback function to call when data is ready.
 * @param {function} errorhandler function to call when an error occurs.
 * @returns {undefined}
 */
function dpt_getIOLayout(callback, errorhandler)
{
    $.getJSON(DPT_AJAX_PREFIX + 'api/gpiolayout', function(data){
        // call the function with the number of ports and portlist
        callback(data.ioports.length, data.ioports);
    }).error(errorhandler);
}

/**
 * Toggle an IO pin on the board 
 * @param {integer} name the name of the IO pin, only the number.
 * @param {function} errorhandler function to call when an error occurs.
 * @returns {undefined}
 */
function dpt_toggleIO(name, errorhandler)
{
    // Get the current pin state 
    $.getJSON(DPT_AJAX_PREFIX + 'api/gpio/' + name, function(data) {
        // Toggle the pin
        $.ajax({
            type: "PUT",
            contentType: "application/json; charset=utf-8",
            url: AJAX_PREFXIX + 'api/gpio/' + name + '/' + (data.state === 0 ? 1 : 0),
            dataType: "json",
            error: errorhandler
        });
    }).error(errorhandler);
}

/**
 * Set an IO pin on the board to a predefined state.
 * @param {integer} name the name of the IO pin, only the number.
 * @param {boolean} state the new state of the IO pin, boolean.
 * @param {function} errorhandler function to call when an error occurs.
 * @returns {undefined} 
 */
function dpt_setIO(name, state, errorhandler)
{
    $.ajax({
        type: "PUT",
        contentType: "application/json; charset=utf-8",
        url: DPT_AJAX_PREFIX + 'api/gpio/' + name + '/' + (state ? 1 : 0),
        dataType: "json",
        error: errorhandler
    });
}

/**
 * Scan for available WiFi networks and get information on the encryption and strength.
 * @param {function} callback function to call when data is ready.
 * @param {function} errorhandler function to call when an error occurs.
 * @returns {undefined} 
 */
function dpt_getWifiScan(callback, errorhandler)
{
    $.getJSON(DPT_AJAX_PREFIX + 'api/wifiscan', function(data) {
        callback(data);
    }).error(errorhandler);
}

/**
 * Get information about the current board firmware status
 * @param {function} callback function to call when data is ready.
 * @param {function} errorhandler function to call when an error occurs.
 * @returns {undefined}
 */
function dpt_getFirmwareInfo(callback, errorhandler)
{
    $.getJSON(DPT_AJAX_PREFIX + 'api/firmware/info', function(data) {
        callback(data);
    }).error(errorhandler);
}

/**
 * Get information about the current board firmware status but only
 * after check with the dptechnics servers. 
 * @param {function} callback function to call when data is ready.
 * @param {function} errorhandler function to call when an error occurs.
 * @returns {undefined}
 */
function dpt_checkFirmwareUpgrade(callback, errorhandler)
{
    $.getJSON(DPT_AJAX_PREFIX + 'api/firmware/info', function(data) {
        dpt_getFirmwareInfo(callback, errorhandler)
    }).error(errorhandler);
}

/*
 * Listen to document keydown events to provide action attaching. 
 */
$(document).keydown(function(e){
});

/*
 * Listen to document keyup events to provide action attaching. 
 */
$(document).keyup(function(e){
});