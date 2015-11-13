Deckster.Views.settingsView = Backbone.CompositeView.extend({
	template: JST["decksters/settings"],

	className: "settings",

	events: {
		"click .save-settings": "togglePasswordConfirmationModal",
		"click .modal-close": "togglePasswordConfirmationModal",
		"click #confirm-password": "confirmPassword"
	},

	initialize: function(opts) {
		console.log(opts);
	},

	render: function() {
		var content = this.template({
			user: this.model
		});

		this.$el.html(content);
		return this;
	},

	saveSettings: function() {
		var data = { user: {
					username: this.$("input.username").val(),
					password: this.$("input.password").val(),
					email: this.$("input.email").val() 
				}
			},
			self = this;

		console.log(data);

		Deckster.currentUser.update(data, {
			success: function(resp) {
				Deckster.currentUser.set(resp.data);
				self.render();
				self.flashChanges(resp.changes);
			}
		});
	},

	togglePasswordConfirmationModal: function(e) {
		var target = this.$(e.currentTarget),
			modal = this.$(".modal"),
			callback = function(e) {
				if(e.target != this) {
					return;
				}

				$(".modal:not('.hidden')").addClass("hidden");
				$("body").removeClass("modal-open");
			};

		if(target.hasClass("modal-close")) {
			modal.addClass("hidden");
			$("body").removeClass("modal-open");
			modal.unbind("click", callback);
		} else {
			modal.removeClass("hidden");
			$("body").addClass("modal-open");
			modal.click(callback);
		}
	},

	confirmPassword: function(e) {
		var pwField = this.$("input.pass-input"),
			pw = pwField.val(),
			self = this;

		$.ajax({
			url: "/confirm_password",
			type: "GET",
			data: { password: pw },
			success: function(resp) {
				if(resp.resp) {
					self.saveSettings();
				} else {
					self.displayErrors(pwField);
				}
			}
		})
	},

	displayErrors: function(el) {
		el.addClass("highlight-red");
	},

	flashChanges: function(changes) {
		var self = this;
		console.log(changes);
		changes.forEach(function(el) {
			console.log(el);
			this.$("label." + el).addClass("flash-green");
			this.$("input." + el).addClass("flash-green");
			window.setTimeout(function() {
				console.log("hi", this, self);
				this.$("label." + el).removeClass("flash-green");
				this.$("input." + el).removeClass("flash-green");
			}.bind(self), 1000);
		});
	}
});