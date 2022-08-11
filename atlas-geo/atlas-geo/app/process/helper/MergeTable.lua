-- Demo http://tpcg.io/_HFSD73
-- Source https://stackoverflow.com/a/65600458/729221
function MergeTable(t1, t2)
  for _, v in pairs(t2) do table.insert(t1, v) end
  return t1
end
