class Api::UsersController < ApplicationController
	wrap_parameters false

	def curr_user
		ActiveRecord::Associations::Preloader.new.preload(current_user, profile: [decks: [cards: [:colors, :card_types]], collection: [cards: [:colors, :card_types]]])
		render json: Api::UserSerializer.new(current_user)
	end

	def index
		@users = User.includes(profile: [decks: [cards: [:colors, :card_types]]]).all
		render json: ActiveModel::ArraySerializer.new(@users, { each_serializer: Api::UserSerializer })
	end

	def show
		@user = User.includes(profile: [decks: [cards: [:colors, :card_types]]]).find(params[:id])
		render json: Api::UserSerializer.new(@user, { current_user: current_user, root: false })
	end

	def create
		@user = User.includes(profile: [decks: [cards: [:colors, :card_types]]]).new(user_params)
		ActiveRecord::Associations::Preloader.new.preload(@user, profile: [decks: [cards: [:colors, :card_types]], collection: [cards: [:colors, :card_types]]])
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
		begin
			current_user.update(user_params)
			changes = current_user.previous_changes.keys.reject { |k| k == "updated_at" }
			user_params.delete("password")
			current_user.save!
			
			render json: { data: user_params, changes: changes }
		rescue => e
			p "****updateuser****"
			p e.message
			p e.backtrace
			render json: { ok: 0 }, status: 422
		end
	end

	private

	def user_params
		uparams = params.require(:user).permit(:username, :email, :password)
		uparams.delete(:password) if uparams[:password].blank?
		uparams
	end
end