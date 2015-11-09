class Api::UsersController < ApplicationController
	wrap_parameters false

	def curr_user
		render json: Api::UserSerializer.new(current_user)
	end

	def index
		@users = User.all
		render json: ActiveModel::ArraySerializer.new(@users, { each_serializer: Api::UserSerializer })
	end

	def show
		@user = User.find(params[:id])
		render json: Api::UserSerializer.new(@user, { current_user: current_user, root: false })
	end

	def create
		@user = User.new(user_params)
		if @user.save
			@user.create_profile
			@user.create_collection
			log_in(@user)
			render json: Api::UserSerializer.new(@user)
		else
			render json: @user.errors.full_messages, status: 422
		end
	end

	def guest_create
	end

	def destroy
		@user = User.find(params[:id])
		@user.destroy!
		log_out!
	end

	def update
		@user = User.find(params[:id])
		@user.update!(user_params)
		if @user.save
			render json: { ok: 1 }
		else
			render json: { ok: 0 }, status: 422
		end
	end

	private

	def user_params
		params.require(:user).permit(:username, :email, :password)
	end
end