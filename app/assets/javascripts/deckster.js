window.Deckster = {
  root: "/",
	Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
  	this.currentUser = new Deckster.Models.CurrentUser();

    // location.hash = "";
  	this.router = new Deckster.Routers.Router({
  		$rootEl: $("#content"),
      $headerEl: $("#header"),
      $footerEl: $("#footer")
  	});

    this.getSession();
  },

  getSession: function() {
    var self = this;

    $.ajax({
      url: "/sessions",
      type: "GET",
      success: function(data){
        Backbone.history.start({ root: self.root });
        _.extend(data, {
          signedIn: true
        });
        self.currentUser.set(data);
        self._loadHeader();
        self._loadFooter();
      },
      error: function(resp) {
        Backbone.history.start();
        self.currentUser.set({ signedIn: false });
        self._loadHeader();
        self._loadFooter();
      }
    });
  },

  _loadHeader: function() {
    var headerView = new Deckster.Views.headerView({
      model: this.currentUser
    });

    $("#header").html(headerView.render().$el);
  },

  _loadFooter: function() {
    var footerView = new Deckster.Views.footerView({
      model: this.currentUser
    });

    $("#footer").html(footerView.render().$el);
  }
};

$(document).ready(function() {
	Deckster.initialize();
});