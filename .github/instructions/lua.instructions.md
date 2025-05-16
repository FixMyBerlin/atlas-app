---
applyTo: '**/*.lua'
---

- This is LUA embedded into osm2pgsql.
  - That means we have access to a few helpers from https://osm2pgsql.org/doc/manual.html#lua-library-for-flex-output.
  - There is also the special `osm2pgsql` class that we use all over which is documented at https://osm2pgsql.org/doc/manual.html.
- We have helper libraries installed which can be found in [processing.Dockerfile](../processing.Dockerfile)
  - Right now that should only be busted (https://lunarmodules.github.io/busted/) and inspect (https://github.com/kikito/inspect.lua).
  - We can add more helpers if this makes our code cleaner.
- We use camel_case for our file names and functions and variables.
  - However, there are legacy functions that are still using MixedCase. Don't change this during an unrelated edit.
  - Our linter does not accept lower case global functions but we ignore that because we cannot configure the linter properly.
- Each file has to start with a `package.path` which lists the path where all helpers live that are used in this file.
  `package.path = package.path .. ";/processing/topics/helper/?.lua"`
- To require a function, we just `require("function_name")` the file and then use `function_name`. We _do not_ assign local variables like `local function_name = require("function_name")` except we have to like with the `is_env.is_production` case.
