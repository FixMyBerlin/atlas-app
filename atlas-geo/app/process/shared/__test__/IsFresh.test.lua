package.path = package.path .. ";./app/process/helper/?.lua;./app/process/shared/?.lua"
require("IsFresh")
require("PrintTable")

local daySeconds = 24 * 60 * 60
local tenYearsSeconds = daySeconds * 365 * 10
local dateTimeTenYearsAgo = os.time() - tenYearsSeconds
local formattedDateTenYearsAgo = os.date('!%Y-%m-%d', os.time() - tenYearsSeconds)
local osmObject = {
  ["timestamp"] = dateTimeTenYearsAgo,
  ["tags"] = { ["check_date:lit"] = tostring(formattedDateTenYearsAgo) }
}

print('=== Test IsFresh: keys ===')
local _dest, keys = IsFresh(osmObject, "check_date:lit", {})
-- PrintTableWithHeadline(keys, 'keys')
assert(keys[1] == "fresh")
assert(keys[2] == "fresh_age_days")

print('=== Test IsFresh: keys + postif ===')
local _dest, keys = IsFresh(osmObject, "check_date:lit", {}, 'foo')
-- PrintTableWithHeadline(keys, 'keys')
assert(keys[1] == "foo_fresh")
assert(keys[2] == "foo_fresh_age_days")

print('=== Test IsFresh: outdated_check_date ===')
local dest, _keys = IsFresh(osmObject, "check_date:lit", {})
-- PrintTableWithHeadline(dest, 'dest')
assert(dest["fresh"] == "outdated_check_date")
assert(dest["fresh_age_days"] > 3600)

print('=== Test IsFresh: outdated_check_date + postfix ===')
local dest, _keys = IsFresh(osmObject, "check_date:lit", {}, 'foo')
-- PrintTableWithHeadline(dest, 'dest')
assert(dest["foo_fresh"] == "outdated_check_date")
assert(dest["foo_fresh_age_days"] > 3600)

print('=== Test IsFresh: fresh_check_date ===')
local yesterday = os.date('!%Y-%m-%d', os.time() - daySeconds)
osmObject["tags"]["check_date:lit"] = tostring(yesterday)
local dest, _keys = IsFresh(osmObject, "check_date:lit", {})
-- PrintTableWithHeadline(dest, 'dest')
assert(dest["fresh"] == "fresh_check_date")

print('=== Test IsFresh: outdated_update_at ===')
local yesterday = os.date('!%Y-%m-%d', os.time() - (daySeconds * 365 * 2 + 10))
osmObject["tags"]["check_date:lit"] = nil
local dest, _keys = IsFresh(osmObject, "check_date:lit", {})
-- PrintTableWithHeadline(dest, 'dest')
assert(dest["fresh"] == "outdated_update_at")

print('=== Test IsFresh: fresh_update_at ===')
osmObject["timestamp"] = os.time() - (daySeconds * 10)
local dest, _keys = IsFresh(osmObject, "check_date:lit", {})
-- PrintTableWithHeadline(dest, 'dest')
assert(dest["fresh"] == "fresh_update_at")
