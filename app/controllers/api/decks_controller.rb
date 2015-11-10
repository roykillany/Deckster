class Api::DecksController < ApplicationController
	wrap_parameters false

	def create
		card_types = {}
		colors = {}
		params[:deck][:cards_attributes].each do |card|
			card_types["#{card['name']}"] = card[:card_types]
			colors["#{card['name']}"] = card[:colors]
		end

		@deck = Deck.includes(cards: [:colors, :card_types]).create(deck_params)
		ActiveRecord::Associations::Preloader.new.preload(@deck, cards: [:colors, :card_types])

		create_dependencies(card_types, colors, @deck.cards)

		begin
			@deck.save!
			render json: Api::DeckSerializer.new(@deck)
		rescue => e
			p "******decks*******"
			p e.message
			p e.backtrace
			render json: { error: e.message }, status: 422
		end
	end

	def update
		p ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
		p deck_params
		@deck = Deck.includes(cards: [:colors, :card_types]).find(params[:id])
		ActiveRecord::Associations::Preloader.new.preload(@deck, cards: [:colors, :card_types])
		begin
			@deck.update(deck_params)
			@deck.save
			render json: Api::DeckSerializer.new(@deck)
		rescue => e
			p "******update******"
			p e.message
			p e.backtrace
			render json: { err: e.message }, status: 422
		end
	end

	private

	def deck_params
		dparams = params.require(:deck).permit(:profile_id, :title, :description, :key_card,
			cards_attributes: [:id, :deck_id, :image_url, :name, :mana_cost, :cmc, :rarity, :text, :power, :toughness, :quantity])

		if dparams[:cards_attributes].is_a?(Array)
			cparams = dparams[:cards_attributes]
			cparams.map do |param|
				param[:rarity] = param[:rarity].capitalize
				param[:rarity] = param[:rarity] == "Basic" ? "Common" : param[:rarity]
				param[:rarity] = param[:rarity] == "Special" ? "Mythic" : param[:rarity]
				param[:mana_cost] = param[:mana_cost].empty? ? "0" : param[:mana_cost].gsub(/\{|\}/, "")
				p "((((((((((((((((((((((((("
				p param[:rarity]
			end
		end

		dparams
	end

	def create_dependencies(types, colors, cards)
		p types
		p colors
		cards.each do |card|
			types["#{card.name}"].each do |t|
				ct_id = CardType.where({name: t.capitalize}).pluck(:id).first
				jct = JoinCardType.new({card_id: card.id, card_type_id: ct_id})

				begin
					jct.save!
				rescue => e
					p "*****types*****"
					p e.message
					p e.backtrace
				end
			end
			unless colors["#{card.name}"].nil?
				colors["#{card.name}"].each do |c|
					color_id = Color.where({name: c.capitalize}).pluck(:id).first
					jc = JoinColor.new({card_id: card.id, color_id: color_id})

					begin
						jc.save!
					rescue => e
						p "*****colors*****"
						p e.message
						p e.backtrace
					end
				end
			end
		end
	end
end