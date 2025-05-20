describe("DeriveSmoothness", function()
  require('init')
  require("DeriveSmoothness")

  it('normalize "good" to "good"', function()
    local result = DeriveSmoothness({ smoothness = "good" })
    assert.are.same(result,
      { smoothness = "good", smoothness_source = "tag", smoothness_confidence = "high" }
    )
  end)

  it('normalize "very_good" to "excellent"', function()
    local result = DeriveSmoothness({ smoothness = "very_good" })
    assert.are.same(result,
      { smoothness = "excellent", smoothness_source = "tag_normalized", smoothness_confidence = "high" }
    )
  end)

  it('return nil for nil input', function()
    local result = DeriveSmoothness({})
    assert.are.same(result,
      { smoothness = nil, smoothness_source = nil, smoothness_confidence = nil }
    )
  end)

  it('return nil for typos', function()
    local result = DeriveSmoothness({ smoothness = "typo" })
    assert.are.same(result,
      { smoothness = nil, smoothness_source = nil, smoothness_confidence = nil }
    )
  end)
end)
