/**
 * DPTechnics Web IDE
 * 
 * Description: javascript backend for the DPTechnics WEB IDE. An 
 * educational and tincker IDE for the DPT-Board. 
 * 
 * Authors: Matthieu Calie, Daan Pape
 * Company: DPTechnics
 */

/* ----------------------------------------------- GLOBAL VARIABLES ------------------------------------- */

var viewModel = null;                   /* KnockoutJS viewmodel */
var menuBarClicked = false;             /* True if the menu bar is active */
var editor = null;                      /* The ACE text editor */
var rootPane;                           /* The root pane */
var rightPane;                          /* Pane containing project structure */
var developPane;                        /* Pane containg output and console */
var workspace = new IdeWorkspace();     /* All projects currently loaded in the IDE */
var tasks = [];                         /* Task queue */

/* ---------------------------------------------- STATIC VARIABLES ------------------------------------- */ 

// Maps language names onto default file extensions 
var EXTENSIONS = {
    "javascript" : "js",
    "html" : "html",
    "css" : "css"
};

// Maps language names onto ACE code assistance options
var ACEMODES = {
    "javascript" : "ace/mode/javascript",
    "html" : "ace/mode/html",
    "css" : "ace/mode/css"
};

// The type of a file in the projects file structure 
var FILECAT = {
    "directory" : 0,        /* File directory */
    "file" : 1,             /* Normal file */
    "dependency" : 2        /* Dependency directory */
};

/* --------------------------------------------- INTERNATIONALISATION ----------------------------------- */

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

/* --------------------------------------- PROJECT STRUCTURE AND MANAGEMENT ------------------------------- */

/**
 * Represents an IDE project file
 */
function IdeFile() {
    return {
        filename: filename,         /* The name of the file */
        filetype: filetype,         /* The type of the file */
        filecat: filecat,           /* The file category (directory, file, ...) */
        editor: editorcontent,      /* The file content itself */    
        blockly: blocklycontent,    /* The blockly content if any */
        blocklyvisible: true,       /* True if blockly was visible */
        acemode: acemode,           /* The mode of the ACE editor for this file */
        active: false,              /* True if this file is in the active tab */
        display: false,             /* True if this file is in the open tabs */             
        parent : null               /* The parent of the file */
    };    
};

/**
 * Represents an IDE project.
 */
function IdeProject() {
    return {
        name: "",           /* The project name */
        type: "",           /* The project type (robot, iot, html, ...) */         
        files: []           /* The files in the project */
    };
};

/**
 * Represensts an IDE workspace
 */
function IdeWorkspace() {
    return {
        name: "",           /* The workspace name */
        opentab: null,      /* The file currently open in editor */
        projects: []        /* The projects in this workspace */
    };
};

/**
 * Save the current tabpane in an IdeFile object
 * @returns {IdeFile} the current version of a file in the editor
 */
function getCurrentTab() {
    // TODO
    var blockly = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    var aceContent = editor.getSession().getValue();
    var acemode = editor.getSession().getMode().$id;
    //return new IdeFile(aceContent, blockly, acemode, "");
}

/**
 * Display a file in the editor
 * @param {IdeFile} file the file to display in the editor
 */
function displayFile(file) {
    //TODO: restore editor pane visibility
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, context.blockly);
    editor.setValue(file.editor);
    editor.setMode(file.acemode);
}

/* --------------------------------------- VISUALISATION CODE ------------------------------- */

/**
 * The system global viewmodel
 * @returns {GlobalViewModel}
 */
