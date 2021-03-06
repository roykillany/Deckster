class Deck < ActiveRecord::Base
	validates :profile_id, :title, presence: true
	has_attached_file :cover_image, 
		styles: { medium: "300x300>", thumb: "100x100>", tiny: "40x40" }, 
		storage: :s3, bucket: ENV["S3_BUCKET"],
		default_url: "http://images.magicmadhouse.co.uk/images/products/1334152454-17580300.jpg"
	validates_attachment_content_type :cover_image, content_type: /\Aimage\/.*\z/

	has_many :cards, inverse_of: :deck, dependent: :destroy do 
		def nonland_cards
			self.select { |card| !card.card_types.exists?({name: "Land"}) }
		end
		def nonland_cards_count
			self.nonland_cards.inject(0) { |sum, c| sum + c.quantity }
		end
		def cards_count
			self.inject(0) { |sum, c| sum + c.quantity }
		end
	end
	has_many :colors, through: :cards
	belongs_to :profile

	after_save :create_cover_image

	accepts_nested_attributes_for :cards, :allow_destroy => true

	COLORS = ["White", "Blue", "Black", "Red", "Green"]

	def avg_cmc
		nlc = self.cards.nonland_cards

		return 0 if nlc.count == 0
		(nlc.inject(0) { |sum, c| sum + c.cmc * c.quantity } / nlc.count.to_f).round(2)
	end

	def curve
		curve = Hash.new(0)
		self.cards.nonland_cards.each { |c| curve[c.cmc] += c.quantity }

		curve
	end

	def color_distribution
		color_dist = Hash.new(0)
		cards = self.cards.nonland_cards

		cards.each do |card|
			unless card.color_identity.empty?
				card.color_identity.each do |ci|
					color_dist[ci] += card.quantity
				end
			end
		end

		color_dist
	end

	def land_distribution
		total_count = self.cards.cards_count
		nonland = self.cards.nonland_cards_count
		land = total_count - nonland
		{Land: land, Nonland: nonland}
	end

	def deck_colors
		self.colors.uniq
	end

	def create_cover_image
		return unless self.temp_cov_img.nil?
		kc = self.cards.select { |c| c.name == self.key_card }[0]

		unless kc.nil?
			cover_image = kc.image_url
		else
			cover_image = "https://s3.amazonaws.com/decksterdev/defaults/200px-Magic_card_back.jpg"
		end

		self.update!({temp_cov_img: cover_image})
	end
end