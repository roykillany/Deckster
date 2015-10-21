Deckster.Views.deckView = Backbone.CompositeView.extend({
	template: JST["decksters/decks"],

	className: "decks-inventory",

	initialize: function() {
		var self = this;

		this.listenTo(this.collection, "add", this.addDeck);
		this.collection.each(function(item) {
			self.addDeck(item);
		});
	},

	addDeck: function(deck) {
		var deckItemView = new Deckster.Views.deckItemView({
			model: deck
		});
		this.addSubview(".decks-container", deckItemView);
	},

	render: function() {
		console.log("SUBVIEWS", this.subviews());
		var content = this.template({
				decks: this.collection
			}),
			self = this;

		this.$el.html(content);
		this.attachSubviews();

		return this;
	}
});