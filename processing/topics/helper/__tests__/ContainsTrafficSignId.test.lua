describe("ContainsTrafficSignId", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  require("ContainsTrafficSignId")

  it('works for `DE:*`', function()
    local result = ContainsTrafficSignId("DE:123,1010-20;444", "123")
    assert.are.same(result, true)
  end)

  it('works for `;*`', function()
    local result = ContainsTrafficSignId("DE:123,1010-20;444", "444")
    assert.are.same(result, true)
  end)

  it('works for `,*`', function()
    local result = ContainsTrafficSignId("DE:123,1010-20;444", "1010-20")
    assert.are.same(result, true)
  end)
end)
