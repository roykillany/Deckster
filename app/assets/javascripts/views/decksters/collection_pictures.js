Deckster.Views.collectionPictures = Backbone.View.extend({
	template: JST["decksters/collection_pictures"],

	className: "collection-pictures",

	events: {
		"mouseenter .picture-item": "toggleCardImages",
		"mouseleave .picture-item": "toggleCardImages"
	},

	initialize: function(opts) {
		console.log(opts);
	},

	render: function() {
		var content = this.template({
			cards: this.collection,
		});

		this.$el.html(content);
		return this;
	},

	toggleCardImages: function(e) {
		console.log(e);
		var dir = e.type;

		if(dir === "mouseenter") {
			this.$(e.currentTarget).parent().addClass("active");
		} else {
			this.$(e.currentTarget).parent().removeClass("active");
		}
	}
});