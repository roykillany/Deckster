class Api::DeckSerializer < ActiveModel::Serializer
	self.root = false

	attributes :id, :profile_id, :title, :description, :cards, :avg_cmc, :curve, :color_distribution, :cover_img, :colors

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

	def cover_img
		kc = object.cards.select { |c| c.name == object.key_card }[0]

		unless kc.nil?
			kc.image_url
		else
			"https://s3.amazonaws.com/decksterdev/defaults/200px-Magic_card_back.jpg"
		end
	end

	def colors
		object.deck_colors
	end
end