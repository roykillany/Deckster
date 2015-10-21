Deckster.Views.RootView = Backbone.View.extend({
	template: JST["index"],

	ui: {
		loginID: ".login .username",
		loginPW: ".login .password",
		signupID: ".signup .username",
		signupPW: ".signup .password",
		signupEmail: ".signup .email"
	},

	events: {
		"click #signup": "signUp",
		"click #login": "logIn"
	},

	initialize: function() {
		var self = this;
		this.listenTo(Deckster.currentUser, "change", self.navToProfile);
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

	navToProfile: function() {
		console.log(Deckster.currentUser);
		if(!Deckster.currentUser.isSignedIn()) {
			console.log("MISS");
			return;
		}
			
		Backbone.history.navigate("profile/me", { pushState: true, trigger: true });
	}
});