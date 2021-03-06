class Profile < ActiveRecord::Base
	validates :user_id, presence: true

	belongs_to :user
	has_many :decks, dependent: :destroy
	has_one :collection, dependent: :destroy
end