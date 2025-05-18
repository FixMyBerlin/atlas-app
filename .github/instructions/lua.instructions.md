---
applyTo: '**/*.lua'
---

- This is LUA embedded into osm2pgsql.
  - That means we have access to a few helpers from https://osm2pgsql.org/doc/manual.html#lua-library-for-flex-output.
  - There is also the special `osm2pgsql` class that we use all over which is documented at https://osm2pgsql.org/doc/manual.html.
- We have helper libraries installed which can be found in [processing.Dockerfile](../processing.Dockerfile)
  - Use those rather than create helper functions from scratch.
  - `busted` is our testing framework https://lunarmodules.github.io/busted/
  - `inspect` is to print / inspect tables https://github.com/kikito/inspect.lua — our own helper around that is called `Log(object, 'logging prefix')`
  - `penlight` is to add python like helpers to lua https://lunarmodules.github.io/Penlight/
  - We can add more helpers if this makes our code cleaner; make a suggestion if that applies.
- We use camel_case for our file names and functions and variables.
  - However, there are legacy functions that are still using MixedCase. Don't change this during an unrelated edit.
  - Our linter does not accept lower case global functions but we ignore that because we cannot configure the linter properly.
- Each file has to start with a `package.path` which lists the path where all helpers live that are used in this file.
  `package.path = package.path .. ";/processing/topics/helper/?.lua"`
- To require a function, we just `require("function_name")` the file and then use `function_name`. We _do not_ assign local variables like `local function_name = require("function_name")` except we have to like with the `is_env.is_production` case.
- Preserve code comments that are still relevant.

Software tests:
- Are always in a `__tests__` folder in the same directory or one directory up.
- They need to have a name like `file_name_of_functions.test.lua`. So the same name as the file that is being tested postfixed with ".test".
- They use busted internally but that is automatically loaded and does not need to be required.
- Use `require("foo")` to load the function that is being tested.

Formatting:
- Use 2 spaces for indentation.
