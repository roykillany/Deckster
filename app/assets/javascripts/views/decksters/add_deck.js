Deckster.Views.addDeckView = Backbone.CompositeView.extend({
	template: JST["decksters/add_deck"],

	className: "add-deck",

	ui: {
		listUpload: "#list-upload",
		deckTitle: "#deck-upload .title",
		errors: "#upload-errors",
		cardCount: ".card-count",
		cardSearch: ".card-search",
		searchResults: ".search-dropdown"
	},

	events: {
		"click #add-deck": "createDeck",
		"keyup #deck-upload .title": "validateTitle",
		"keyup #list-upload": "updateCardCount",
		"keyup .card-search": "cardTypeahead",
		"focus .card-search": "toggleSearchResults",
		"blur .card-search": "toggleSearchResults",
		"scroll .search-dropdown": "adjustFullImgPos",
		"click .search-dropdown .item": "addCard"
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
			cardList = this._createCards(rawList),
			title = this.$(this.ui.deckTitle).val(),
			self = this;

		console.log(rawList);
		cardList.map(function(el, idx, arr) {
			var name = el.get("name"),
				lastIdx = idx === arr.length - 1;

			$.ajax({
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
							if(lastIdx) {
								self._saveDeck(arr.filter(self._filterErrors), title);
								return null;
							} else {
								return null;
							}
						} else {
							el.set(self._formatResp(resp[0]));
							if(lastIdx) {
								self._saveDeck(arr.filter(self._filterErrors), title);
								return el;
							} else {
								return el;
							}
						}
					} else if (resp.length === 0) {
						self.errors["cardName"].push(name);
						if(lastIdx) {
							self._saveDeck(arr.filter(self._filterErrors), title);
							return null;
						} else {
							return null;
						}
					} else {
						el.set(self._formatResp(resp[0]));
						if(lastIdx) {
							self._saveDeck(arr.filter(self._filterErrors), title);
							return el;
						} else {
							return el;
						}
					}
				}
			});
		});
	},

	cardTypeahead: function(e) {
		var input = this.$(this.ui.cardSearch),
			dropdown = this.$(this.ui.searchResults),
			value = input.val(),
			self = this;
		
		self.eachSubview(function(view) {
			view.remove();
		});

		// if(!e.target.value.match(/^([a-z])/)) {return;}

		if(value !== "") {
			$.ajax({
				url: "https://api.deckbrew.com/mtg/cards/typeahead",
				type: "GET",
				dataType: "json",
				data: { q: value },
				success: function(resp) {
					dropdown.addClass("active");
					self._generateDropdown(resp);
				}
			});
		} else {
			dropdown.removeClass("active");
		}
	},

	_createCards: function(list) {
		if(list.length === 0) { return []; };
		var self = this,
			makeCard = function(card) {
				var quantity = card[0],
					name = card[1];

				cards.push(new Deckster.Models.Card({name: name, quantity: quantity}));
			},
			cards = [];

		list.replace(/\s*\n\r?/g, '<br />')
			.replace(/^\s*/, "")
			.split(/<br \/>/)
			.map(self._parseData)
			.forEach(makeCard);

		return cards;
	},

	_parseData: function(el) {
		var splitEl = el.match(/^(\d+) (.+)/);

		if(splitEl === null) {
			return []
		} else {
			return [splitEl[1], splitEl[2]]
		}
		
	},

	_saveDeck: function(cards, title) {
		console.log(cards);
		var deck = new Deckster.Models.Deck(),
			params = { deck: {
					cards_attributes: cards,
					title: title,
					profile_id: this.model.id
				}
			},
			self = this;

		if(this.hasErrors()) {
			this.displayErrors();
		} else {
			deck.save(params, {
				success: function(resp) {
					Deckster.currentUser.decks().add(deck);
					self.navToDecks();
				}
			});
		}
	},

	navToDecks: function(e) {
		Backbone.history.navigate("decks/me", { trigger: true });
	},

	_formatResp: function(data) {
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
			card_types: data.types
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
			// self.attachSubview(".search-dropdown", itemView, "append");
		});
	},

	toggleSearchResults: function(e) {
		var dropdown = this.$(this.ui.searchResults),
			show = !dropdown.hasClass("active"),
			empty = dropdown.html() === "",
			type = e.type,
			target = this.$(e.currentTarget);
		
		if(type === "focusin" && !empty) {
			dropdown.addClass("active");
		} else if(type === "focusout" && !target.hasClass("card-search")) {
			dropdown.removeClass("active");
		}
	},

	displayErrors: function() {
		alert(this.errors);
		console.log(this.errors);
		var errorContainer = this.$(this.ui.errors),
			key;

		// CREATE ERROR VIEW AND PASS IN ERRORS

		// for(key in this.errors) {
		// 	if(key === "title" && this.errors[key] === false) {
		// 		errorContainer.append()
		// 	}
		// }
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

			console.log("HI", cardName, target);

		if(target) {
			target = target[0]
			newVal = parseInt(target.match(/^(\d+)/)[0]) + 1;
			newTarget = target.replace(/^(\d+)/, newVal.toString());
			uploadArea.val(uploadArea.val().replace(regexp, newTarget));
			console.log("BYE", target, newTarget, newVal);
		} else {
			if(uploadArea.val()) {
				console.log("1", uploadArea, uploadArea.val(), cardName);
				newVal = "\n1 " + cardName + "";
				uploadArea.val(uploadArea.val() + newVal);
			} else {
				console.log("2");
				newVal = "1 " + cardName + "";
				uploadArea.append(newVal);
			}
		}
	}
});