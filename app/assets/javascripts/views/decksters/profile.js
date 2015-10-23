Deckster.Views.profileView = Backbone.CompositeView.extend({
	template: JST["decksters/profile"],

	className: "profile",

	ui: {
	},

	events: {
		"click .add-decks": "addToDecks",
		"click .nav-decks": "navToDecks"
	},

	initialize: function(opts) {
		this.errors = [];
	},

	render: function() {
		var content = this.template();
		this.$el.html(content);
		return this;
	},

	navToDecks: function(e) {
		Backbone.history.navigate("decks/me", { trigger: true });
	},

	addToDecks: function(e) {
		Backbone.history.navigate("decks/add", { trigger: true });
	}
});