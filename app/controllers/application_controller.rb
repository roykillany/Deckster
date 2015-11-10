class ApplicationController < ActionController::Base
  # protect_from_forgery with: :null_session

  helper_method :current_user

  def current_user
  	return nil if session[:token].nil?
  	@current_user ||= User.includes(profile: [decks: [cards: [:colors, :card_types]]]).find_by(session_token: session[:token])
    # @current_user ||= User.find_by_sql(["SELECT DISTINCT u.* FROM users AS u INNER JOIN profiles AS p ON p.user_id = u.id INNER JOIN decks AS d ON d.profile_id = p.id INNER JOIN cards AS c ON c.deck_id = d.id INNER JOIN join_colors AS jc ON jc.card_id = c.id INNER JOIN join_card_types AS jct ON jct.card_id = c.id INNER JOIN colors ON colors.id = jc.color_id INNER JOIN card_types AS ct ON ct.id = jct.card_type_id WHERE u.session_token = ?", session[:token]])
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