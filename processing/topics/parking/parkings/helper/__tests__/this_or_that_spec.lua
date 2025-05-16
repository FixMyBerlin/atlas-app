package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parkings/helper/?.lua"
require("busted")
require("this_or_that")

describe("this_or_that", function()
  it("returns this when this.value is present", function()
    local result = this_or_that("foo", { value = "bar", confidence = "high", source = "tag" }, { value = "baz", confidence = "low", source = "other" })
    assert.are.same({ foo = "bar", foo_confidence = "high", foo_source = "tag" }, result)
  end)

  it("returns that when this.value is nil and that.value is present", function()
    local result = this_or_that("foo", { value = nil, confidence = "high", source = "tag" }, { value = "baz", confidence = "low", source = "other" })
    assert.are.same({ foo = "baz", foo_confidence = "low", foo_source = "other" }, result)
  end)

  it("returns nil when neither this.value nor that.value is present", function()
    local result = this_or_that("foo", { value = nil, confidence = "high", source = "tag" }, { value = nil, confidence = "low", source = "other" })
    assert.is_nil(result)
  end)
end)
