Deckster.Views.deckView = Backbone.CompositeView.extend({
	template: JST["decksters/decks"],

	className: "decks-inventory",

	ui: {
		hideNavBtn: ".fa-chevron-right",
		showNavBtn: ".fa-chevron-left",
		deckNav: ".decks-nav"
	},

	events: {
		"click .fa-chevron-right": "toggleDeckNav",
		"click .fa-chevron-left": "toggleDeckNav",
		"click .decks-nav .deck-item": "showDeck",
		"click .deck-img-container": "navToDeckView",
		"click .carousel-indicator": "carouselNav",
	},

	initialize: function() {
		var self = this;

		this.listenTo(this.collection, "add", this.addDeck);
		this.collection.each(function(item, idx) {
			self.addDeck(item, idx);
		});
		this.divideDecks();
		this.currentScroll = 0;
	},

	divideDecks: function() {
		this.groupedDecks = [];

		var decks = this.collection.models,
			groups = Math.ceil(this.collection.length / 4),
			decksCount = this.collection.length,
			i = 0;

		for(i; i < groups; i++) {
			this.groupedDecks.push(decks.slice(i * 4, i * 4 + 4));
		}
	},

	addDeck: function(deck, idx) {
		var deckItemView = new Deckster.Views.deckItemView({
			model: deck,
			idx: idx
		});
		this.addSubview(".decks-container", deckItemView);
	},

	render: function() {
		var content = this.template({
				groupDecks: this.groupedDecks,
				decks: this.collection
			}),
			self = this;

		this.$el.html(content);
		$(document).on("scroll", self.scrollDeckNav.bind(self));

		return this;
	},

	toggleDeckNav: function(e) {
		console.log(e);
		var target = $(e.currentTarget),
			deckNav = this.$(this.ui.deckNav),
			showNavBtn = this.$(this.ui.showNavBtn),
			hideNavBtn = this.$(this.ui.hideNavBtn);

		if(target.hasClass("right")) {
			deckNav.addClass("closed");
			showNavBtn.show();
			hideNavBtn.hide();
		} else if(target.hasClass("left")) {
			deckNav.removeClass("closed");
			showNavBtn.hide();
			hideNavBtn.attr("style", "");
		}
	},

	showDeck: function(e) {
		var targetDeckId = $(e.currentTarget).data("deck-id"),
			currentDeckBtn = this.$("nav .deck-item.active"),
			nextDeckBtn = this.$("nav .deck-item[data-deck-id='" + targetDeckId + "']"),
			currentDeck = this.$(".decks-container .deck-item.active"),
			nextDeck = this.$(".decks-container .deck-container[data-deck-id='" + targetDeckId + "']");

		if(targetDeckId == currentDeckBtn.data("deck-id")) { return; };
		currentDeck.removeClass("active").addClass("transition");
		currentDeckBtn.removeClass("active");
		nextDeck.parent().addClass("active");
		nextDeckBtn.addClass("active");

		window.setTimeout(function() {
			currentDeck.removeClass("transition");
		}, 1000);
	},

	scrollDeckNav: function(e) {
		var numGroups = this.groupedDecks.length,
			scrollVal = document.body.scrollTop,
			itemHeight = $(window).height() - 60,
			currentViewNum = Math.round((scrollVal) / itemHeight),
			previousCutoff = itemHeight * (currentViewNum - 1),
			nextViewCutoff = itemHeight * (currentViewNum + 1),
			scrollDir = scrollVal - this.currentScroll > 0 ? true : false,
			scrollDelta = scrollVal - this.currentScroll,
			onView = scrollVal % itemHeight === 0,
			currentView = $("ul.decks-container:nth-child(" + (currentViewNum + 1) + ")"),
			prevView = $("ul.decks-container:nth-child(" + currentViewNum + ") .deck-item-container"),
			nextView = $("ul.decks-container:nth-child(" + (currentViewNum + 2) + ") .deck-item-container");

		this.currentScroll = scrollVal;

		if(scrollVal % itemHeight > (itemHeight * 0.1) && scrollVal % itemHeight < (itemHeight * 0.9)) {
			currentView.attr("style", "margin-top: 0;");
			currentView.removeClass("stick");
			$(".carousel-indicator.active").removeClass("active");
			if(scrollVal % itemHeight > (itemHeight / 2)) {
				$(document).scrollTop(previousCutoff);
				prevView.addClass("slide-down");
				$(".carousel-indicator[data-nav-id='" + (currentViewNum - 1) + "']").addClass("active");
				window.setTimeout(function() {
					prevView.removeClass("slide-down");
				}, 1000);
			} else {
				$(document).scrollTop(nextViewCutoff);
				nextView.addClass("slide-up");
				$(".carousel-indicator[data-nav-id='" + (currentViewNum + 1) + "']").addClass("active");
				window.setTimeout(function() {
					nextView.removeClass("slide-up");
				}, 1000);
			}
		} else if(Math.abs(scrollDelta) < (itemHeight * 0.1)) {
			currentView.attr("style", "margin-top: " + scrollDelta + "px;");
			currentView.addClass("stick");
			window.setTimeout(function() {
				currentView.attr("style", "margin-top: 0px;");
				currentView.removeClass("stick");
			}, 200);
		}
	},

	navToDeckView: function(e) {
		var id = $(e.currentTarget).parent().data("id");

		Backbone.history.navigate("decks/" + id, { trigger: true });
	},

	carouselNav: function(e) {
		var prevIndicator = $(".carousel-indicator.active"),
			currIndicator = $(e.currentTarget),
			prevDeckGroupId = prevIndicator.data("nav-id"),
			currDeckGroupId = currIndicator.data("nav-id"),
			navDir = currDeckGroupId - prevDeckGroupId > 0 ? "down" : "up",
			itemHeight = $(window).height() - 60,
			groupViewCutoff = itemHeight * (currDeckGroupId),
			targetContainer = $("ul.decks-container:nth-child(" + (currDeckGroupId + 1) + ") .deck-item-container");

		$(document).scrollTop(groupViewCutoff);
		prevIndicator.removeClass("active");
		currIndicator.addClass("active");
		if(navDir === "up") {
			targetContainer.addClass("slide-down");
			window.setTimeout(function() {
				targetContainer.removeClass("slide-down");
			}, 1000);
		} else {
			targetContainer.addClass("slide-up");
			window.setTimeout(function() {
				targetContainer.removeClass("slide-up");
			}, 1000);
		}
	}
});