function ViewModel()
{
    /* -------------------------------- CODE ASSISTANCE -------------------------------- */
    this.codeAnnotations = ko.observableArray();
    
    /**
     * Removes all currently visible assistance messages
     */
    this.resetErrors = function() {
        this.codeAnnotations.removeAll();
    };
    
    /**
     * Add a code assistance object 
     * @param {type} obj the ACE code assistance object
     */
    this.addError = function(obj) {
        this.codeAnnotations.push(obj);
    };

    /* -------------------------------- PROJECT STRUCTURE -------------------------------- */
    
    /* Open file tabs in the ide */
    this.opentabs = ko.observableArray([]);    
    
    /**
     * The UI based on the current workspace
     */
    this.updateView = function() {
        // Array containing the new tab configuration
        var newTabContext = [];
        
        // Search for all tabs in the workspace
        workspace.projects.forEach(function(project){
            project.files.forEach(function(file){
               //TODO: check if this file is in an open tab, and if it is active
               if(file.display) {
                   newTabContext.push(file);
                   
                   if(file.active) {
                       workspace.opentab = file;
                   }
               } 
            });
        });
        
        // Replace the values in the observable array
        this.opentabs(newTabContext);
    };
    
    /* ----------------------------- I18N AND APP SETTINGS ----------------------------- */
    this.lang = ko.observable("en");
    this.title = ko.computed(function () {i18n.setLocale(this.lang()); return i18n.__("AppName");}, this);
    
    /**
     * Change the UI locale
     * @param {string} locale - the new UI locale
     */
    this.setLocale = function (locale) {
        this.lang(locale);
        i18n.setLocale(this.lang());
    };
}

/* --------------------------------------- INITIALISATION AND HANDLERS ------------------------------- */

