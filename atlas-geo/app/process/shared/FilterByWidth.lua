-- * @desc If and why a highway object should be filterd based on its width.
-- * @returns { boolean (shouldFilter), string (reason) }
function FilterByWidth(tags, maxWidth)
  local width = tonumber(tags.width)
  if width and width < maxWidth then
    return true, ";Skipped since `width<" .. maxWidth .. "` indicates a special interest path"
  end
  return false, ""
end
