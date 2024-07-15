# About

- `helper` are utility functions that extend LUA or help us while processing our data.

# How to use

- One helper per file. (Or at least one topic per file.)

- To use helper, put the code below at the top of your file:

```lua
package.path = package.path .. ";/processing/topics/helper/?.lua"
require("FileName")
```

`require` works very differently to what I was expecting. More at https://www.lua.org/pil/8.1.html.

The only solution seems to be to add the absolute path of the `/helper`-Folder to the require path and then rely on the auto lookup. However, this means

- we need to add this path to ALL files that use our helper function :-/.
- it only works well for this docker setup.
