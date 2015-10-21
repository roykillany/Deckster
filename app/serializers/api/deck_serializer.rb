class Api::DeckSerializer < ActiveModel::Serializer
	self.root = false

	attributes :id, :profile_id, :title, :description, :cards

	def cards
		ActiveModel::ArraySerializer.new(object.cards, { each_serializer: Api::CardSerializer })
	end
end