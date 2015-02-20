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

var viewModel = null;                       /* KnockoutJS viewmodel */
var menuBarClicked = false;                 /* True if the menu bar is active */
var editor = null;                          /* The ACE text editor */
var rootPane;                               /* The root pane */
var rightPane;                              /* Pane containing project structure */
var developPane;                            /* Pane containg output and console */
var currentProject = new IdeProject("");    /* The currently selected project */
var tasks = [];                             /* Task queue */


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
 * Represents a root tabpane content. 
 * @param {string} editorcontent the content of the ace editor
 * @param {xml} blocklycontent
 * @param {string} acemode the ace modus (html/css/js/...)
 * @param {boolean} active if this is the active tab pane
 * @param {string} filename the name of the tab
 */
function TabPaneContext(editorcontent, blocklycontent, acemode, active, filename) {
    return {
        editor: editorcontent,
        blockly: blocklycontent,
        acemode: acemode,
        active: active,
        filename: filename
    };    
};

/**
 * Represents an IDE project. 
 * @param {string} name the project name 
 */
function IdeProject(name) {
    return {
        name: name,         /* The project name */
        tabs: [],           /* The open tabs */
        filestructure: null /* The filestructure */
    };
};

/**
 * Create a new empty project
 * @param {string} type the type of project
 */
function createNewProject(type) {
    currentProject = new IdeProject("New project");
    var newTab = new TabPaneContext("", "", "ace/mode/javascript", true, "new.js");
    currentProject.tabs.push(newTab);
}

/**
 * Save the current tabpane in a TabPaneContext object
 * @returns {TabPaneContext} the tabpane context
 */
function getCurrentTab() {
    var blockly = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    var aceContent = editor.getSession().getValue();
    var acemode = editor.getSession().getMode().$id;
    return new TabPaneContext(aceContent, blockly, acemode);
}

/**
 * Restore a saved TabPaneContext and show it
 * @param {TabPaneContext} context the
 */
function loadTab(context) {
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, context.blockly);
    editor.setValue(context.editor);
    editor.setMode(context.acemode);
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

    this.projectTitle = ko.observable(currentProject.name);     /* The title of the current project project */
    this.opentabs = ko.observableArray(currentProject.tabs);    /* Open file tabs */
    
    /**
     * Display a new project in the IDE
     * @param {IdeProject} project the IDE project to display
     */
    this.displayNewProject = function(project) {
        this.clearForNewProject();
        
        project.tabs.forEach(function(tab){
            this.addTab(tab);
        });
    };
    
    /**
     * Update the UI to show changes 
     */
    this.updateView = function() {
        // Update project title
        this.projectTitle(currentProject.name);
        
        // Update tabs
        this.opentabs.removeAll();
        currentProject.tabs.forEach(function(tab){
            this.opentabs.push(tab);
        });
    };
    
    /* ----------------------------- I18N AND APP SETTINGS ----------------------------- */
    this.lang = ko.observable("en");
    this.app = ko.computed(function () {i18n.setLocale(this.lang()); return i18n.__("AppName");}, this);
    this.title = ko.computed(function () {return this.projectTitle() + " - " + this.app();}, this);
    
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
    editor.getSession().setMode("ace/mode/javascript");
    
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
    
    
    /* ------------------------------------- PROJECT INITIALIZATION ---------------------------------- */
    if(currentProject === null) {
        createNewProject();
    }
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

function changeFontSize(size) {
    editor.setOptions({
        fontSize: size + "pt"
    });
}

function fillProjectExplorer(data) {
    var tnc = 0;
    $.each(exampleJSON, function (i, item) {
        $('#project-explorer-tree').append('<li class="treenode"></li>').append('<label for="' + item.name + '"');
    });
}

function fillChildren(data) {
    
}

/* dpt IO functions */
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

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

/* console feature */
(function(){
    var oldLog = console.log;
    console.log = function (message) {
        $("#console-pnl").append(message + '</br>');
        oldLog.apply(console, arguments);
    };
})();