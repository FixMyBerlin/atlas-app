local inspect = require('inspect')

function Log(input, prefix)
  prefix = prefix or ""
  print("\nxxx" .. prefix .. inspect(input))
end
