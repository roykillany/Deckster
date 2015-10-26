class Api::DecksController < ApplicationController
	wrap_parameters false

	def create
		card_types = {}
		colors = {}
		params[:deck][:cards_attributes].each do |card|
			card_types["#{card['name']}"] = card[:card_types]
			colors["#{card['name']}"] = card[:colors]
		end

		@deck = Deck.includes(:cards).create(deck_params)

		create_dependencies(card_types, colors, @deck.cards)

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
				p "|||||||||||||||||||"
				p param
				param[:rarity] = param[:rarity].capitalize
				param[:rarity] = param[:rarity] == "Basic" ? "Common" : param[:rarity]
				param[:mana_cost] = param[:mana_cost].empty? ? "0" : param[:mana_cost].gsub(/\{|\}/, "")
			end
		end

		dparams
	end

	def create_dependencies(types, colors, cards)
		cards.each do |card|
			types["#{card.name}"].each do |t|
				ct_id = CardType.where({name: t.capitalize}).pluck(:id).first
				jct = JoinCardType.new({card_id: card.id, card_type_id: ct_id})

				begin
					jct.save!
				rescue => e
					p "***********"
					p e.message
					p e.backtrace
				end
			end
			colors["#{card.name}"].each do |c|
				color_id = Color.where({name: c.capitalize}).pluck(:id).first
				jc = JoinColor.new({card_id: card.id, color_id: color_id})

				begin
					jc.save!
				rescue => e
					p "***********"
					p e.message
					p e.backtrace
				end
			end
		end
	end
end