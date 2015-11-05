Deckster.Routers.Router = Backbone.Router.extend({
	initialize: function(options) {
		this.$rootEl = options.$rootEl;
	},

	routes: {
		"": "index",
		"profile/me": "ownProfileNav",
		"decks/me": "ownDeckViewNav",
		"decks/add": "addDeckNav",
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

	ownProfileNav: function() {
		var callback = this.ownProfileNav.bind(this);
		if(!this._requireSignedIn(callback)) { return; };

		var profile = Deckster.currentUser.profile(),
			decks = Deckster.currentUser.decks(),
			ownProfileView = new Deckster.Views.profileView({
				model: profile,
				collection: decks
			});

		this._swapView(ownProfileView);
	},

	ownDeckViewNav: function() {
		var callback = this.ownDeckViewNav.bind(this);
		if(!this._requireSignedIn(callback)) { return; };
	
		var decks = Deckster.currentUser.decks(),
			ownDeckView = new Deckster.Views.deckView({
				collection: decks
			});

		this._swapView(ownDeckView);
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