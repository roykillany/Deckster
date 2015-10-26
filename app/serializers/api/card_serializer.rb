class Api::CardSerializer < ActiveModel::Serializer
	self.root = false

	attributes :id, :deck_id, :name, :cmc, :image_url, :toughness, :text, :mana_cost, :power, :quantity,
		:colors, :card_types

	def colors
		object.colors.pluck(:name)
	end

	def card_types
		object.card_types.pluck(:name)
	end
end