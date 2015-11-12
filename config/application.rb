require File.expand_path('../boot', __FILE__)

require 'rails/all'

Bundler.require(*Rails.groups)

module Deckster
  class Application < Rails::Application
    config.active_record.raise_in_transactional_callbacks = true

    config.paperclip_defaults = {
    	storage: :s3,
      endpoint: ENV['ENDPOINT'],
    	s3_credentials: {
    		bucket: ENV["S3_BUCKET"],
    		access_key_id: ENV["S3_ACCESS_KEY_ID"],
    		secret_access_key: ENV["S3_SECRET_ACCESS_KEY"]
    	}
    }

    if ENV["REDISTOGO_URL"]
      config = Deckster::Application.config
      uri = URI.parse(URI.encode(ENV["REDISTOGO_URL"]))

      config.cache_store = [
        :redis_store, {
          :host => uri.host,
          :port => uri.port,
          :password => uri.password,
          :namespace => "cache"
        }
      ]
    end
  end
end
