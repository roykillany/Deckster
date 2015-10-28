class Deck < ActiveRecord::Base
	validates :profile_id, :title, presence: true
	has_attached_file :cover_image, styles: { medium: "300x300>", thumb: "100x100>", tiny: "40x40>" }, default_url: "http://images.magicmadhouse.co.uk/images/products/1334152454-17580300.jpg"
	validates_attachment_content_type :cover_image, content_type: /\Aimage\/.*\z/

	has_many :cards, inverse_of: :deck, dependent: :destroy
	belongs_to :profile

	accepts_nested_attributes_for :cards, :allow_destroy => true

	COLORS = ["White", "Blue", "Black", "Red", "Green"]
	
	def nonland_cards
		Card.includes(:colors, :card_types).joins(join_card_types: :card_type).where("cards.deck_id = ? AND card_types.name IS NOT ?", self.id, "Land").distinct
	end

	def avg_cmc
		nlc = self.nonland_cards

		return 0 if nlc.count == 0
		(nlc.inject(0) { |sum, c| sum + c.cmc } / nlc.count.to_f).round(2)
	end

	def curve
		curve = Hash.new(0)
		self.nonland_cards.each { |c| curve[c.cmc] += c.quantity }

		curve
	end

	def color_distribution
		color_dist = Hash.new(0)
		cards = self.cards

		cards.each do |card|
			unless card.color_identity.empty?
				card.color_identity.each do |ci|
					color_dist[ci] += card.quantity
				end
			end
		end

		color_dist
	end
end