$('document').ready(function () {
    DPT_AJAX_PREFIX = "/";  
    
    /* -------------------------- Knockout GUI initialisaton ---------------------------- */
    viewModel = new ViewModel();
    ko.applyBindings(viewModel, document.getElementById("htmldoc"));

    /* -------------------------- Split panes initialisation ----------------------------- */
    rootPane = $('#splitpane').split({
        orientation: 'vertical',
        limit: 0,
        position: '15%'
    });

    rightPane = $('#horizontal-splitpane').split({
        orientation: 'horizontal',
        limit: 0,
        position: '80%'
    });
    
    developPane = $('#develop-split-pane').split({
        orientation: 'vertical',
        limit: 0,
        position: '50%'
    });

    /* -------------------------- Ace editor initialisation ------------------------------- */
    ace.require("ace/ext/language_tools");
    editor = ace.edit("language-editor");
    editor.session.setMode("ace/mode/javascript");
    editor.setTheme("ace/theme/twilight");
    
    // Enable autocompletion and snippets
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: false,
        fontSize: "14pt"
    });

    /* ------------------------ Menu structure initialisation ----------------------------- */
    $('.menu-title').click(function (e) {
        e.stopPropagation();
        if (menuBarClicked) {
            hideMenu();
            menuBarClicked = false;
        } else {
            showMenu($(this).parent('li').children('.menu-body'));
            menuBarClicked = true;
        }
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
    
    /* ----------------------------- Menu Handlers ------------------------------------- */        
    $('.menu-save').click(function() {
        
    });
    
    $('.menu-save-as').click(function() {
        
    });
    
    $('.menu-save-all').click(function() {
        
    });
    
    $('.menu-exit').click(function() {
        window.close();
    });
    
    $('.menu-cut').click(function() {
        
    });
    
    $('.menu-copy').click(function() {
        
    });
    
    $('.menu-paste').click(function() {
        
    });
    
    $('.menu-select-all').click(function() {
        
    });
    
    $('.menu-tutorials').click(function() {
        
    });
    
    $('.menu-help-index').click(function() {
        
    });
    
    $('.menu-check-updates').click(function() {
        
    });
    
    $('.menu-about').click(function() {
        
    });
    
    $('.open-project-explorer').click(function () {
        $('#project-explorer').css('min-width', '150px');
        rootPane.position ('15%');
    });
    
    $('.close-project-explorer').click(function () {
        $('#project-explorer').css('min-width', '0px');
        rootPane.position ('0%');
    });
    
    $('.open-error-list').click(function () {
        rightPane.position ('80%');
    });
    
    $('.close-error-list').click(function () {
        rightPane.position ('100%');
    });

    /* ----------------------------- BUTTON HANDLERS ------------------------------------- */
    $('.btn-fullscreen').click(function () {
        if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {               
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
    
    $('.btn-text-mode').click(function () {
        changeDevelopMode(this, 0);
    });
    
    $('.btn-design-mode').click(function () {
        changeDevelopMode(this, 1);
    });
    
    $('.btn-splitview-mode').click(function () {
        changeDevelopMode(this, 2);
    });    
    
    $('.btn-error-list').click(function () {
        $('.btn-console').removeClass('active');
        $('.btn-error-list').addClass('active');
        $('.error-list-pnl').removeClass('hidden');
        $('.console-pnl').addClass('hidden');
    });
    $('.btn-console').click(function () {
        $('.btn-console').addClass('active');
        $('.btn-error-list').removeClass('active');
        $('.error-list-pnl').addClass('hidden');
        $('.console-pnl').removeClass('hidden');
    });
    
    /* ---------------------------------- DIALOG BUTTON HANDLERS ---------------------------------- */
    $('#new-file-dlg-create-btn').click(function(){
        //TODO: create new project first
        var name = $('#new-file-dlg form').find('input[name="filename"]').val();
        var lang = $('#new-file-dlg form').find('select[name="filetype"]').val();
        
        // Add extension to name 
        name = name + "." + EXTENSIONS[lang];
        
        var filetab = new IdeFile("", "", ACEMODES[lang], name);
        
    });
    
    /* ---------------------------------- ACE EDITOR EVENTS ---------------------------------- */
    $('.changeFontSize').click(function() {
        changeFontSize($('.changeFontSize').val());
    });
    
    // Update the code assistance values in the viewmodel
    editor.getSession().on("changeAnnotation", function () {
        var annot = editor.getSession().getAnnotations();   
        viewModel.resetErrors();
        
        for (var key in annot) {
            if (annot.hasOwnProperty(key))
                viewModel.addError(annot[key]);
        }
    });
    
    /* ---------------------------------- BLOCKLY GUI EDITOR ---------------------------------- */
    Blockly.inject(document.getElementById('blockly-editor'),
        {toolbox: document.getElementById('toolbox')});
    
    // Listen to blockly internal changes
    function blocklyUpdateHandler() {        
        var code = Blockly.JavaScript.workspaceToCode();
        editor.setValue(code);
    }
    Blockly.addChangeListener(blocklyUpdateHandler);
    
    // Update blockly window size on browser window resize
    window.onresize = function(event) {
        Blockly.fireUiEvent(window, 'resize');    
    };
});

/* --------------------------------------- DPT IDE SPECIFIC FUNCTIONS ------------------------------- */

/**
 * Show a specific menu
 * @param {DOM element} menu the menu to be displayed.
 */
function showMenu(menu) {
    $('.menu-body').removeClass('menu-body-visible');
    $(menu).addClass('menu-body-visible');
}

/**
 * Hide all menus.
 */
function hideMenu() {
    $('.menu-body').removeClass('menu-body-visible');
}

/**
 * Switch from develop mode between full code view, full blockly view or split code/blockly view. 
 * @param {DOM element} button the button to set as active. 
 * @param {int} mode the mode to switch to (0 = fullcode, 1 = split code/blockly, 2 = fullblockly)
 */
function changeDevelopMode(button, mode) {
    $(button).parent().find('li.active').removeClass('active');
    $(button).addClass('active'); 
    
    if(mode === 0) {
        developPane.position('100%');
    } else if (mode === 1) {
        developPane.position('0%');
    } else {  
        developPane.position('50%');
    }
}

/**
 * Set the font size of the ACE editor
 * @param {integer} size the size in points of the editor font
 */
function changeFontSize(size) {
    editor.setOptions({fontSize: size + "pt"});
}

/**
 * Enable console logging into the IDE console field
 */
(function(){
    var oldLog = console.log;
    console.log = function (message) {
        $("#console-pnl").append(message + '</br>');
        oldLog.apply(console, arguments);
    };
})();


/* --------------------------------------- DPT-BOARD LANGUAGE CONSTRUCTS ------------------------------- */
function enablePin(pin) {
    console.log("Enabling pin " + pin);
    dpt_setIO(pin, true);
}

function disablePin(pin) {
    console.log("Disabling pin " + pin);
    dpt_setIO(pin, false);
}

function togglePin(pin) {
    console.log("Toggle pin " + pin);
    dpt_toggleIO(pin);
}

function newTask(f) {
    tasks.push(f);
}