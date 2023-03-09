# About

- `shared` holds helper functions and objects that work on/with our data.
- Utility functions that extend LUA into `helper`.

# How to use

- One helper per file. (Or at least one topic per file.)

- To use helper, put the code below at the top of your file:

```lua
package.path = package.path .. ";/app/process/shared/?.lua"
require("FileName")
```
