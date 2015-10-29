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

	def self.find_or_create_by_auth_hash(auth_hash)
		p auth_hash
    user = User.includes(profile: [decks: :cards]).find_by(
    	uid: auth_hash[:id]
    )

    if user.nil?
      begin
	      user = User.create!(
	        username: "#{auth_hash[:first_name]} #{auth_hash[:last_name]}",
	        email: auth_hash[:email],
	        password: SecureRandom::urlsafe_base64,
	        provider: auth_hash[:provider],
	        uid: auth_hash[:id]
	      )
	      user.create_profile
	    rescue => e
	    	p "****find_or_create_by_auth_hash****"
	    	p e.message
	    	p e.backtrace
	    end
    end

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