Deckster.Models.User = Backbone.Model.extend({
	urlRoot: "api/user",

	parse: function(resp) {
		if(resp.users) {
			this.set(resp.users);
			delete response.users;
		}
		return resp;
	},

	toJSON: function() {
		var attrs = _.clone(this.attributes);
		return { user: attrs };
	},

	profile: function() {
		if(!this._profile) {
			this._profile = new Deckster.Models.Profile(this.get("profile"), {
				user: this
			});
		}
		return this._profile;
	},

	decks: function() {
		if(!this._decks && this.get("decks")) {
			var decks = this.get("decks").map(function(deck) {
				var cards = deck["cards"];
				
				deck = new Deckster.Models.Deck(deck);
				deck.cards(cards)
				return deck
			});
			this._decks = new Deckster.Collections.Deck(decks, {
				user: this
			});
		}
		return this._decks;
	}
});

Deckster.Models.CurrentUser = Deckster.Models.User.extend({
	url: "/sessions",

	initialize: function(options) {
		this.listenTo(this, "change", this.fireSessionEvent);
	},

	isSignedIn: function() {
		return this.get("signedIn");
	},

	signIn: function(options) {
		var model = this,
			credentials = {
				"user[username]": options.username,
				"user[password]": options.password
			};

		$.ajax({
			url: this.url,
			type: "POST",
			data: credentials,
			dataType: "json",
			success: function(data) {
				_.extend(data, {
					signedIn: true
				});
				model.set(data);
			},
			error: function(errors) {
				var err = errors.responseJSON.err;
				options.error && options.error(err);
			}
		});
	},

	signOut: function(options) {
		var model = this;

		$.ajax({
			url: this.url,
			type: "DELETE",
			dataType: "json",
			success: function(data) {
				model.clear();
				options.success && options.success();
			}
		});
	},

	fireSessionEvent: function() {
		if(this.isSignedIn()) {
			this.trigger("signIn");
		} else {
			this.trigger("signOut");
		}
	}
});