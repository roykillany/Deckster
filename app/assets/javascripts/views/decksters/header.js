Deckster.Views.headerView = Backbone.CompositeView.extend({
	template: JST["decksters/header"],

	className: "header",

	ui: {
		loginID: "#signin input.username",
		loginPW: "#signin input.password",
	},

	events: {
		"click #logout": "logOut",
		"click #signin .btn": "logIn"
	},

	initialize: function() {
		this.listenTo(this.model, "sync change", this.render);
	},

	render: function() {
		var content = this.template({
			model: this.model
		});

		if(!this.model.isSignedIn()) {
			this.$el.addClass("inactive");
		} else {
			this.$el.removeClass("inactive");
		}

		this.$el.html(content);
		return this;
	},

	logOut: function(e) {
		var options = {
			success: Deckster.router._goHome
		};

		this.model.signOut(options);
	},

	logIn: function(e) {
		var self = this,
			username = $(this.ui.loginID).val(),
			password = $(this.ui.loginPW).val(),
			options = {
				username: username,
				password: password,
			};

		Deckster.currentUser.signIn(options)
	},
});