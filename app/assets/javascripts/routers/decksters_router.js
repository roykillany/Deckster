// _.extend(Backbone.Router.prototype, {
//   refresh: function () { var tmp = Backbone.history.fragment; this.navigate(tmp + (new Date).getTime()); this.navigate(tmp, { trigger: true }); }
// });

Deckster.Routers.Router = Backbone.Router.extend({
	initialize: function(options) {
		this.$rootEl = options.$rootEl;
		// window.location.reload();
	},

	routes: {
		"": "index",
		"profile/me": "ownProfileNav",
		"decks/me": "ownDeckViewNav",
		"decks/add": "addDeckNav",
	},

	index: function() {
		if(Deckster.currentUser.isSignedIn()) {
			this.ownProfileNav();
		} else {
			var indexView = new Deckster.Views.RootView({
				model: Deckster.currentUser
			});

			this._swapView(indexView);
		}
	},

	ownProfileNav: function() {
		var callback = this.ownProfileNav.bind(this),
			profile = Deckster.currentUser.profile();
		if(!this._requireSignedIn(callback)) { return; };

		var ownProfileView = new Deckster.Views.profileView({
			model: profile
		});

		this._swapView(ownProfileView);
	},

	ownDeckViewNav: function() {
		var callback = this.ownDeckViewNav.bind(this),
			decks = Deckster.currentUser.decks();

		if(!this._requireSignedIn(callback)) { return; };

		var ownDeckView = new Deckster.Views.deckView({
			collection: decks
		});

		this._swapView(ownDeckView);
	},

	addDeckNav: function() {
		var callback = this.addDeckNav.bind(this);

		if(!this._requireSignedIn(callback)) { return; };

		var addDeckView = new Deckster.Views.addDeckView();

		this._swapView(addDeckView);
	},

	_requireSignedIn: function(callback) {
		if(!Deckster.currentUser.isSignedIn()) {
			callback = callback || this._goHome.bind(this);
			this.signIn(callback);
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