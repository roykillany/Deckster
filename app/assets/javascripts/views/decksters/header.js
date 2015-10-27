Deckster.Views.headerView = Backbone.CompositeView.extend({
	template: JST["decksters/header"],

	className: "header",

	ui: {
		loginID: "#signin input.username",
		loginPW: "#signin input.password",
		pwError: ".password .errors",
		nameError: ".username .errors"
	},

	events: {
		"click #logout": "logOut",
		"click #signin .btn": "logIn",
		"click .nav-item": "navToPage"
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
		e.preventDefault();

		var options = {
			success: Deckster.router._goHome
		};

		this.model.signOut(options);
	},

	logIn: function(e) {
		e.preventDefault();
		this.clearErrors();

		var self = this,
			username = $(this.ui.loginID).val(),
			password = $(this.ui.loginPW).val(),
			options = {
				username: username,
				password: password,
				error: this.showErrors.bind(this)
			};

		Deckster.currentUser.signIn(options)
	},

	navToPage: function(e) {
		var pageName = $(e.currentTarget).data("url");

		Backbone.history.navigate(pageName, { trigger: true });
	},

	showErrors: function(errors) {
		var pwErrorDiv = this.$(this.ui.pwError),
			nameErrorDiv = this.$(this.ui.nameError);

		if(errors.name) {
			nameErrorDiv.html(errors.name);
		} else {
			pwErrorDiv.html(errors.pw);
		}
	},

	clearErrors: function() {
		var pwErrorDiv = this.$(this.ui.pwError),
			nameErrorDiv = this.$(this.ui.nameError);

		pwErrorDiv.empty();
		nameErrorDiv.empty();
	}
});