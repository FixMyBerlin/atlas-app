describe("CopyTags", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  require("CopyTags")

  local src = { ["tag1"] = "tag1", ["tag2"] = "tag2", ["tag3"] = "tag3" }
  local tags = { "tag1" }

  it('copy tags to an empty destination', function()
    local result = CopyTags({}, src, tags)
    assert.are.same(result, { ["tag1"] = "tag1" })
  end)

  it('copy tags to a given destination', function()
    local result = CopyTags({ ["dst"] = "dst" }, src, tags)
    assert.are.same(result, { ["dst"] = "dst", ["tag1"] = "tag1" })
  end)

  it('copy tags with a prefix', function()
    local result = CopyTags({ ["dst"] = "dst" }, src, tags, 'PRE_')
    assert.are.same(result, { ["dst"] = "dst", ["PRE_tag1"] = "tag1" })
  end)

  it('not copy any tags if the tags list is empty', function()
    local result = CopyTags({ ["dst"] = "dst" }, src, {}, 'PRE_')
    assert.are.same(result, { ["dst"] = "dst" })
  end)
end)
