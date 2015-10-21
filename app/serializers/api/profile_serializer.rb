class Api::ProfileSerializer < ActiveModel::Serializer
	self.root = false

	attributes :id, :user_id, :bio
end