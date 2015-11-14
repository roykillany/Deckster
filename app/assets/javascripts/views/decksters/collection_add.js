Deckster.Views.collectionAdd = Backbone.View.extend({
	template: JST["decksters/collection_add"],

	className: "collection-add",

	ui: {
		listUpload: "#list-upload",
	},

	events: {
		"click #add-collection": "createCollection",
		"click .show-format": "toggleFormatModal",
		"click .modal-close": "toggleFormatModal"
	},

	initialize: function(opts) {
		var self = this;
		this.errors = {
			"cardName": [],
		};
	},

	render: function() {
		var content = this.template({});

		this.$el.html(content);
		return this;
	},

	createCollection: function(e) {
		var rawList = this.$(this.ui.listUpload).val(),
			self = this;
			
		this._createCards(rawList, this._saveCollection.bind(self));
	},

	_createCards: function(list, callback) {
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
				console.log(list);
				callback(cards.filter(self._filterErrors), self);
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

	_saveCollection: function(cards, view) {
		console.log("SAVING", this, cards, view);
		var params = { collection: {
					cards_attributes: cards,
					profile_id: view.model.id,
				}
			},
			self = view;

		console.log("FINAL CARDS", params);

		if(self.hasErrors()) {
			self.highlightErrors();
			self.displayErrors();
		} else {
			params.collection.cards_attributes.forEach(function(data) {
				var card = new Deckster.Models.Card({collection_id: self.model.id});

				card.save(
					{ card: data },
					{ success: function(resp) {
						self.model.updateCards(resp);
					}
				});
			});
		}
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
		};
	},

	highlightErrors: function() {
		if(this.errors.cardName.length > 0) {
			this.$(this.ui.listUpload).addClass("highlight-red");
		}
	},

	hasErrors: function() {
		return this.errors["cardName"].length > 0;
	},

	toggleFormatModal: function(e) {
		var modal = $("#formatting-modal"),
			handler = function(e) {
				if(e.target != this) {
					return;
				}

				modal.addClass("hidden");
				$("body").removeClass("modal-open");
				modal.unbind("click", handler);
				modalClose.unbind("click", self.toggleFormatModal);
			},
			modalClose = modal.find(".modal-close"),
			self = this;

		console.log(modal);

		if(modal.hasClass("hidden")) {
			modal.removeClass("hidden");
			modal.click(handler);
			modalClose.click(self.toggleFormatModal);
			$("body").addClass("modal-open");
		} else {
			modal.addClass("hidden");
			modal.unbind("click", handler);
			$("body").removeClass("modal-open");
			modalClose.unbind("click", self.toggleFormatModal);
		}
	}
});