Deckster.Views.deckView = Backbone.CompositeView.extend({
	template: JST["decksters/decks"],

	className: "decks-inventory",

	ui: {
		hideNavBtn: ".fa-chevron-right",
		showNavBtn: ".fa-chevron-left",
		deckNav: ".decks-nav"
	},

	events: {
		"click .fa-chevron-right": "toggleDeckNav",
		"click .fa-chevron-left": "toggleDeckNav",
		"click .decks-nav .deck-item": "showDeck"
	},

	initialize: function() {
		var self = this;

		this.listenTo(this.collection, "add", this.addDeck);
		this.collection.each(function(item, idx) {
			self.addDeck(item, idx);
		});
	},

	addDeck: function(deck, idx) {
		var deckItemView = new Deckster.Views.deckItemView({
			model: deck,
			idx: idx
		});
		this.addSubview(".decks-container", deckItemView);
	},

	render: function() {
		var content = this.template({
				decks: this.collection
			}),
			self = this;

		this.$el.html(content);
		this.attachSubviews();

		return this;
	},

	toggleDeckNav: function(e) {
		console.log(e);
		var target = $(e.currentTarget),
			deckNav = this.$(this.ui.deckNav),
			showNavBtn = this.$(this.ui.showNavBtn);

		if(target.hasClass("right")) {
			deckNav.addClass("closed");
			showNavBtn.show();
		} else if(target.hasClass("left")) {
			deckNav.removeClass("closed");
			showNavBtn.hide();
		}
	},

	showDeck: function(e) {
		var targetDeckId = $(e.currentTarget).data("deck-id"),
			currentDeckBtn = this.$("nav .deck-item.active"),
			nextDeckBtn = this.$("nav .deck-item[data-deck-id='" + targetDeckId + "']"),
			currentDeck = this.$(".decks-container .deck-item.active"),
			nextDeck = this.$(".decks-container .deck-container[data-deck-id='" + targetDeckId + "']");

		console.log(currentDeck);
		console.log(currentDeckBtn);
		console.log(nextDeck);
		console.log(nextDeckBtn);
		currentDeck.removeClass("active");
		currentDeckBtn.removeClass("active");
		nextDeck.parent().addClass("active");
		nextDeckBtn.addClass("active");
	}
});