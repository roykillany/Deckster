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

			if(data === undefined) {
				this.get("cards").forEach(function(el) {
					self._cards.add(new Deckster.Models.Card(el));
				});
			} else {
				data.forEach(function(el) {
					self._cards.add(el);
				});
			}
		}

		return this._cards;
	},

	getOrFetchChartData: function(callback) {
		if(this.get("color_distribution")) {
			callback && callback(this);
		} else {
			$.ajax({
				url: "/api/chart_info/" + this.id,
				type: "GET",
				success: function(resp) {
					callback && callback(resp);
				}
			});
		}
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

		$.ajax({
			url: self.urlRoot + "/" + self.id,
			type: "PATCH",
			data: data,
			success: function(resp) {
				callback(resp);
			},
			error: function(err) {
			}
		});
	}
})