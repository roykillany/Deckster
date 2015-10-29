Deckster.Views.headerView = Backbone.CompositeView.extend({
	template: JST["decksters/header"],

	className: "header",

	ui: {
		loginID: "#signin input.username",
		loginPW: "#signin input.password",
		pwError: ".password .errors",
		nameError: ".username .errors",
		mainNav: ".main-nav",
		loginContent: "#signin .content"
	},

	events: {
		"click #logout": "logOut",
		"click #signin .btn": "showLogin",
		"click #signin.active .btn": "logIn",
		"click .nav-item": "navToPage",
		"click .main-nav-icon": "toggleMainNav",
		"mouseenter .nav-item": "toggleNavItemResp",
		"mouseleave .nav-item": "toggleNavItemResp",
	},

	initialize: function() {
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
		}

		this.$el.html(content);
		return this;
	},

	showLogin: function(e) {
		e.preventDefault();
		var content = this.$(this.ui.loginContent);

		content.addClass("active");
	},

	logOut: function(e) {
		e.preventDefault();

		var options = {
			success: Deckster.router._goHome
		};

		this.model.signOut(options);
		FB.logout(function(resp) { console.log(resp); });
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
	},

	toggleMainNav: function(e) {
		var nav = this.$(this.ui.mainNav),
			navIcon = this.$(e.currentTarget);

		if(nav.hasClass("active")) {
			nav.removeClass("active");
			navIcon.removeClass("active");
		} else {
			nav.addClass("active");
			navIcon.addClass("active");
		}
	},

	toggleNavItemResp: function(e) {
		var eType = e.type,
			navItem = this.$(e.currentTarget);

		if(eType === "mouseenter") {
			navItem.addClass("active");
		} else {
			navItem.removeClass("active");
		}
	},
});