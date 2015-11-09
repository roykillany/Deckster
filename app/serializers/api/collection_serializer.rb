class Api::CollectionSerializer < ActiveModel::Serializer
	self.root = false

	attributes :id, :cards

	def cards
		ActiveModel::ArraySerializer.new(object.cards, { each_serializer: Api::CardSerializer })
	end
end