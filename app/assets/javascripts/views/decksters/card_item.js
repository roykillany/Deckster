Deckster.Views.cardItemView = Backbone.View.extend({
	template: JST["decksters/card_item"],

	className: "card-item",

	events: {
	},

	render: function() {
		var content = this.template({
			card: this.model
		});

		this.$el.html(content);
		return this;
	}
})