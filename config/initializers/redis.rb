uri = URI.parse(URI.encode(ENV["REDISTOGO_URL"]))
REDIS = Redis.new(url: uri)