-- Demo http://tpcg.io/_HFSD73
-- Source https://stackoverflow.com/a/65600458/729221

-- * @desc `MergeArray({ 'array1' }, { 'array2' })`
-- * @returns `{ 'array1', 'array2' }`
function MergeArray(array1, array2)
  for _, v in pairs(array2) do table.insert(array1, v) end
  return array1
end
