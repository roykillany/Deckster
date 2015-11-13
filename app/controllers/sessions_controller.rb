class SessionsController < ApplicationController
  def index
  	# session["init"] = true
    @user = current_user
    if current_user
      ActiveRecord::Associations::Preloader.new.preload(@user, profile: [decks: [cards: [:colors, :card_types]]], collection: [cards: [:colors, :card_types]])
    	render json: Api::UserSerializer.new(@user)
    else
    	render json: { ok: "0" }, status: 422
    end
  end

  def create
    @user = User.find_by_credentials(user_params[:username], user_params[:password])
    ActiveRecord::Associations::Preloader.new.preload(@user, profile: [decks: [cards: [:colors, :card_types]]], collection: [cards: [:colors, :card_types]])
    if @user
      log_in(@user)
      render json: Api::UserSerializer.new(@user)
    else
      if User.exists?({username: user_params[:username]})
        render json: { err: { pw: "That password is incorrect" } }, status: 422
      else  
        render json: { err: { name: "That username doesn't exist" } }, status: 422
      end
    end
  end

  def destroy
    current_user.reset_session_token!
    session[:token] = nil
    render json: { ok: "1" }
  end

  def omniauth
    user = User.find_or_create_by_auth_hash(auth_hash)
    p "WAKKAFLOCKA"
    p user
    begin
      log_in(user)
      render json: Api::UserSerializer.new(user)
    rescue => e
      p "****fb-auth****"
      p e.message
      p e.backtrace
    end
  end

  def guest_login
    @guest = User.includes(profile: [decks: [cards: [:colors, :card_types]]]).find_by({username: "Guest", id: 1})
    ActiveRecord::Associations::Preloader.new.preload(@guest, profile: [decks: [cards: [:colors, :card_types]]], collection: [cards: [:colors, :card_types]])
    begin
      log_in(@guest)
      render json: Api::UserSerializer.new(@guest)
    rescue => e
      p "****guest-login****"
      p e.message
      p e.backtrace
    end
  end

  def confirm_password
    resp = current_user.is_password?(params[:password])
    render json: { resp: resp }
  end

  private
  def user_params
    params.require(:user).permit(:username, :password)
  end

  def auth_hash
    params
  end
end