Deckster.Views.dropdownItemView = Backbone.View.extend({
	template: JST["decksters/dropdown_item"],

	className: "dropdown-item",

	ui: {
		fullImg: "img.full"
	},

	events: {
		"mouseenter .item": "toggleBigImage",
		"mouseleave .item": "toggleBigImage",
		"click .item": "addCard"
	},

	initialize: function(opts) {
		var editions = this.model.get("editions").filter(function(ed) {
				if(ed["multiverse_id"] === 0) {
					return false;
				} else {
					return true;
				}
			});

		this.edition = editions[editions.length - 1];
	},

	render: function() {
		var content = this.template({
			card: this.model,
			image: this.edition["image_url"]
		});

		this.$el.html(content);
		return this;
	},

	toggleBigImage: function(e) {
		var fullImg = this.$(this.ui.fullImg),
			isShown = fullImg.hasClass("hidden");

		if(isShown) {
			fullImg.removeClass("hidden");
		} else {
			fullImg.addClass("hidden");
		}
	},

	addCard: function(e) {
		console.log(e);
	}
});