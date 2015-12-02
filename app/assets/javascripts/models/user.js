Deckster.Models.User = Backbone.Model.extend({
	urlRoot: "api/users",

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
		console.log("user", this);
		if(!this._decks) {
			if (this.get("decks")) {
				var decks = this.get("decks").map(function(deck) {
					console.log(deck);
					var cards = deck._cards;
				
					deck.cards(cards);
					return deck;
				});
				this._decks = new Deckster.Collections.Deck(decks, {
					user: this
				});
			} else {
				this._decks = new Deckster.Collections.Deck([], {
					user: this
				});
			}
		} else if(this.get("decks")) {
			var decks = this.get("decks").map(function(deck) {
				console.log(deck);
				var cards = deck._cards;
			
				deck.cards(cards);
				return deck;
			});
			this._decks = new Deckster.Collections.Deck(decks, {
				user: this
			});
		}

		console.log(this._decks);
		return this._decks;
	},

	collection: function() {
		if(!this._collection && this.get("collection")) {
			var collection = new Deckster.Models.Collection(this.get("collection"), {
					user: this
				}),
				cards = collection["cards"];

			collection.cards(cards);
			this._collection = collection;
		}
		return this._collection;
	}
});

Deckster.Models.CurrentUser = Deckster.Models.User.extend({
	url: "/sessions",

	initialize: function(options) {
		this.listenTo(this, "change", this.fireSessionEvent);
	},

	update: function(data, options) {
		var self = this;

		$.ajax({
			url: "/api/users/" + self.id,
			type: "PATCH",
			data: data,
			success: function(resp) {
				options.success && options.success(resp);
			},
			error: function(resp) {
				options.error && options.error(resp);
			}
		})
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

		Pace.track(function() {
			$.ajax({
				url: model.url,
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
		});
	},

	fbAuth: function(resp) {
		var self = this,
			data = _.extend(resp, {
				provider: "Facebook"
			});

		$.ajax({
			url: "fb_auth",
			type: "POST",
			data: data,
			success: function(data) {
				_.extend(data, {
					signedIn: true
				});
				self.set(data)
			},
			error: function(error) {
				console.log("FB AUTH ERROR");
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

	getOrFetchCollection: function(cb) {
		var self = this;

		if(self.get("collection")) {
			cb && cb(self.get("collection"));
		} else {
			$.ajax({
				url: "/api/collections/" + self.get("profile").id,
				type: "GET",
				success: function(resp) {
					self.set({collection: new Deckster.Models.Collection(resp)});
					cb && cb(self.get("collection"));
				}
			});
		}
	},

	getOrFetchDeck: function(id, cb) {

		var self = this,
			deck = self.decks().find({id: id});

		if(deck){
			cb && cb(deck);
		} else {
			$.ajax({
				url: "/api/decks/" + id,
				type: "GET",
				success: function(resp) {
					var deck = new Deckster.Models.Deck(resp);
					if(self.get("decks") && !self.decks().find({id: resp.id})) {
						self.get("decks").push(deck);
					} else if(!self.get("decks")) {
						self.set({decks: [deck]});
					}
					cb && cb(deck);
				}
			});
		}
	},

	getOrFetchDecks: function(cb) {
		var self = this;
		if(self.get("decks")) {
			cb && cb(self.decks());
		} else {
			$.ajax({
				url: "/api/user_decks/" + self.get("profile").id,
				type: "GET",
				success: function(resp) {
					self.set({decks: new Deckster.Collections.Deck(resp)});
					cb && cb(self.decks());
				}
			});
		}
	},

	fireSessionEvent: function() {
		if(this.isSignedIn()) {
			this.trigger("signIn");
		} else {
			this.trigger("signOut");
		}
	}
});