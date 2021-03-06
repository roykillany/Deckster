Deckster.Views.addDeckView = Backbone.CompositeView.extend({
	template: JST["decksters/add_deck"],

	className: "add-deck",

	ui: {
		listUpload: "#list-upload",
		deckTitle: "#deck-upload .title",
		errors: "#upload-errors",
		cardCount: ".card-count",
		cardSearch: ".card-search",
		searchResults: ".search-dropdown",
	},

	events: {
		"click #add-deck": "createDeck",
		"keyup #deck-upload .title": "validateTitle",
		"keyup #list-upload": "updateCardCount",
		"keyup .card-search": "cardTypeahead",
		"click .card-search": "toggleSearchResults",
		"scroll .search-dropdown": "adjustFullImgPos",
		"click .search-dropdown .item": "addCard",
		"click .show-format": "toggleFormattingModal",
		"click .modal-close": "toggleFormattingModal",
	},

	initialize: function(opts) {
		var self = this;

		this.errors = {
			"cardName": [],
			"title": false
		};
	},

	render: function() {
		var content = this.template();

		this.$el.html(content);
		this.attachSubviews();

		this.$(this.ui.searchResults).on("scroll", this.adjustFullImgPos.bind(this));
		this.$(".search-dropdown .item").on("click", this.addCard);

		return this;
	},

	createDeck: function(e) {
		var rawList = this.$(this.ui.listUpload).val(),
			title = this.$(this.ui.deckTitle).val(),
			self = this;
			
		this._createCards(rawList, title, this._saveDeck);
	},

	cardTypeahead: function(e) {
		var input = this.$(this.ui.cardSearch),
			dropdown = this.$(this.ui.searchResults),
			value = input.val(),
			self = this;
		
		self.eachSubview(function(view) {
			view.remove();
		});

		if(value !== "") {
			$.ajax({
				url: "https://api.deckbrew.com/mtg/cards/typeahead",
				type: "GET",
				dataType: "json",
				data: { q: value },
				success: function(resp) {
					self._generateDropdown(resp);
				}
			});
		} else {
			this.$(this.ui.cardSearch).click();
		}
	},

	_createCards: function(list, title, callback) {
		if(list.length === 0) { return []; };
		var self = this,
			makeCard = function(card, idx, arr) {
				var quantity = card[0],
					name = card[1],
					data;

				var promise = $.ajax({
					url: "https://api.deckbrew.com/mtg/cards",
					type: "GET",
					dataType: "json",
					data: { name: name },
					success: function(resp) {
						if(resp.length > 1) {
							resp = resp.filter(function(card) {
								return card["name"] === name;
							});

							if(resp.length === 0) {
								self.errors["cardName"].push(name);
								return null;
							} else {
								cards.push(new Deckster.Models.Card(self._formatResp(resp[0], quantity)));
							}
						} else if (resp.length === 0) {
							self.errors["cardName"].push(name);
							return null;
						} else {
							cards.push(new Deckster.Models.Card(self._formatResp(resp[0], quantity)));
						}
					}
				});
				
				promises.push(promise);
			},
			promises = [],
			cards = [];

		list.replace(/\s*\n\r?/g, '<br />')
			.replace(/^\s*/, "")
			.split(/<br \/>/)
			.map(self._parseData)
			.forEach(makeCard);

		$.when.apply($, promises)
			.done(function() {
				callback(cards.filter(self._filterErrors), title, self);
			}).fail(function() {});
	},

	_parseData: function(el) {
		var splitEl = el.match(/^(\d+) (.+)/);

		if(splitEl === null) {
			return []
		} else {
			return [splitEl[1], splitEl[2]]
		}
		
	},

	_saveDeck: function(cards, title, view) {
		var deck = new Deckster.Models.Deck(),
			params = { deck: {
					cards_attributes: cards,
					title: title,
					profile_id: view.model.id,
					key_card: view.$("input.key-card").val()
				}
			},
			self = view,
			currUser = Deckster.currentUser;

		if(self.hasErrors()) {
			self.highlightErrors();
			self.displayErrors();
		} else {
			deck.save(params, {
				success: function(resp) {
					Pace.restart();
					if(currUser.get("decks") && !currUser.decks().find({id: resp.id})) {
						currUser.get("decks").push(deck);
					} else if(!currUser.get("decks")) {
						currUser.set({decks: [deck]});
					}
					self.navToDecks();
				}
			});
		}
	},

	navToDecks: function(e) {
		Backbone.history.navigate("decks/me", { trigger: true });
	},

	_formatResp: function(data, quant) {
		if (data === undefined) { return; };
		var editions = data.editions.filter(function(ed) {
				if(ed["multiverse_id"] === 0) {
					return false;
				} else {
					return true;
				}
			}),
			edition = editions[editions.length - 1];

		return _.extend(data, {
			mana_cost: data.cost,
			image_url: edition["image_url"],
			rarity: edition["rarity"],
			card_types: data.types,
			quantity: quant,
			id: null
		});
	},

	_filterErrors: function(card) {
		if(card.get("cmc") === undefined) {
			return false;
		} else {
			return true;
		}
	},

	_generateDropdown: function(list) {
		if(list.length === 0) { return;	}
		var self = this;

		list.slice(0, 9).forEach(function(el) {
			var item = new Deckster.Models.Dropdown(el),
				itemView = new Deckster.Views.dropdownItemView({
					model: item
				});

			self.addSubview(".search-dropdown", itemView);
		});

		self.$(self.ui.cardSearch).click();
	},

	toggleSearchResults: function(e) {
		var dropdown = this.$(this.ui.searchResults),
			show = !dropdown.hasClass("active"),
			empty = dropdown.html() === "",
			type = e.type,
			target = this.$(e.target),
			handler = function(e) {
				e.stopPropagation();
				if($(e.target).hasClass("card-search") || $(e.target).hasClass("item") || $(e.target).hasClass("thumb")) {
					return;
				} else {
					dropdown.removeClass("active");
					$(this).unbind("click", handler);
				}
			};
		
		if(!empty) {
			dropdown.addClass("active");
			$("body").click(handler);
		}
	},

	displayErrors: function() {
		var errorView = new Deckster.Views.errorView({
				errors: this.errors
			}),
			self = this;

		this.subviews("#upload-errors").forEach(function(v) {
			self.removeSubview("#upload-errors", v);
		});

		this.addSubview("#upload-errors", errorView);
		this.errors = {
			"cardName": [],
			"title": false
		};
	},

	highlightErrors: function() {
		if(!this.errors.title) {
			this.$(this.ui.deckTitle).addClass("highlight-red");
		}
		if(this.errors.cardName.length > 0) {
			this.$(this.ui.listUpload).addClass("highlight-red");
		}
	},

	validateTitle: function(e) {
		if($(e.currentTarget).val()) {
			this.errors["title"] = true;
		}
	},

	hasErrors: function() {
		return !this.errors["title"] || this.errors["cardName"].length > 0;
	},

	updateCardCount: function(e) {
		var self = this,
			rawCards = this.$(this.ui.listUpload).val(),
			cardsCount = rawCards.replace(/\s*\n\r?/g, '<br />')
				.replace(/^\s*/, "")
				.split(/<br \/>/)
				.map(self._parseData)
				.reduce(function(prevVal, currVal, idx, arr) {
					if(arr[0].length === 0 || arr.length === 0) {
						console.log("SHIT");
						return 0;
					}
					return prevVal + parseInt(currVal[0]);
				}, 0),
			cardCounter = this.$(this.ui.cardCount);

		if(cardsCount > 0 && rawCards !== "") {
			cardCounter.html("" + cardsCount + " cards total");
		}	else if (rawCards === "") {
			cardCounter.html("");
		}
	},

	adjustFullImgPos: function(e) {
		var heightOffset = e.target.scrollTop,
			fullImages = this.$(this.ui.searchResults).find(".full");

		fullImages.attr("style", "top: " + heightOffset + "px;");
	},

	addCard: function(e) {
		var cardName = this.$(e.currentTarget).data("name"),
			uploadArea = this.$(this.ui.listUpload),
			regexp = new RegExp("^\\d+\\s(" + cardName + ")", "gm"),
			target = uploadArea.val().match(regexp),
			newVal,
			newTarget;

		if(target) {
			target = target[0]
			newVal = parseInt(target.match(/^(\d+)/)[0]) + 1;
			newTarget = target.replace(/^(\d+)/, newVal.toString());
			uploadArea.val(uploadArea.val().replace(regexp, newTarget));
		} else {
			if(uploadArea.val()) {
				newVal = "\n1 " + cardName + "";
				uploadArea.val(uploadArea.val() + newVal);
			} else {
				newVal = "1 " + cardName + "";
				uploadArea.append(newVal);
			}
		}
	},

	toggleFormattingModal: function(e) {
		e.preventDefault();
		var modalClose = $(e.currentTarget).hasClass("modal-close"),
			modal = this.$("#formatting-modal"),
			handler = function(e) {
				if(e.target != this) {
					return;
				}
				modal.addClass("hidden");
				$("body").removeClass("modal-open");
			};

		if(modalClose) {
			modal.addClass("hidden");
			$("body").removeClass("modal-open");
			modal.unbind("click", handler);
		} else {
			modal.removeClass("hidden");
			$("body").addClass("modal-open");
			modal.click(handler);
		}
	}
});