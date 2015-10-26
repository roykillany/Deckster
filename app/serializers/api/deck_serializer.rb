class Api::DeckSerializer < ActiveModel::Serializer
	self.root = false

	attributes :id, :profile_id, :title, :description, :cards, :avg_cmc, :curve, :color_distribution

	def cards
		ActiveModel::ArraySerializer.new(object.cards, { each_serializer: Api::CardSerializer })
	end

	def avg_cmc
		object.avg_cmc
	end

	def curve
		object.curve
	end

	def color_distribution
		object.color_distribution
	end
end