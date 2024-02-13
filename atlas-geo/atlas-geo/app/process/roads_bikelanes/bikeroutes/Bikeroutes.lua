---@param tags table
---@return boolean
-- Predicate wether a relation is a bicycle route
function IsBicycleRoute(tags)
  return tags.type == 'route' and tags.route == 'bicycle'
end

---@param tags table
---@return table
-- given an osm relation
function Bikeroutes(tags)
  local networkTypes = Set({ 'lcn', 'rcn', 'ncn', 'icn' })
  local network_tags_cc = { 'name', 'ref', 'operator', 'cycle_network' }
  local results = {}
  results.network = Sanitize(tags.network, networkTypes)
  CopyTags(results, tags, network_tags_cc, 'network_')
  return results
end

---@param wayRouteMapping table
---@param relation_id integer
---@param ways table
-- Update the `wayRouteMapping` by adding the `relation_id` to every element of `ways`
function UpdateWayRouteMapping(wayRouteMapping, relation_id, ways)
  for _, id in pairs(ways) do
    if wayRouteMapping[id] == nil then
      wayRouteMapping[id] = { relation_id }
    else
      table.insert(wayRouteMapping[id], relation_id)
    end
  end
end
