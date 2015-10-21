class Api::UserSerializer < ActiveModel::Serializer
	self.root = false

	attributes :id, :username, :profile, :decks

	def profile
		Api::ProfileSerializer.new(object.profile)
	end

	def decks
		ActiveModel::ArraySerializer.new(object.decks, { each_serializer: Api::DeckSerializer })
	end
end