-- * @desc If and why a highway object should be excluded based on its width.
-- * @returns { boolean (shouldFilter), string (reason) }
function ExcludeByWidth(tags, minWidth)
  local width = tonumber(tags.width)
  if width and width < minWidth then
    return true, ";Excluded since `width<" .. minWidth .. "` indicates a special interest path"
  end
  return false, ""
end
