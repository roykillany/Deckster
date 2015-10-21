Rails.application.routes.draw do
	root to: "site#root"

  namespace :api, default: { format: :json } do
    get "curr_user", to: "users#curr_user"
    resources :users
    resources :decks
  end

  resources :sessions, only: [:index, :create]
  delete "sessions", to: "sessions#destroy"
end
