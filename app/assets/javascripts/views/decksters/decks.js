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
		"click .fa-chevron-left": "toggleDeckNav"
	},

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
	}
});