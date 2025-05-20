
-- Import as "local is_env = require('ENV')" and use as ENV.is_production.
-- We use a different pattern here to allow us to overwrite the values easily in tests.
local function is_production()
  local env = os.getenv("ENVIRONMENT")
  return env == "production"
end

local ENV = { is_production }
return ENV
