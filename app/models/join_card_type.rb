class JoinCardType < ActiveRecord::Base
	belongs_to :card, inverse_of: :join_card_type
	belongs_to :card_type
end