/**
 * 
 * Authors: Matthieu Calie, Daan Pape
 */

// Page wide variables  
var viewModel = null;
var menuBarClicked = false;
var editor = null;
var rootPane;
var rightPane;
var developPane;
var currentProject = null;
var tasks = [];

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

/* ------------------------------------ File structure management ------------------------------ */

/**
 * Content of a tabpane
 * @param {string} editorcontent the content of the ace editor
 * @param {xml} blocklycontent
 * @param {string} acemode the ace modus (html/css/js/...)
 * @param {boolean} active if this is the active tab pane
 * @param {string} filename the name of the tab
 * @returns {TabPaneContext.viewmodelAnonym$1}
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
 * Prototype 
 * @param {type} name
 * @returns {undefined}
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
    
    /* UI File management */
    this.opentabs = ko.observableArray([]);
    
    /**
     * Add a tabpane
     * @param {TabPaneContext} tabpane add a tabpane
     */
    this.addTab = function(tabpane) {
        this.opentabs.push(tabpane);
    };
    
    /**
     * Clear the workspace to make place for a new project
     */
    this.clearForNewProject = function() {
        this.opentabs.removeAll();
    };
    
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
}

/**
 * Page initialisation
 */
$('document').ready(function () {
    DPT_AJAX_PREFIX = "/";  
    
    // Activate knockout framework
    viewModel = new ViewModel();
    ko.applyBindings(viewModel, document.getElementById("htmldoc"));

    //$('#splitpane').splitter();

    // Activate splitter layout
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
        enableLiveAutocompletion: false,
        fontSize: "14pt"
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
    
    /* ---------------------------------- Editor events ---------------------------------- */
    $('.changeFontSize').click(function() {
        changeFontSize($('.changeFontSize').val());
    });
    
    editor.getSession().on("changeAnnotation", function () {
        var annot = editor.getSession().getAnnotations();
        
        viewModel.resetErrors();
        
        for (var key in annot) {
            if (annot.hasOwnProperty(key))
                viewModel.addError(annot[key]);
        }
    });
    
    /* ---------------------------------- Blockly Events ---------------------------------- */
    Blockly.inject(document.getElementById('blockly-editor'),
        {toolbox: document.getElementById('toolbox')});
                
    function myUpdateFunction() {        
        var code = Blockly.JavaScript.workspaceToCode();
        editor.setValue(code);
    }
    Blockly.addChangeListener(myUpdateFunction);
    
    
    /* ------------------------------------- PROJECT INITIALIZATION ---------------------------------- */
    if(currentProject == null) {
        createNewProject();
    }
});

function showMenu(menu) {
    $('.menu-body').removeClass('menu-body-visible');
    $(menu).addClass('menu-body-visible');
}

function hideMenu() {
    $('.menu-body').removeClass('menu-body-visible');
}

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
window.onresize = function(event) {
    Blockly.fireUiEvent(window, 'resize');    
};

function changeFontSize(size) {
    editor.setOptions({
        fontSize: size + "pt"
    });
}

var exampleJSON = [
    {
        "name": "Robotproject1",
        "type": {
            "basetype": "PROJECT",
            "subtype": "ROBOT"
        },
        "uri": "/Robotproject1",
        "children": [
            {
                "name": "public",
                "type": {
                    "basetype": "FOLDER",
                    "subtype": "folder"
                },
                "uri": "/Robotproject1/public",
                "children": [
                    {
                        "name": "javascript.js",
                        "type": {
                            "basetype": "FILE",
                            "subtype": "js"
                        },
                        "uri": "/Robotproject1/public/javascript.js",
                        "children": []
                    },
                    {
                        "name": "stylesheet.css",
                        "type": {
                            "basetype": "FILE",
                            "subtype": "css"
                        },
                        "uri": "/Robotproject1/public/stylesheet.css",
                        "children": []
                    }
                ]
            },
            {
                "name": "index.html",
                "type": {
                    "basetype": "FILE",
                    "subtype": "html"
                },
                "uri": "/Robotproject1/index.html",
                "children": []
            }
        ]
    },
    {
        "name": "IoTproject1",
        "type": {
            "basetype": "PROJECT",
            "subtype": "IOT"
        },
        "uri": "/IoTproject1",
        "children": [
            {
                "name": "public",
                "type": {
                    "basetype": "FOLDER",
                    "subtype": "folder"
                },
                "uri": "/IoTproject1/public",
                "children": [
                    {
                        "name": "javascript.js",
                        "type": {
                            "basetype": "FILE",
                            "subtype": "js"
                        },
                        "uri": "/IoTproject1/public/javascript.js",
                        "children": []
                    },
                    {
                        "name": "stylesheet.css",
                        "type": {
                            "basetype": "FILE",
                            "subtype": "css"
                        },
                        "uri": "/IoTproject1/public/stylesheet.css",
                        "children": []
                    }
                ]  
            },
            {
                "name": "index.html",
                "type": {
                    "basetype": "FILE",
                    "subtype": "html"
                },
                "uri": "/IoTproject1/index.html",
                "children": []
            }
        ]
    },
    {
        "name": "webproject",
        "type": {
            "basetype": "PROJECT",
            "subtype": "WEB"
        },
        "uri": "/webproject",
        "children": [
            {
                "name": "public",
                "type": {
                    "basetype": "FOLDER",
                    "subtype": "folder"
                },
                "uri": "/webproject/public",
                "children": [
                    {
                        "name": "javascript.js",
                        "type": {
                            "basetype": "FILE",
                            "subtype": "js"
                        },
                        "uri": "/webproject/public/javascript.js",
                        "children": []
                    },
                    {
                        "name": "stylesheet.css",
                        "type": {
                            "basetype": "FILE",
                            "subtype": "css"
                        },
                        "uri": "/webproject/public/stylesheet.css",
                        "children": []
                    }
                ]  
            },
            {
                "name": "index.html",
                "type": {
                    "basetype": "FILE",
                    "subtype": "html"
                },
                "uri": "/webproject/index.html",
                "children": []
            }
        ]
    }
];    



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