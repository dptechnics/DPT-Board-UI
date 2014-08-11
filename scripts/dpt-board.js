/*
 * DPT-Board javascript library version 0.1
 * (c) 2014 DPTechnics
 * Author: Daan Pape
 *
 * Requires: JQuery
 */
 
/* Ajax prefix, mostly used for development */
var DPT_AJAX_PREFIX = "http://192.168.1.1:8080";

/*
 * Get an overview of the current system state. 
 * #callback function that accepts data from the board
 */
function dpt_getSystemOverview(callback)
{
	$.getJSON(DPT_AJAX_PREFIX + '/api/overview', callback);
}

/*
 * Get the currently available IO ports in the system. 
 */
function dpt_getIOLayout(callback)
{
	$.getJSON(DPT_AJAX_PREFIX + '/api/gpiolayout', function(data){
		// call the function with the number of ports and portlist
		callback(data.ioports.length, data.ioports);
	});
}
 
/* 
 * Toggle an IO pin on the board 
 * @name the name of the IO pin, only the number
 */
function dpt_toggleIO(name)
{
	// Get the current pin state 
	$.getJSON(DPT_AJAX_PREFIX + '/api/gpio/' + name, function(data) {
		// Toggle the pin
		$.ajax({
			type: "PUT",
			contentType: "application/json; charset=utf-8",
			url: AJAX_PREFXIX + '/api/gpio/' + name + '/' + (data.state == 0 ? 1 : 0),
			dataType: "json"
		});
	});
}

/*
 * Set an IO pin on the board to a predefined state.
 * @name the name of the IO pin, only the number.
 * @state the new state of the IO pin, boolean
 */
function dpt_setIO(name, state)
{
	$.ajax({
		type: "PUT",
		contentType: "application/json; charset=utf-8",
		url: DPT_AJAX_PREFIX + '/api/gpio/' + name + '/' + (state ? 1 : 0),
		dataType: "json"
	});
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
