function AddSkipInfoByWidth(object, width)
  local useWith = width or 2.1
  ToNumber(object.tags, Set({ 'width' }))
  if object.tags.width and object.tags.width < useWith then
    object.tags._skipNotes = object.tags._skipNotes ..
        ";Skipped since `width<2.1m` indicates a special interest path"
    object.tags._skip = true
  end
end
