Deckster.Views.collectionDetail = Backbone.CompositeView.extend({
	template: JST["decksters/collection_detail"],

	className: "collection-detail",

	initialize: function(opts) {
	},

	render: function() {
		var content = this.template({
			cards: this.model.cards(),
		});

		this.$el.html(content);
		return this;
	},
});