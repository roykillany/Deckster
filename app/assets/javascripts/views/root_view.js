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
		"click #guest-signup": "guestSignUp"
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
				Deckster.currentUser.set(resp);
				Deckster.currentUser.signIn({username: username, password: password});
				Backbone.history.navigate("profile/me", { trigger: true });
			},
			error: function(resp) {
				console.log("ERRORED!", resp);
			}
		});
	},

	guestSignUp: function(e) {
		// this._fillInInfo();

		$.ajax({
			url: "/guest",
			type: "GET",
			success: function(resp) {
				console.log(resp);
				var data = _.extend(resp, {
					signedIn: true
				})
				Deckster.currentUser.set(data);
				// Deckster.currentUser.signIn({username: username, password: password});
				Backbone.history.navigate("profile/me", { trigger: true });
			},
			error: function(err) {
				console.log(err);
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

	_fillInInfo: function() {
		var nameInp = this.$(".signup input.username"),
			passInp = this.$(".signup input.password"),
			emailInp = this.$(".signup input.email");
	}
});