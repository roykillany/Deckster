Deckster.Views.settingsView = Backbone.CompositeView.extend({
	template: JST["decksters/settings"],

	className: "settings",

	initialize: function(opts) {

	},

	render: function() {
		var content = this.template({
			user: this.model
		});

		this.$el.html(content);
		return this;
	}
});