function MaxspeedFromZone(tags)
  local maxspeed_type = {
    ["DE:rural"] = 100,
    ["DE:urban"] = 50,
    ["DE:zone30"] = 30,
    ["DE:bicycle_road"] = 30,
    ["DE:zone20"] = 20,
    ["DE:zone10"] = 10,
  }

  local maxspeed_zone = {
    ["DE:30"] = 30,
    ["30"] = 30,
    ["DE:bicycle_road"] = 30,
    ["DE:20"] = 20,
    ["20"] = 20,
    ["DE:10"] = 10,
    ["10"] = 10,
  }

  local maxspeed_source = {
    ["DE:rural"] = 100,
    ["DE:urban"] = 50,
    ["DE:zone:30"] = 30,
    ["DE:zone30"] = 30,
    ["DE:bicycle_road"] = 30,
    ["DE:zone:20"] = 20,
    ["DE:zone20"] = 20,
    ["DE:zone:10"] = 10,
    ["DE:zone10"] = 10,
  }

  local maxspeed = -1.0
  local source = "nothing_found"
  local confidence = "nothing_found"

  if maxspeed_type[tags["maxspeed:type"]] then
    maxspeed = maxspeed_type[tags["maxspeed:type"]]
    source = 'zone'
    confidence = 'high'
  end

  if maxspeed_zone[tags["zone:maxspeed"]] then
    maxspeed = maxspeed_type[tags["zone:maxspeed"]]
    source = 'zone'
    confidence = 'high'
  end

  if maxspeed_source[tags["source:maxspeed"]] then
    maxspeed = maxspeed_type[tags["source:maxspeed"]]
    source = 'zone'
    confidence = 'high'
  end

  return maxspeed, source, confidence
end
