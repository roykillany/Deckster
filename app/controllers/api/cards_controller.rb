class Api::CardsController < ApplicationController
	wrap_parameters false

	def create
		@card = Card.includes(:colors, :card_types).new(card_params)

		begin
			@card.save!
			create_dependencies(params[:card][:card_types], params[:card][:colors], @card)
			render json: Api::CollectionCardSerializer.new(@card)
		rescue => e
			render json: { err: e.message }, status: 422
		end
	end

	private

	def card_params
		cparams = params.require(:card).permit(:collection_id, :image_url, :name, :mana_cost, :cmc, :rarity, :text, :power, :toughness, :quantity)

		cparams[:rarity] = cparams[:rarity].capitalize
		cparams[:rarity] = cparams[:rarity] == "Basic" ? "Common" : cparams[:rarity]
		cparams[:rarity] = cparams[:rarity] == "Special" ? "Mythic" : cparams[:rarity]
		cparams[:mana_cost] = cparams[:mana_cost].empty? ? "0" : cparams[:mana_cost].gsub(/\{|\}/, "")
		cparams[:collection_id] = params[:collection_id]

		cparams
	end

	def create_dependencies(types, colors, cards)
		types.each do |t|
			ct_id = CardType.where({name: t.capitalize}).pluck(:id).first
			jct = JoinCardType.new({card_id: cards.id, card_type_id: ct_id})

			begin
				jct.save!
			rescue => e
				p "*****types*****"
				p e.message
				p e.backtrace
			end
		end
		unless colors.nil?
			colors.each do |c|
				color_id = Color.where({name: c.capitalize}).pluck(:id).first
				jc = JoinColor.new({card_id: cards.id, color_id: color_id})

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