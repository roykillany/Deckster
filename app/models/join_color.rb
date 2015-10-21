class JoinColor < ActiveRecord::Base
	belongs_to :card
	belongs_to :color
end