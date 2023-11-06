function BikelanesTodos(tags)
  local todos = {}

  if tags.traffic_sign == nil then
    todos[#todos + 1] = "Bitte `traffic_sign=DE:*` oder `traffic_sign=none` explicitly angeben"
  end

  -- TODOs für Fahrradstraßen
  if tags.bicycle_road == "yes" then
    if not IsTermInString('DE:244.1', tags.traffic_sign) then
      todos[#todos + 1] = "Bitte `traffic_sign=DE:244.1` erwartet"
    end
    if tags.vehicle == "destination" and IsTermInString("1020-30", tags.traffic_sign) then
      todos[#todos + 1] = "Bitte Zusatzzeichen 'Anlieger frei' explizt angeben, bspw. `traffic_sign=DE:244.1,1020-30`"
    end
    if (tags.vehicle == "no" or tags.vehicle == "destination") and tags.bicycle == 'designated' then
      todos[#todos + 1] = "Bitte Routing explizit erlauben mit `bicycle=designated`"
    end
  end

  -- TODOs Gemeinsamer Fuß- und Radweg
  if IsTermInString('DE:240', tags.traffic_sign) or IsTermInString('DE:241', tags.traffic_sign) then
    if tags.bicycle ~= 'designated' and tags.foot ~= "designated" then
      todos[#todos + 1] = "Bitte 'access' prüfen: Sollte `bicycle=designated` und `foot=designated` sein"
    end
  end

  return todos
end
