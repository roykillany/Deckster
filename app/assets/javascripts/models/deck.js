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
	}
})