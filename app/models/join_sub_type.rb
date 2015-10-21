class JoinSubType < ActiveRecord::Base
	belongs_to :sub_type
	belongs_to :card
end