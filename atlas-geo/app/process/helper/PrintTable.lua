function PrintTable(table)
  PrintTableWithHeadline(table, "(no headline)")
end

function PrintTableWithHeadline(table, headline)
  print("-- PrintTable -- " .. headline .. " --")

  if not table then
    print('table is nil')
    return
  end

  for k, v in pairs(table) do
    print(k .. ": " .. tostring(v))
  end
end
