Deckster.Collections.Deck = Backbone.Collection.extend({
	url: "api/deck",
	model: Deckster.Models.Deck,

	parse: function(resp) {
		console.log("BYE", resp);
		return resp.decks;
	}
})