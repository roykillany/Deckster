Deckster.Models.Deck = Backbone.Model.extend({
	urlRoot: "api/decks",

	parse: function(resp) {
		var self = this,
			count,
			i;

		if(resp.cards) {
			count = resp.cards.length,
			i = 0;

			this.cards(resp.cards)
			delete resp.cards;
		}

		return resp;
	},

	cards: function(data) {
		var self = this;
		if(!this._cards) {
			this._cards = new Deckster.Collections.Card();

			data.forEach(function(el) {
				self._cards.add(new Deckster.Models.Card(el));
			})
		}

		return this._cards;
	},

	updateCards: function(cards) {
		this.set({cards: cards.models});
	},

	update: function(callback) {
		var data = { deck: {
					cards_attributes: this.get("cards").map(function(e) {
						return e.attributes
					}),
					title: this.escape("title"),
					profile_id: this.get("profile_id"),
					key_card: this.get("key_card")
				}
			},
			self = this;

		console.log(data);
		console.log(data.deck.cards_attributes);

		$.ajax({
			url: self.urlRoot + "/" + self.id,
			type: "PATCH",
			data: data,
			success: function(resp) {
				console.log("UPDATED", resp);
				callback(resp);
			},
			error: function(err) {
				console.log("ERROR", err)
			}
		});
	}
})