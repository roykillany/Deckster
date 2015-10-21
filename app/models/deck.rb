class Deck < ActiveRecord::Base
	validates :profile_id, :title, presence: true

	has_many :cards, inverse_of: :deck, dependent: :destroy
	belongs_to :profile

	accepts_nested_attributes_for :cards, :allow_destroy => true
	
end