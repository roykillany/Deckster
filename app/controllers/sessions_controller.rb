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
    @user = User.includes(:profile).find_by_credentials(user_params[:username], user_params[:password])
    if @user
      log_in(@user)
      render json: Api::UserSerializer.new(@user)
    else
      @user = User.new(user_params)
      render json: { ok: "0" } , status: 422
    end
  end

  def destroy
    current_user.reset_session_token!
    session[:token] = nil
    render json: { ok: "1" }
  end

  private
  def user_params
    params.require(:user).permit(:username, :password)
  end
end