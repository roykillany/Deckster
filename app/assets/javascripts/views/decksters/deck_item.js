Deckster.Views.deckItemView = Backbone.CompositeView.extend({
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

	initialize: function(opts) {
		this.idx = opts.idx;
		this.categories = ["creature", "non-creature", "land"];
		this.counts = {};
		this.model.cards().each(this.categorizeCard.bind(this));

		this.listenTo(this.collection, "add", this.addCard);
	},

	render: function() {
		var content = this.template({
				deck: this.model,
				idx: this.idx,
				counts: this.counts
			}),
			self = this;

		if(this.idx === 0) {
			this.$el.addClass("active");
		}

		this.$el.html(content);
		this.attachSubviews();

		return this;
	},

	addCard: function(card, selector) {
		var cardItemView = new Deckster.Views.cardItemView({
			model: card
		});
		this.addSubview(selector, cardItemView);
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

	categorizeCard: function(card) {
		var types = card.get("card_types"),
			quant = card.get("quantity");

		if(_.indexOf(types, "Creature") >= 0) {
			this.addCard(card, ".creature");
			this.counts["creature"] ? this.counts["creature"] += quant : this.counts["creature"] = quant;
		} else if (_.indexOf(types, "Land") >= 0) {
			this.addCard(card, ".land");
			this.counts["land"] ? this.counts["land"] += quant : this.counts["land"] = quant;
		} else {
			this.addCard(card, ".non-creature");
			this.counts["non-creature"] ? this.counts["non-creature"] += quant : this.counts["non-creature"] = quant;
		}
	},
});