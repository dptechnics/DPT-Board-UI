// Page wide variables  
var viewModel = null;
var menuBarClicked = false;

// Instantiate localisation 
var i18n = new I18n({
    directory: "locales",
    locale: "en",
    extension: ".json"
});

/**
 * Change the UI locale
 * @param {string} locale - the new locale in two letters
 * @returns {boolean} returns false to prevent event propagation
 */
function setLang(locale) {
    viewModel.setLocale(locale);
    
    // Close navbar when open
    $(".navbar-collapse").stop().css({ 'height': '1px' }).removeClass('in').addClass("collapse");
    $(".navbar-toggle").stop().removeClass('collapsed');
    return false;
}

/**
 * The system global viewmodel
 * @returns {GlobalViewModel}
 */
function ViewModel()
{
    // Application settings
    this.lang = ko.observable("en");
    this.app = ko.computed(function(){i18n.setLocale(this.lang()); return i18n.__("AppName");}, this);
    this.project = ko.observable(i18n.__("NewProject"));
    this.title = ko.computed(function(){return this.project() + " - " + this.app();}, this); 
    
    // I18N bindings


    /**
     * Change the UI locale
     * @param {string} locale - the new UI locale
     */
    this.setLocale = function(locale) {
        this.lang(locale);
        i18n.setLocale(this.lang());
    };
}

/**
 * Page initialisation
 */
$('document').ready(function(){
    // Activate knockout framework
    viewModel = new ViewModel();
    ko.applyBindings(viewModel, document.getElementById("htmldoc"));
    
    // Activate splitter layout
    $('#splitpane').split({
        orientation: 'vertical',
        position: '20%'
    });
    
    $('#horizontal-splitpane').split({
       orientation: 'horizontal',
       position: '80%'
    });
     
    // Instantiate ace editor
    ace.require("ace/ext/language_tools");
    var editor = ace.edit("language-editor");
    editor.session.setMode("ace/mode/javascript");
    editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/javascript");
    // enable autocompletion and snippets
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: false
    });
    
    // Menu structure initialisation
    $('.menu-title').click(function(e){
        if(menuBarClicked) {
            hideMenu();
            menuBarClicked = false;
        } else {
            showMenu($(this).parent('li').children('.menu-body'));
            menuBarClicked = true;
        }
        
        e.stopPropagation();
    });
    
    $('.menu-title').mouseenter(function(){
        if(menuBarClicked){
            showMenu($(this).parent('li').children('.menu-body'));
        }
    })
    
    $('body').click(function(){
        hideMenu();
        menuBarClicked = false;
    });
});

function showMenu(menu) {
    $('.menu-body').removeClass('menu-body-visible');
    $(menu).addClass('menu-body-visible');
}

function hideMenu() {
    $('.menu-body').removeClass('menu-body-visible');
}