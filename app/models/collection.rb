class Collection < ActiveRecord::Base
	belongs_to :profile
	has_many :cards, inverse_of: :collection, dependent: :destroy

	accepts_nested_attributes_for :cards, allow_destroy: true
end