class JoinColor < ActiveRecord::Base
	validates_uniqueness_of :color_id, scope: [:card_id]
	belongs_to :card
	belongs_to :color
end