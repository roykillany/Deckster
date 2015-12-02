class Api::DeckChartSerializer < ActiveModel::Serializer
	self.root = false

	attributes :profile_id, :avg_cmc, :curve, :color_distribution, :colors, :land_distribution

	def avg_cmc
		object.avg_cmc
	end

	def curve
		object.curve
	end

	def color_distribution
		object.color_distribution
	end

	def colors
		object.deck_colors
	end

	def land_distribution
		object.land_distribution
	end
end