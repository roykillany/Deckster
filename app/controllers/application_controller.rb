class ApplicationController < ActionController::Base
  # protect_from_forgery with: :null_session

  helper_method :current_user

  def current_user
  	return nil if session[:token].nil?
  	@current_user ||= User.includes(profile: [decks: [cards: [:colors, :card_types]]]).find_by(session_token: session[:token])
  end

  def log_in(user)
    p "______________________________"
    p session
  	session[:token] = user.reset_session_token
  end

  def log_out
  	current_user.reset_session_token!
  	session[:token] = nil
  end
end