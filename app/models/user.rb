class User < ActiveRecord::Base
	validates :username, :session_token, :password_digest, :email, presence: true
	validates :password, length: { minimum: 6, allow_nil: true }
	validates :username, :email, uniqueness: true
	has_attached_file :avatar, 
		styles: { medium: "300x300>", thumb: "100x100>", tiny: "40x40" }, 
		storage: :s3, default_url: "http://www.genengnews.com/app_themes/genconnect/images/default_profile.jpg"
	validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\z/

	has_one :profile, dependent: :destroy
	has_many :decks, through: :profile

	attr_reader :password

	after_initialize :ensure_session_token

	def self.find_by_credentials(username, password)
		user = User.find_by_username(username)
		return nil unless user && user.is_password?(password)
		user
	end

	def ensure_session_token
		self.session_token ||= User.generate_session_token
	end

	def reset_session_token
		self.session_token = User.generate_session_token
		self.save!
		self.session_token
	end

	def self.generate_session_token
		SecureRandom.urlsafe_base64
	end

	def password=(password)
		@password = password
		self.password_digest = BCrypt::Password.create(password)
	end

	def is_password?(password)
		BCrypt::Password.new(self.password_digest).is_password?(password)
	end

	def create_profile
		user_id = self.id

		profile = Profile.new({user_id: user_id})
		profile.save!
	end
end