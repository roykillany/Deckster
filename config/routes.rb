Rails.application.routes.draw do
  namespace :api, default: { format: :json } do
    resources :users
  end
end
