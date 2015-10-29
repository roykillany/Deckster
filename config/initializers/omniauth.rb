Rails.application.config.middleware.use OmniAuth::Builder do
	provider :facebook, ENV["facebook_key"], ENV["facebook_secret"], secure_image_url: true
end