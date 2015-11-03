Deckster.Views.footerView = Backbone.View.extend({
	template: JST["decksters/footer"],

	className: "footer",

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
			$("#footer").addClass("hidden");
		}

		this.$el.html(content);
		return this;
	}
});