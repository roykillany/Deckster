class Api::CollectionsController < ApplicationController
	wrap_parameters false

	def create
		card_types = {}
		colors = {}
		params[:collection][:cards_attributes].each do |card|
			card_types["#{card['name']}"] = card[:card_types]
			colors["#{card['name']}"] = card[:colors]
		end

		@collection = Collection.includes(cards: [:colors, :card_types]).create(collection_params)

		create_dependencies(card_types, colors, @collection.cards)

		begin
			@collection.save!
			render json: Api::CollectionSerializer.new(@collection)
		rescue => e
			p "******collections*******"
			p e.message
			p e.backtrace
			render json: { error: e.message }, status: 422
		end
	end

	def update
		p ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
		p collection_params
		@collection = Collection.includes(cards: [:colors, :card_types]).find(params[:id])
		begin
			@collection.update(collection_params)
			@collection.save
			render json: Api::DeckSerializer.new(@collection)
		rescue => e
			p "******update******"
			p e.message
			p e.backtrace
			render json: { err: e.message }, status: 422
		end
	end

	private

	def collection_params
		cparams = params.require(:collection).permit(:profile_id,
			cards_attributes: [:id, :collection_id, :image_url, :name, :mana_cost, :cmc, :rarity, :text, :power, :toughness, :quantity])

		if cparams[:cards_attributes].is_a?(Array)
			card_params = cparams[:cards_attributes]
			card_params.map do |param|
				param[:rarity] = param[:rarity].capitalize
				param[:rarity] = param[:rarity] == "Basic" ? "Common" : param[:rarity]
				param[:rarity] = param[:rarity] == "Special" ? "Mythic" : param[:rarity]
				param[:mana_cost] = param[:mana_cost].empty? ? "0" : param[:mana_cost].gsub(/\{|\}/, "")
				p "((((((((((((((((((((((((("
				p param[:rarity]
			end
		end

		cparams
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