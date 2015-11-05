Deckster.Views.cardItemView = Backbone.View.extend({
	template: JST["decksters/card_item"],

	className: "card-item",

	events: {
		"click .name": "showToggleQuant",
		"click .toggle": "toggleQuant",
	},

	render: function() {
		var content = this.template({
			card: this.model
		});

		this.$el.html(content);
		return this;
	},

	showToggleQuant: function(e) {
		var thisToggle = this.$(".quant-toggle-container"),
			otherActiveToggle = $(".quant-toggle-container:not(hidden)");

		if(thisToggle.hasClass("hidden")) {
			otherActiveToggle.addClass("hidden");
			thisToggle.removeClass("hidden");	
		} else {
			thisToggle.addClass("hidden");
		}
	},

	toggleQuant: function(e) {
		var cardQuant = this.$(".quantity"),
			oldVal = cardQuant.html(),
			dir = $(e.currentTarget).data("dir"),
			newVal;

		switch(dir) {
			case "up":
				newVal = parseInt(oldVal) + 1;
				cardQuant.html(newVal);
				this.model.set({quantity: newVal});
				this.flashGreen(cardQuant);
				break;
			case "down":
				newVal = oldVal - 1;
				if(newVal >= 0) {
					cardQuant.html(newVal);
					this.model.set({quantity: newVal});
					this.flashGreen(cardQuant);
				} else {
					this.flashRed(cardQuant);
				}
				break;
			default:
				break;
		}
	},

	flashRed: function(el) {
		el.addClass("flash-red");
		window.setTimeout(function() {
			el.removeClass("flash-red");
		}, 800);
	},

	flashGreen: function(el) {
		el.addClass("flash-green");
		window.setTimeout(function() {
			el.removeClass("flash-green");
		}, 800);
	}
})