class Api::DecksController < ApplicationController
	wrap_parameters false

	def create
		@deck = Deck.create(deck_params)

		begin
			@deck.save!
			render json: Api::DeckSerializer.new(@deck)
		rescue => e
			p "*************"
			p e.message
			p e.backtrace
			render json: { error: e.message }, status: 422
		end
	end

	private

	def deck_params
		dparams = params.require(:deck).permit(:profile_id, :title, :description,
			cards_attributes: [:image_url, :name, :mana_cost, :cmc, :rarity, :text, :power, :toughness, :quantity])

		if dparams[:cards_attributes].is_a?(Array)
			cparams = dparams[:cards_attributes]
			cparams.map do |param|
				param[:rarity] = param[:rarity].capitalize
				param[:rarity] = param[:rarity] == "Basic" ? "Common" : param[:rarity]
				param[:mana_cost] = param[:mana_cost].empty? ? "0" : param[:mana_cost].gsub(/\{|\}/, "")
			end
		end

		dparams
	end
end