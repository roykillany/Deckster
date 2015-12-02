Rails.application.routes.draw do
	root to: "site#root"

  namespace :api, default: { format: :json } do
    get "curr_user", to: "users#curr_user"
    get "user_decks/:id", to: "decks#user_decks"
    get "chart_info/:id", to: "decks#chart_info"
    resources :users
    resources :decks
    resources :collections
    resources :cards
  end

  resources :sessions, only: [:index, :create]
  delete "sessions", to: "sessions#destroy"
  post "fb_auth", to: "sessions#omniauth"
  get "guest", to: "sessions#guest_login"
  get "confirm_password", to: "sessions#confirm_password"
end
