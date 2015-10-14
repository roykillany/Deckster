class Api::UserSerializer < ActiveModel::Serializer
	self.root = false

	attributes :id, :username
end