Deckster.Views.deckItemView = Backbone.View.extend({
	template: JST["decksters/deck_item"],

	className: "deck-item",

	ui: {
		cardImage: ".name",
		imageBox: ".image-viewer"
	},

	events: {
		"mouseenter .name": "toggleImage",
		"mouseleave .name": "toggleImage"
	},

	render: function() {
		console.log("DECK ITEM", this.model);
		var content = this.template({
			deck: this.model
		});
		this.$el.html(content);
		return this;
	},

	toggleImage: function(e) {
		var eventType = e.type,
			card = $(e.currentTarget),
			imageUrl = card.siblings(".image").attr("src"),
			imageBox = this.$(this.ui.imageBox);

		console.log("SHOW", card, e, imageUrl, imageBox);
		if(eventType === "mouseenter") {
			imageBox.attr("style", "background-image: url('" + imageUrl + "');");
		} else {
			imageBox.attr("style", "background-image: url('http://hydra-media.cursecdn.com/mtgsalvation.gamepedia.com/thumb/f/f8/Magic_card_back.jpg/200px-Magic_card_back.jpg');");
		}
	},
});