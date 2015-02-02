// Page wide variables  
var viewModel = null;
var menuBarClicked = false;
var editor = null;

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
    $(".navbar-collapse").stop().css({'height': '1px'}).removeClass('in').addClass("collapse");
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
    this.app = ko.computed(function () {
        i18n.setLocale(this.lang());
        return i18n.__("AppName");
    }, this);
    this.project = ko.observable(i18n.__("NewProject"));
    this.title = ko.computed(function () {
        return this.project() + " - " + this.app();
    }, this);

    // I18N bindings


    // Code annotations
    this.codeAnnotations = ko.observableArray();
    
    this.resetErrors = function() {
        this.codeAnnotations.removeAll();
    };
    
    this.addError = function(obj) {
        this.codeAnnotations.push(obj);
    };

    /**
     * Change the UI locale
     * @param {string} locale - the new UI locale
     */
    this.setLocale = function (locale) {
        this.lang(locale);
        i18n.setLocale(this.lang());
    };
}

/**
 * Page initialisation
 */
$('document').ready(function () {
    // Activate knockout framework
    viewModel = new ViewModel();
    ko.applyBindings(viewModel, document.getElementById("htmldoc"));

    //$('#splitpane').splitter();

    // Activate splitter layout
    $('#splitpane').split({
        orientation: 'vertical',
        position: '0%'
    });

    $('#horizontal-splitpane').split({
        orientation: 'horizontal',
        limit: 54,
        position: '80%'
    });

    // Instantiate ace editor
    ace.require("ace/ext/language_tools");
    editor = ace.edit("language-editor");
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
    $('.menu-title').click(function (e) {
        if (menuBarClicked) {
            hideMenu();
            menuBarClicked = false;
        } else {
            showMenu($(this).parent('li').children('.menu-body'));
            menuBarClicked = true;
        }

        e.stopPropagation();
    });

    $('.menu-title').mouseenter(function () {
        if (menuBarClicked) {
            showMenu($(this).parent('li').children('.menu-body'));
        }
    });

    $('body').click(function () {
        hideMenu();
        menuBarClicked = false;
    });


    /* ----------------------------- BUTTON HANDLERS ------------------------------------- */
    $('.btn-fullscreen').click(function () {
        if ((document.fullScreenElement && document.fullScreenElement !== null) || // alternative standard method
                (!document.mozFullScreen && !document.webkitIsFullScreen)) {               // current working methods
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    });

    $('.btn-undo').click(function () {
        editor.undo();
    });

    $('.btn-redo').click(function () {
        editor.redo();
    });

    $('.btn-play').click(function () {
        runCode();
    });
    
    $('.btn-text-mode').click(function () {
        changeDevelopMode(this, 0);
    });
    
    $('.btn-design-mode').click(function () {
        changeDevelopMode(this, 1);
    });
    
    $('.btn-splitview-mode').click(function () {
        changeDevelopMode(this, 2);
    });
    
    /* ---------------------------------- Editor events ---------------------------------- */
    editor.getSession().on("changeAnnotation", function () {
        var annot = editor.getSession().getAnnotations();
        
        viewModel.resetErrors();
        
        for (var key in annot) {
            if (annot.hasOwnProperty(key))
                viewModel.addError(annot[key]);
        }
    });
});

function showMenu(menu) {
    $('.menu-body').removeClass('menu-body-visible');
    $(menu).addClass('menu-body-visible');
}

function hideMenu() {
    $('.menu-body').removeClass('menu-body-visible');
}

function runCode() {
    console.log('running code: ' + editor.getValue());
    eval(editor.getValue());
}

function changeDevelopMode(button, mode) {
    $(button).parent().find('li.active').removeClass('active');
    $(button).addClass('active'); 
    
    if(mode === 0) {
        $('#blockly-editor').css('display', 'none');
        $('#language-editor').css('display', 'inline-block');
        $('#develop-split-pane').split().destroy();
    } else if (mode === 1) {
        $('#blockly-editor').css('display', 'inline-block');
        $('#language-editor').css('display', 'none');
        $('#develop-split-pane').split().destroy();
    } else {
        $('#blockly-editor').css('display', 'inline-block');
        $('#language-editor').css('display', 'inline-block');
                
        $('#develop-split-pane').split({
            orientation: 'vertical',
            position: '50%'
        });
    }
}