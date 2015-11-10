Deckster.Views.footerView = Backbone.View.extend({
	template: JST["decksters/footer"],

	className: "footer",

	events: {
		"click ul .contact": "toggleModal",
		"click ul .law-stuff": "toggleModal",
		"click .modal-close": "toggleModal",
	},

	initialize: function(opts) {
		this.listenTo(this.model, "sync change", this.render);
	},

	render: function() {
		var content = this.template({
			user: this.model
		});

		if(!this.model.isSignedIn()) {
			this.$el.addClass("inactive");
		} else {
			this.$el.removeClass("inactive");
			// $("#footer").addClass("hidden");
		}

		this.$el.html(content);
		return this;
	},

	toggleModal: function(e) {
		var target = this.$(e.currentTarget),
			modalType = target.data('modal'),
			prevModal = this.$(".modal:not('.hidden')");

		if(prevModal.length || target.hasClass("modal-close")) {
			console.log(prevModal);
			prevModal.addClass("hidden");
			$("body").removeClass("modal-open");
			prevModal.unbind("click", this._modalHandler);
		} else {
			console.log(modalType);
			var modal = this.$(".modal." + modalType);
			modal.removeClass("hidden");
			$("body").addClass("modal-open");
			modal.click(this._modalHandler);
		}
	},

	_modalHandler: function(e) {
		if(e.target != this) {
			return;
		}
		$(".modal:not('.hidden')").addClass("hidden");
		$("body").removeClass("modal-open");
	}
});