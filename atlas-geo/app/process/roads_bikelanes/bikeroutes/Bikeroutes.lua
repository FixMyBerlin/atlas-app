local function networkInformation(tags)
  local networkTypes =  Set({'lcn', 'rcn', 'ncn', 'icn'})
  local network_tags_cc = {'name', 'ref', 'operator', 'cycle_network'}
  local results = {}
  results.network = Sanitize(tags.network, networkTypes)
  CopyTags(results, tags, network_tags_cc, 'network_')
  return results
end

function IsBicycleRoute(tags)
  return tags.type == 'route' and tags.route == 'bicycle'
end

function Bikeroutes(object)
  if IsBicycleRoute(object.tags) then
    for _, id in pairs(osm2pgsql.way_member_ids(object)) do
      if Way2RoutesMapping[id] == nil then
        Way2RoutesMapping[id] = {object.id}
      else
        table.insert(Way2RoutesMapping[id], object.id)
      end
    end
    return networkInformation(object.tags)
  end
end
