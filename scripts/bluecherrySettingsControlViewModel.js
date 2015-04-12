/* global ko, i18n */

/**
 * The page viewmodel, this is auto-instantiated in global.js
 * @param {Knockout viewmodel} gvm - the global knockout viewmodel
 * @returns {void}
 */
function pageViewModel(gvm) {
    // Page title
    gvm.title = ko.computed(function(){i18n.setLocale(gvm.lang()); return gvm.app() + " - " + i18n.__("BluecherrySettingsTitle");}, gvm);

    // Page i18n 
    gvm.blueCherrySettingsTitle = ko.computed(function(){i18n.setLocale(gvm.lang()); return i18n.__("BluecherrySettingsTitle");}, gvm);

}



/**
 * Called when page is loaded
 */
function initPage() {

    /* Attach bluecherry connect handler */
    $('#loginbtn').click(function() {
        $('#login_error').html("");
        $('#loadergif').show();
    
        var username = $('#username').val();
        var password = $('#password').val();
        
        dpt_blueCherryConnect(username, password, function(data){
            $('#loadergif').hide();
            if(data.result == true) {
                $('#loginform').hide();
                $('#successholder').show();
            } else {
                $('#login_error').html("Something went wrong. Please check your username/password combination and account credit");
            }
        }, function(){
            $('#loadergif').hide();
            $('#login_error').html("Something went wrong, please try again later.");
        });
    });
}