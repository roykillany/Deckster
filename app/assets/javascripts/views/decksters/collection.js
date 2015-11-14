Deckster.Views.collectionView = Backbone.CompositeView.extend({
	template: JST["decksters/collection"],

	className: "collection",

	events: {
		"click .view-cards": "toggleCollectionView",
		"click .view-collection": "toggleCollectionView"
	},

	initialize: function(opts) {
		console.log("collection", opts);
		this.cards = this.model ? this.model.cards().models : [];
		this.collectionDetailView = new Deckster.Views.collectionDetail({ collection: this.cards, model: this.model });
		this.collectionPictureView = new Deckster.Views.collectionPictures({ collection: this.cards, model: this.model });
		this.collectionAddView = new Deckster.Views.collectionAdd({ model: this.model });

		this.addSubview(".collection-content", this.collectionDetailView);
		this.addSubview(".collection-content", this.collectionPictureView);
		this.addSubview(".add-cards", this.collectionAddView);
	},

	render: function() {
		var content = this.template({
			collection: this.cards
		});

		this.$el.html(content);
		this.attachSubview(".collection-content", this.collectionDetailView, false);
		this.attachSubview(".add-cards", this.collectionAddView, false);

		return this;
	},

	toggleCollectionView: function(e) {
		var target = this.$(e.currentTarget),
			view = this.$(e.currentTarget).data("view");

		this.$(".collection-menu li.active").removeClass("active");
		target.addClass("active");
		if(view === "detail") {
			console.log("DETAIL");
			this.removeSubview(".collection-content", this.collectionPictureView);
			this.attachSubview(".collection-content", this.collectionDetailView, false);
			this.attachSubview(".add-cards", this.collectionAddView, false);
			// this.$(".collection-content").html(this.collectionDetailView.render());
		} else if (view === "pictures") {
			console.log("PICTURES");
			this.removeSubview(".collection-content", this.collectionDetailView);
			this.removeSubview(".add-cards", this.collectionAddView);
			this.attachSubview(".collection-content", this.collectionPictureView, false);
			// this.$(".collection-content").html(this.collectionPictureView.render());
		}
	}
});