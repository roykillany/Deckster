class Card < ActiveRecord::Base
	validates :name, :mana_cost, :cmc, :rarity, presence: true
	validates_inclusion_of :rarity, :in => ["Mythic", "Rare", "Uncommon", "Common"]
	validates_presence_of :deck

	belongs_to :deck, inverse_of: :cards
	has_many :join_card_types, dependent: :destroy
	has_many :card_types, through: :join_card_types
	has_many :join_colors, dependent: :destroy
	has_many :colors, through: :join_colors
	has_many :join_sub_types, dependent: :destroy
	has_many :sub_types, through: :join_sub_types
	has_many :join_super_types, dependent: :destroy
	has_many :super_types, through: :join_super_types

	before_create :create_join_card_types

	accepts_nested_attributes_for :join_card_types, :allow_destroy => true
	accepts_nested_attributes_for :join_colors, :allow_destroy => true
	accepts_nested_attributes_for :join_sub_types, :allow_destroy => true
	accepts_nested_attributes_for :join_super_types, :allow_destroy => true

	def create_join_card_types
		p "____________________________"
		p self
		p ">>>>>>>>>>>>>>>>>>>>>>>>>>>>"
	end
end