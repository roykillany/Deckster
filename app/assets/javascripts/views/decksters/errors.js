Deckster.Views.errorView = Backbone.View.extend({
	template: JST["decksters/errors"],

	className: "errors",

	initialize: function(opts) {
		console.log("ERRORVIEW opts", opts);
		this.errors = opts.errors;
		this.hasTitle = this.errors.title;
	},

	render: function() {
		var content = this.template({
			cardErrors: this.errors.cardName,
			hasTitle: this.hasTitle
		});

		this.$el.html(content);
		return this;
	}
});