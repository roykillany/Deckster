class SessionsController < ApplicationController
  def index
  	session["init"] = true
    @user = current_user
    if current_user
    	render json: Api::UserSerializer.new(@user)
    else
    	render json: { ok: "0" }, status: 422
    end
  end

  def create
    @user = User.includes(profile: [decks: :cards]).find_by_credentials(user_params[:username], user_params[:password])
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

  private
  def user_params
    params.require(:user).permit(:username, :password)
  end

  def auth_hash
    params
  end
end