# Extension Store

https://luarocks.org/

# `starts_with`

https://github.com/openstreetmap/osm2pgsql/blob/master/flex-config/places.lua#L10-L12

```lua
local function starts_with(str, start)
   return str:sub(1, #start) == start
end
```

# Extract osm username and such

https://github.com/openstreetmap/osm2pgsql/blob/master/flex-config/attributes.lua

# Delete key array concept

https://github.com/openstreetmap/osm2pgsql/blob/master/flex-config/generic.lua#L38-L44

# JOIN

http://lua-users.org/wiki/SplitJoin

```lua
table.concat({"a", "b", "c"}, ",") --> "a,b,c"
```

# Check osm value against a list of valid values

This is related: https://stackoverflow.com/a/33606621/729221

Lars uses the method below.
One disadvantage I see is the duplication of the helper method.

```lua
local highway_list = {
  'primary',
  'primary_link',
  'secondary',
  'secondary_link',
  'tertiary',
  'tertiary_link',
  'residential',
  'living_street',
  'pedestrian',
  'road',
  'unclassified',
  'construction'
}

-- Prepare table 'highway_types' for quick checking of highway types
local highway_types = {}
for _, k in ipairs(highway_list) do
    highway_types[k] = 1
end
```

And use those like

```lua
if highway_types[object.tags["highway"]] then
  -- …
end
-- OR "if not …"
```

# ipairs() vs pairs()

ipairs nur für klassiche array nutzen. nicht für objects oder mixed.

https://www.tutorialspoint.com/what-is-the-difference-between-pairs-vs-ipairs-in-lua

# Variabialen `local`

Sind im scope / block "do end" UND im file (chunk) local.

https://www.lua.org/pil/4.2.html

# Sandbox online

https://www.tutorialspoint.com/execute_lua_online.php

# Concat

- `"foo" .. BarVaar`
- Aber Raised, wenn `BarVar` null
- Und es git ein `.concat`

Siehe https://www.dannyguo.com/blog/how-to-concatenate-strings-in-lua/
