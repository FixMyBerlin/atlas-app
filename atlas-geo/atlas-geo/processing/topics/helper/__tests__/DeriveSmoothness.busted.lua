describe("DeriveSmoothness", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  require('DeriveSmoothness')

  describe('=== Test DeriveSmoothness ===', function()
    it('should return nil for surface "nil"', function()
      local result = DeriveSmoothness({})
      assert.are.same(result,
        { smoothness = nil, smoothness_source = nil, smoothness_confidence = nil }
      )
    end)

    it('should return nil for surface "unknown_typo"', function()
      local result = DeriveSmoothness({ surface = "unknown_typo" })
      assert.are.same(result,
        { smoothness = nil, smoothness_source = nil, smoothness_confidence = nil }
      )
    end)

    it('should return "bad" for surface "dirt"', function()
      local result = DeriveSmoothness({ surface = "dirt" })
      assert.are.same(result,
        { smoothness = "bad", smoothness_source = "surface_to_smoothness", smoothness_confidence = "medium" }
      )
    end)

    it('should return "bad" for weird surface', function()
      local result = DeriveSmoothness({ surface = "sett;paving_stones;cobblestone:flattened" })
      assert.are.same(result,
        { smoothness = "bad", smoothness_source = "surface_to_smoothness", smoothness_confidence = "medium" }
      )
    end)

    it('should respect smoothness precedence', function()
      local result = DeriveSmoothness({ smoothness = "good", surface = "sett;paving_stones;cobblestone:flattened" })
      assert.are.same(result,
        { smoothness = "good", smoothness_source = "tag", smoothness_confidence = "high" }
      )
    end)

    it('should respect MTB scale', function()
      local result = DeriveSmoothness({ smoothness = "wierd smoothness", ["mtb:scale"] = "0+" })
      assert.are.same(result,
        { smoothness = "bad", smoothness_source = "tracktype_to_smoothness", smoothness_confidence = "medium" }
      )
    end)
  end)
end)
