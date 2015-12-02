Deckster.Routers.Router = Backbone.Router.extend({
	initialize: function(options) {
		this.$rootEl = options.$rootEl;
	},

	routes: {
		"": "index",
		"settings": "settingsNav",
		"profile/me": "ownProfileNav",
		"decks/me": "ownDeckViewNav",
		"decks/add": "addDeckNav",
		"decks/:id": "individualDeckViewNav",
		"collection/me": "ownCollectionView"
	},

	before: function() {
		$(document).unbind();
	},

	after: function() {

	},

	index: function(callback) {
		if(!this._requireSignedOut(callback)){ return; }

		if(Deckster.currentUser.isSignedIn()) {
			this.ownProfileNav();
		} else {
			var indexView = new Deckster.Views.RootView({
				model: Deckster.currentUser,
				callback: callback
			});

			this._swapView(indexView);
		}
	},

	settingsNav: function() {
		var callback = this.settingsNav.bind(this);
		if(!this._requireSignedIn(callback)) { return; };

		var settingsView = new Deckster.Views.settingsView({
			model: Deckster.currentUser
		});

		this._swapView(settingsView);
	},

	ownProfileNav: function() {
		var callback = this.ownProfileNav.bind(this);
		if(!this._requireSignedIn(callback)) { return; };

		var profile = Deckster.currentUser.profile(),
			ownProfileView = new Deckster.Views.profileView({
				model: profile,
			});

		this._swapView(ownProfileView);
	},

	ownDeckViewNav: function() {
		var callback = this.ownDeckViewNav.bind(this);
		if(!this._requireSignedIn(callback)) { return; };

		Deckster.currentUser.getOrFetchDecks(function(decks) {
			var ownDeckView = new Deckster.Views.deckView({
				collection: decks
			});

			Deckster.router._swapView(ownDeckView);
		});
	},

	addDeckNav: function() {
		var callback = this.addDeckNav.bind(this);
		if(!this._requireSignedIn(callback)) { return; };

		var	profile = Deckster.currentUser.profile(),
			addDeckView = new Deckster.Views.addDeckView({
				model: profile
			});

		this._swapView(addDeckView);
	},

	ownCollectionView: function() {
		var callback = this.ownCollectionView.bind(this);
		if(!this._requireSignedIn(callback)) { return; };

		Deckster.currentUser.getOrFetchCollection(function(collection) {
			var collectionView = new Deckster.Views.collectionView({
				model: collection
			});

			Deckster.router._swapView(collectionView);
		});
	},

	individualDeckViewNav: function(id) {
		var callback = this.individualDeckViewNav.bind(this);
		if(!this._requireSignedIn(callback)) { return; };
		if(typeof id === "undefined") {
			id = window.location.href.match(/\/(\d+)$/)[1];
		}

		var self = this;

		Deckster.currentUser.getOrFetchDeck(id, function(deck) {
			var deckItemView = new Deckster.Views.deckItemView({
				model: deck
			});
			this._swapView(deckItemView);
		}.bind(self));
	},

	_requireSignedIn: function(callback) {
		if(!Deckster.currentUser.isSignedIn()) {
			callback = callback || this._goHome.bind(this);
			this.index(callback);
			return false;
		}

		return true;
	},

	_requireSignedOut: function(callback){
    if(Deckster.currentUser.isSignedIn()){
      callback = callback || this._goHome.bind(this);
      callback();
      return false;
    }

    return true;
  },

	_goHome: function() {
		Backbone.history.navigate("", { trigger: true });
	},

	_swapView: function(view) {
		this._currentView && this._currentView.remove();
		this._currentView = view;
		this.$rootEl.html(view.render().$el);
	}
})

Backbone.Router.prototype.route = function (route, name, callback) {
  if (!_.isRegExp(route)) route = this._routeToRegExp(route);
  if (_.isFunction(name)) {
    callback = name;
    name = '';
  }
  if (!callback) callback = this[name];

  var router = this;

  Backbone.history.route(route, function(fragment) {
    var args = router._extractParameters(route, fragment);

    router.before.apply(router, arguments);
    callback && callback.apply(router, args);
    router.after.apply(router, arguments);

    router.trigger.apply(router, ['route:' + name].concat(args));
    router.trigger('route', name, args);
    Backbone.history.trigger('route', router, name, args);
  });
  return this;
};