// Instantiate localisation 
var i18n = new I18n({
	directory: "locales",
	locale: "en",
	extension: ".json"
});

/* Set the site language */
function setLang(locale) {
	viewModel.setLocale(locale);
	/* Close navbar when open */
	$(".navbar-collapse").stop().css({ 'height': '1px' }).removeClass('in').addClass("collapse");
	$(".navbar-toggle").stop().removeClass('collapsed');
	return false;
}