class Api::DeckSerializer < ActiveModel::Serializer
	self.root = false

	attributes :id, :profile_id, :title, :cards, :cover_img, :colors

	def cards
		ActiveModel::ArraySerializer.new(object.cards, { each_serializer: Api::CardSerializer })
	end

	def cover_img
		object.temp_cov_img
		# kc = object.cards.select { |c| c.name == object.key_card }[0]

		# unless kc.nil?
		# 	kc.image_url
		# else
		# 	"https://s3.amazonaws.com/decksterdev/defaults/200px-Magic_card_back.jpg"
		# end
	end

	def colors
		object.deck_colors
	end
end