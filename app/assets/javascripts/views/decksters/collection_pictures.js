Deckster.Views.collectionPictures = Backbone.View.extend({
	template: JST["decksters/collection_pictures"],

	className: "collection-pictures",

	initialize: function(opts) {
		console.log(opts);
	},

	render: function() {
		var content = this.template({
			cards: this.collection,
		});

		this.$el.html(content);
		return this;
	}
});