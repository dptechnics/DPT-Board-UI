/**
 * The page viewmodel, gvm is auto-instantiated in global.js
 * @param {Knockout viewmodel} gvm description: the global knockout viewmodel
 * @returns {void}
 */
function pageViewModel(gvm) {
    // Page title
    gvm.title = ko.computed(function(){i18n.setLocale(gvm.lang()); return gvm.app() + " - " + i18n.__("ButtoncontrolTitle");}, gvm);

    // The IO buttons observable array
    gvm.buttons = ko.observableArray([]);

    /**
     * Add an IO button to the viewmodel
     * @param {integer} btnr - the number of the button to add. 
     * @returns {void}
     */
    gvm.addIOButton = function(btnr)
    {
        // Fill up the template
        gvm.buttons.push({
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

/**
 * Automatically called page initialisation.
 * @returns {void}
 */
function initPage() {
    dpt_getIOLayout(function(nrports, ports){
        // Add a button for every port 
        for(i = 0; i < nrports; ++i) {
            // Append button to HTML DOM
            viewModel.addIOButton(ports[i]);
        }
    });
}