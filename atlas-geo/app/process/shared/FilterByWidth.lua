function FilterByWidth(tags, maxWidth)
  local width = tonumber(tags.width)
  if width and width < maxWidth then
    return true, ";Skipped since `width<" .. maxWidth .. "` indicates a special interest path"
  end
  return false, ""
end
