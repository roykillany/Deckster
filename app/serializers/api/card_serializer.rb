class Api::CardSerializer < ActiveModel::Serializer
	self.root = false

	attributes :id, :deck_id, :name, :cmc, :image_url, :toughness, :text, :mana_cost, :power, :quantity
end