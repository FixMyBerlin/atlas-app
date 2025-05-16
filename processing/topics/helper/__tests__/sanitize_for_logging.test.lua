package.path = package.path .. ";/processing/topics/helper/?.lua"
require("sanitize_for_logging")
local is_env = require("is_env")


describe("sanitize_for_logging on staging, development", function()
  -- Overwrite what is used in sanitize_for_logging
  is_env.is_production =  false

  it("returns value if allowed", function()
    local value = sanitize_for_logging("value_foo", {"value_foo"})
    assert.are.equal(value, "value_foo")
  end)

  it("return nil if value nil", function()
    local value = sanitize_for_logging(nil, {"value_foo"})
    assert.are.equal(value, nil)
  end)

  it("return DISALLOWED_VALUE if value not allowed", function()
    local value = sanitize_for_logging("value_not_allowed", {"value_foo"})
    assert.are.equal(value, "DISALLOWED_VALUE")
  end)
end)


describe("sanitize_for_logging on production", function()
  -- Overwrite what is used in sanitize_for_logging
  is_env.is_production =  true

  it("returns value if allowed", function()
    local value = sanitize_for_logging("value_foo", {"value_foo"})
    assert.are.equal(value, "value_foo")
  end)

  it("return nil if value nil", function()
    local value = sanitize_for_logging(nil, {"value_foo"})
    assert.are.equal(value, nil)
  end)

  it("return nil if value not allowed", function()
    local value = sanitize_for_logging("value_not_allowed", {"value_foo"})
    assert.are.equal(value, nil)
  end)
end)
