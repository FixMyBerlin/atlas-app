function PrintTable(table)
  PrintTableWithHeadline(table, "(no headline)")
end

function PrintTableWithHeadline(table, headline)
  print("-- PrintTable -- " .. headline .. " --")

  for k, v in pairs(table) do
    print(k .. ": " .. v)
  end
end
