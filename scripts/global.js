// Instantiate localisation 
var i18n = new I18n({
	directory: "locales",
	locale: "en",
	extension: ".json"
});

/* Ajax prefix, mostly used for development */
var AJAX_PREFXIX = "http://192.168.0.102:8080";

/* Set the site language */
function setLang(locale) {
	viewModel.setLocale(locale);
	/* Close navbar when open */
	$(".navbar-collapse").stop().css({ 'height': '1px' }).removeClass('in').addClass("collapse");
	$(".navbar-toggle").stop().removeClass('collapsed');
	return false;
}