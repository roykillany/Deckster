class Api::UserSerializer < ActiveModel::Serializer
	self.root = false

	attributes :id, :email, :username, :profile, :collection, :decks

	def profile
		Api::ProfileSerializer.new(object.profile)
	end

	def decks
		ActiveModel::ArraySerializer.new(object.decks, { each_serializer: Api::DeckSerializer })
	end

	def collection
		Api::CollectionSerializer.new(object.collection)
	end
end