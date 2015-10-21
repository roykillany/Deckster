Deckster.Models.Profile = Backbone.Model.extend({
	urlRoot: "api/profile",

	parse: function(resp) {
		if(resp.profiles) {
			Deckster.profiles.set(resp.profiles);
			delete response.users;
		}
		return resp;
	},

	toJSON: function() {
		var attrs = _.clone(this.attributes);
		return { profile: attrs };
	}
});