Deckster.Views.RootView = Backbone.View.extend({
	template: JST["index"],

	className: "landing",

	ui: {
		signupID: ".signup .username",
		signupPW: ".signup .password",
		signupEmail: ".signup .email"
	},

	events: {
		"click #signup": "signUp",
	},

	initialize: function(opts) {
		var self = this;
		this.callback = opts.callback;
		this.listenTo(Deckster.currentUser, "signIn", self.signInCallback);
	},

	render: function() {
		var content = this.template();
		this.$el.html(content);
		return this;
	},

	signUp: function(e) {
		var username = $(this.ui.signupID).val(),
			password = $(this.ui.signupPW).val(),
			email = $(this.ui.signupEmail).val(),
			data = {
				user: {
					username: username,
					password: password,
					email: email
				}
			};

		$.ajax({
			url: "/api/users",
			type: "POST",
			data: data,
			success: function(resp) {
				console.log("SIGNED UP!", resp);
			},
			error: function(resp) {
				console.log("ERRORED!", resp);
			}
		});
	},

	signInCallback: function() {
		if(this.callback) {
			this.callback();
		} else {
			Backbone.history.navigate("profile/me", { trigger: true });
		}
	},
});