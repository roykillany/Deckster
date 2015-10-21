class JoinCardType < ActiveRecord::Base
	belongs_to :card
	belongs_to :card_type
end