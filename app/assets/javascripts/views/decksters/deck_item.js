Deckster.Views.deckItemView = Backbone.CompositeView.extend({
	template: JST["decksters/deck_item"],

	className: "deck-item",

	ui: {
		cardImage: ".name",
		imageBox: ".image-viewer"
	},

	events: {
		"mouseenter .name": "toggleImage",
		"mouseleave .name": "toggleImage",
		"click .deck-menu li": "toggleDeckView",
		"click #update-deck": "updateDeck"
	},

	initialize: function(opts) {
		this.idx = opts.idx;
		this.categories = ["creature", "non-creature", "land"];
		this.counts = {};
		this.model.cards().each(this._categorizeCard.bind(this));
		this.collection = this.model.cards();
		this.colorDistrib = this.model.get("color_distribution");
		this.curve = this.model.get("curve");
		this.colors = {
			"White": "#FFFF66",
			"Blue": "#0000FF",
			"Black": "#000000",
			"Red": "#FF0000",
			"Green": "#33CC33"
		};
		this.highlightColors = {
			"White": "#FFFF94",
			"Blue": "#4D4DFF",
			"Black": "#4D4D4D",
			"Red": "#FF4D4D",
			"Green": "#70DB70"
		};
		this.defaultCard = "https://s3.amazonaws.com/decksterdev/defaults/200px-Magic_card_back.jpg";

		this.listenTo(this.collection, "add", this.addCard);
		this.listenTo(this.collection, "change", function() {
			this.model.updateCards(this.collection);
		});
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
			card = this.$(e.currentTarget),
			imageUrl = card.siblings(".image").attr("src"),
			imageBox = this.$(this.ui.imageBox);

		if(eventType === "mouseenter") {
			imageBox.attr("style", "background-image: url('" + imageUrl + "');");
		} else {
			imageBox.attr("style", "background-image: url('" + this.defaultCard + "');");
		}
	},

	toggleDeckView: function(e) {
		var viewType = this.$(e.currentTarget).data("view");

		switch(viewType) {
			case "deck":
				this.$(".content-container").removeClass("hidden");
				this.$(".chart-container").addClass("hidden");
				this.$(".view-deck").addClass("active");
				this.$(".view-chart").removeClass("active");
				this.$(this.ui.imageBox).removeClass("hidden");
				break;
			case "charts":
				this.$(".chart-container").removeClass("hidden");
				this.$(".content-container").addClass("hidden");
				this.$(this.ui.imageBox).addClass("hidden");
				this.$(".view-deck").removeClass("active");
				this.$(".view-chart").addClass("active");
				this._renderColorDistribChart();
				this._renderCurveChart();
				break;
			default:
				break;
		}
	},

	_renderColorDistribChart: function() {
		var formattedData = [],
			context = document.getElementById("color-distrib-" + this.model.id).getContext("2d"),
			colorDistribChart,
			key,
			data,
			options = {
				// responsive: true,
				animationEasing: "easeInOutQuint",
				segmentStrokeWidth : 1
			};

		for(key in this.colorDistrib) {
			data = {
				value: this.colorDistrib[key],
				color: this.colors[key],
				highlight: this.highlightColors[key],
				label: key
			};
			formattedData.push(data);
		}

		colorDistribChart = new Chart(context).Pie(formattedData, options);
	},

	_renderCurveChart: function() {
		var dataSets = [],
			labels = [],
			values = [],
			context = document.getElementById("curve-" + this.model.id).getContext("2d"),
			curveChart,
			key,
			data,
			options = {
				// responsive: true,
				animationEasing: "easeInOutQuint",	
			};

		for(key in this.curve) {
			labels.push(key + " CMC");
			values.push(this.curve[key]);
		}

		console.log("HI", labels, values);

		curveChart = new Chart(context).Bar({
			labels: labels,
			datasets: [{
				label: "CMC Distribution",
				fillColor: "rgba(52, 152, 219, 0.4)",
				strokeColor: "rgba(32, 122, 182, 0.4)",
				highlightFill: "rgba(52, 152, 219, 0.8)",
				highlightStroke: "rgba(32, 122, 182, 0.8)",
				data: values
			}]
		}, options);
	},

	_categorizeCard: function(card) {
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

	updateDeck: function(e) {
		console.log("HALLAHALLA");
		console.log(this.model);
		console.log(this.collection);

		this.model.update();
	}
});