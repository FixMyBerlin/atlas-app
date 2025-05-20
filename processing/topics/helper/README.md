# About

- `helper` are utility functions that extend LUA or help us while processing our data.

# How to use

- One helper per file. (Or at least one topic per file.)

- To use helper, put the code below at the top of your file:

```lua
require('init')
local topic_name = require("file_name")

topic_name.function_name()
```

or

```lua
require('init')
local function_name = require("function_name")

function_name()
```

See more in https://github.com/FixMyBerlin/private-issues/issues/2497
See more in lua.instructions.md
