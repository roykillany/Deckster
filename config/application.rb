require File.expand_path('../boot', __FILE__)

require 'rails/all'

Bundler.require(*Rails.groups)

module Deckster
  class Application < Rails::Application
    config.active_record.raise_in_transactional_callbacks = true

    config.paperclip_defaults = {
    	storage: :s3,
    	s3_credentials: {
    		bucket: ENV["S3_BUCKET"],
    		access_key_id: ENV["S3_ACCESS_KEY_ID"],
    		secret_access_key: ENV["S3_SECRET_ACCESS_KEY"]
    	}
    }
  end
end
