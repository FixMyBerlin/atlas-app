-- * @desc If and why a highway object should be excluded based on its width.
-- * @returns { boolean (shouldFilter), string (reason) }
function ExcludeByWidth(tags, maxWidth)
  local width = tonumber(tags.width)
  if width and width < maxWidth then
    return true, ";Excluded since `width<" .. maxWidth .. "` indicates a special interest path"
  end
  return false, ""
end
