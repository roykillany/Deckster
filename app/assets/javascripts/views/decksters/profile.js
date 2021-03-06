Deckster.Views.profileView = Backbone.CompositeView.extend({
	template: JST["decksters/profile"],

	className: "profile",

	ui: {
	},

	events: {
		"click .add-decks": "addToDecks",
		"click .nav-decks": "navToDecks",
		"click .nav-collection": "navToCollection"
	},

	initialize: function(opts) {
	},

	render: function() {
		var content = this.template({
			decks: this.collection
		});
		this.$el.html(content);
		return this;
	},

	navToDecks: function(e) {
		Backbone.history.navigate("decks/me", { trigger: true });
	},

	addToDecks: function(e) {
		Backbone.history.navigate("decks/add", { trigger: true });
	},

	navToCollection: function(e) {
		Backbone.history.navigate("collection/me", { trigger: true });
	}
});