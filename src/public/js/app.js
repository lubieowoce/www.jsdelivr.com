const cIndex = require('../../views/pages/index.html');
const cFeatures = require('../../views/pages/features.html');
const cPackage = require('../../views/pages/package.html');

Ractive.DEBUG = location.hostname === 'localhost';
Ractive.defaults.isolated = true;

let app = {
	config: {
		animateScrolling: true,
	},
	sriHashes: {},
	usedCdn: '',
};

app.router = new Ractive.Router({
	el: '#page',
	data () {
		return {
			app,
			collection: localStorage.getItem('collection2') ? JSON.parse(localStorage.getItem('collection2')) : [],
		};
	},
	globals: [ 'query', 'collection' ],
});

let routerDispatch = Ractive.Router.prototype.dispatch;

Ractive.Router.prototype.dispatch = function () {
	routerDispatch.apply(this, arguments);

	document.title = app.router.route.view.get('title') || 'jsDelivr - A free super-fast CDN for developers and webmasters';

	// ga('set', 'page', this.getUri());
	// ga('send', 'pageview');

	return this;
};

app.router.addRoute('/', (cIndex), { qs: [ 'docs', 'limit', 'page', 'query' ] });
app.router.addRoute('/package/:type(npm)/:name', (cPackage), { qs: [ 'path', 'version' ] });
app.router.addRoute('/package/:type(gh)/:user/:repo', (cPackage), { qs: [ 'path', 'version' ] });
app.router.addRoute('/features', (cFeatures));
app.router.addRoute('/(.*)', () => {
	location.pathname = '/';
});

$(() => {
	new Ractive().set('@shared.app', app);

	app.router
		.init({ noScroll: true })
		.watchLinks()
		.watchState();
});

$.fn.shuffle = function (selector) {
	return this.each(function () {
		$(this).find(selector)
			.sort(() => .5 - Math.random())
			.detach()
			.appendTo(this);
	});
};

module.exports = app;
