require "open-uri"

class Card < ActiveRecord::Base
	validates :name, :mana_cost, :cmc, :rarity, presence: true
	validates_inclusion_of :rarity, :in => ["Mythic", "Rare", "Uncommon", "Common"]
	validates_presence_of :deck, allow_blank: true
	validates_presence_of :collection, allow_blank: true
	has_attached_file :image, storage: :s3, bucket: ENV["S3_BUCKET"] #, styles: { medium: "300x300>", thumb: "100x100>", tiny: "40x40" }
	validates_attachment_content_type :image, content_type: /^image\/(jpeg|png|gif|tiff)$/

	before_create :image_from_url

	belongs_to :collection, inverse_of: :cards
	belongs_to :deck, inverse_of: :cards
	has_many :join_card_types, dependent: :destroy
	has_many :card_types, through: :join_card_types
	has_many :join_colors, dependent: :destroy
	has_many :colors, through: :join_colors
	has_many :join_sub_types, dependent: :destroy
	has_many :sub_types, through: :join_sub_types
	has_many :join_super_types, dependent: :destroy
	has_many :super_types, through: :join_super_types

	accepts_nested_attributes_for :join_card_types, :allow_destroy => true
	accepts_nested_attributes_for :join_colors, :allow_destroy => true
	accepts_nested_attributes_for :join_sub_types, :allow_destroy => true
	accepts_nested_attributes_for :join_super_types, :allow_destroy => true

	def color_identity
		self.colors.pluck(:name)
	end

	def image_from_url
		self.image = URI.escape(self.image_url)
	end
end