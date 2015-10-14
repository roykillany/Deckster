class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session

  helper_method :current_user

  def current_user
  	return nil if session[:token].nil?
  	@current_user ||= User.find_by(session_token: session[:token])
  end

  def log_in(user)
  	session[:token] = user.reset_session_token
  end

  def log_out
  	current_user.reset_session_token!
  	session[:token] = nil
  end
end