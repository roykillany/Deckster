Deckster.Collections.Card = Backbone.Collection.extend({
	url: "api/cards",
	
	comparator: function(card) {
		return card.get("cmc");

		// TODO advanced comparator by
		// 1) color order
		// 2) color density
	}
});