Deckster.Views.headerView = Backbone.CompositeView.extend({
	template: JST["decksters/header"],

	events: {
		"click #logout": "logOut",
	},

	initialize: function() {
		this.listenTo(this.model, "sync", this.render);
	},

	render: function() {
		var content = this.template({
			model: this.model
		});
		this.$el.html(content);
		return this;
	},

	logOut: function(e) {
		var options = {
			success: Deckster.router._goHome
		};

		this.model.signOut(options);
	}
});