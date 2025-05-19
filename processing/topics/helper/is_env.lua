-- Import as "local is_env = require('is_env')" and use as is_env.is_production.
-- We use a different pattern here to allow us to overwrite the values easily in tests.
local function is_production()
  local env = os.getenv("ENVIRONMENT")
  return env == "production"
end

return { is_production }
