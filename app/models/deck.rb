class Deck < ActiveRecord::Base
	validates :profile_id, :title, presence: true

	has_many :cards, inverse_of: :deck, dependent: :destroy
	belongs_to :profile

	accepts_nested_attributes_for :cards, :allow_destroy => true
	
	def nonland_cards
		Card.includes(:colors, :card_types).joins(join_card_types: :card_type).where("cards.deck_id = ? AND card_types.name IS NOT ?", self.id, "Land").distinct
	end

	def avg_cmc
		nlc = self.nonland_cards

		(nlc.inject(0) { |sum, c| sum + c.cmc } / nlc.count.to_f).round(2)
	end

	def curve
		curve = Hash.new(0)
		self.nonland_cards.each { |c| curve[c.cmc] += c.quantity }

		curve
	end

	def color_distribution
		
	end
end