class Api::CardSerializer < ActiveModel::Serializer
	self.root = false

	attributes :id, :deck_id, :name, :cmc, :image_url, :mana_cost, :quantity,
		:colors, :card_types

	def image_url
		object.image.url
	end

	def colors
		object.colors.pluck(:name)
	end

	def card_types
		object.card_types.pluck(:name)
	end
end