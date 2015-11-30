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
		"keyup #main-search": "searchCards",
		"blur #main-search": "toggleSearchRes",
		"focus #main-search": "toggleSearchRes",
		"mouseenter .search-item": "toggleSearchItemPrev",
		"mouseleave .search-item": "toggleSearchItemPrev"
	},

	initialize: function() {
		this.listenTo(this.model, "sync change", this.render);
		this.searchItems = [];
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
		this.$("#signin").addClass("active");
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
		this.$(".main-nav-icon").click();
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
			navIcon = this.$(e.currentTarget),
			hoverCallback = function(e) {
				console.log("HI", self, this);
				navIcon.removeClass("active");
				nav.removeClass("active");
				content.unbind();
			},
			content = $("#content");

		if(nav.hasClass("active")) {
			nav.removeClass("active");
			navIcon.removeClass("active");
		} else {
			nav.addClass("active");
			navIcon.addClass("active");
			window.setTimeout(function() {
				content.hover(hoverCallback);
			}, 500);
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

	searchCards: function(e) {
		var searchItem = this.$(e.currentTarget).val()
			self = this,
			searchResults = self.$("#main-search-container .list");

		console.log(searchItem);

		if(searchItem !== "") {
			$.ajax({
				url: "https://api.deckbrew.com/mtg/cards/typeahead",
				type: "GET",
				data: { q: searchItem },
				success: function(resp) {
					if(resp.length > 0) {
						self.searchItems = resp;
						searchResults.removeClass("hidden").empty();
						resp.forEach(function(el) {
							searchResults.append("<li class='search-item' data-id='" + el.id + "'>" + el.name + "</li>");
						});
					}
				}
			});
		} else {
			searchResults.addClass("hidden");
		}
	},

	toggleSearchRes: function(e) {
		var searchResults = self.$("#main-search-container .list");
		if(searchResults.hasClass("hidden")) {
			searchResults.removeClass("hidden");
		} else {
			searchResults.addClass("hidden");
		}
	},

	toggleSearchItemPrev: function(e) {
		var searchResPrev = this.$(".search-preview"),
			searchItemId = $(e.currentTarget).data("id"),
			eventType = e.type,
			prevImage = this.findPrevImg(searchItemId);

		if(eventType === "mouseenter") {
			searchResPrev.removeClass("hidden").html("<img src='" + prevImage + "'></img>");
		} else {
			searchResPrev.addClass("hidden");
		}
	},

	findPrevImg: function(itemId) {
		var target = this.searchItems.filter(function(item) {
				return item.id === itemId;
			}),
			editions = target[0].editions.filter(function(ed) {
				if(ed["multiverse_id"] === 0) {
					return false;
				} else {
					return true;
				}
			}),
			edition = editions[editions.length - 1];

		return edition["image_url"];
	}
});