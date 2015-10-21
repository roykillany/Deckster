Deckster.Views.profileView = Backbone.CompositeView.extend({
	template: JST["decksters/profile"],

	className: "profile",

	ui: {
		listUpload: "#list-upload",
		deckTitle: "#deck-upload .title"
	},

	events: {
		"click #add-deck": "createDeck",
		"click .navDecks": "navToDecks"
	},

	initialize: function(opts) {
		this.errors = [];
	},

	render: function() {
		var content = this.template();
		this.$el.html(content);
		return this;
	},

	createDeck: function(e) {
		var rawList = this.$(this.ui.listUpload).val(),
			cardList = this._createCards(rawList),
			title = this.$(this.ui.deckTitle).val(),
			self = this;


		cardList.map(function(el, idx, arr) {
			var name = el.get("name"),
				lastIdx = idx === arr.length - 1;

			$.ajax({
				url: "https://api.deckbrew.com/mtg/cards",
				type: "GET",
				dataType: "json",
				data: { name: name },
				success: function(resp) {
					if(resp.length > 1) {
						resp = resp.filter(function(card) {
							return card["name"] === name;
						});

						if(resp.length === 0) {
							self.errors.push(name);
							if(lastIdx) {
								self._saveDeck(arr.filter(self._filterErrors), title);
								return null;
							} else {
								return null;
							}
						} else {
							el.set(self._formatResp(resp[0]));
							if(lastIdx) {
								self._saveDeck(arr.filter(self._filterErrors), title);
								return el;
							} else {
								return el;
							}
						}
					} else if (resp.length === 0) {
						self.errors.push(name);
						if(lastIdx) {
							self._saveDeck(arr.filter(self._filterErrors), title);
							return null;
						} else {
							return null;
						}
					} else {
						el.set(self._formatResp(resp[0]));
						if(lastIdx) {
							self._saveDeck(arr.filter(self._filterErrors), title);
							return el;
						} else {
							return el;
						}
					}
				}
			});
		});
	},

	_createCards: function(list) {
		var parseData = function(el) {
				var splitEl = el.match(/^(\d+) (.+)/);

				return [splitEl[1], splitEl[2]]
			},
			makeCard = function(card) {
				var quantity = card[0],
					name = card[1];

				cards.push(new Deckster.Models.Card({name: name, quantity: quantity}));
			},
			cards = [];

		list.replace(/\s*\n\r?/g, '<br />')
			.replace(/^\s*/, "")
			.split(/<br \/>/)
			.map(parseData)
			.forEach(makeCard);


		return cards;
	},

	_saveDeck: function(cards, title) {
		var deck = new Deckster.Models.Deck(),
			params = { deck: {
					cards_attributes: cards,
					title: title,
					profile_id: this.model.id
				}
			},
			self = this;


		deck.save(params, {
			success: function(resp) {
				Deckster.currentUser.decks().add(deck);
				alert(self.errors);
				self.navToDecks();
			}
		});
	},

	_formatResp: function(data) {
		if (data === undefined) { return; };
		var editions = data.editions.filter(function(ed) {
				if(ed["multiverse_id"] === 0) {
					return false;
				} else {
					return true;
				}
			}),
			edition = editions[editions.length - 1];

		return _.extend(data, {
			mana_cost: data.cost,
			image_url: edition["image_url"],
			rarity: edition["rarity"],
		});
	},

	_filterErrors: function(card) {
		if(card.get("cmc") === undefined) {
			return false;
		} else {
			return true;
		}
	},

	navToDecks: function(e) {
		Backbone.history.navigate("decks/me", { trigger: true });
	}
});