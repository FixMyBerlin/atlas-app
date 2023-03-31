package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("IsFresh")

-- TODO: Figure out why the require does not work.
-- Write tests for this…

print('=== Test IsFresh: base test ===')
local dest, keys = IsFresh({ ["check_date:lit"] = "2018-12-12" }, "lit", {})
print(dest)
print(keys)
assert(dest == { ["fresh"] = false,["fresh_age_days"] = false, })
assert(keys == { 'fresh', 'fresh_age_days' })
