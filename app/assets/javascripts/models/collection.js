Deckster.Models.Collection = Backbone.Model.extend({
	urlRoot: "api/collections",

	parse: function(resp) {
		var self = this;

		console.log(resp);
		if(resp.cards.length > 0) {

			this.cards(resp.cards.length)
			delete resp.cards;
		}

		return resp;
	},

	cards: function(data) {
		var self = this;
		if(!this._cards) {
			this._cards = new Deckster.Collections.Card();

			console.log(this);
			this.get("cards").forEach(function(el) {
				self._cards.add(new Deckster.Models.Card(el));
			});
		}

		return this._cards;
	},

	updateCards: function(card) {
		this.set({cards: card});
	},

	update: function(params, callback) {
		console.log("update", this, params);
		var self = this;

		$.ajax({
			url: self.urlRoot + "/" + self.id,
			type: "PATCH",
			data: params,
			success: function(resp) {
				console.log("UPDATED", resp);
			},
			error: function(err) {
				console.log("ERROR", err)
			}
		});
	}
});