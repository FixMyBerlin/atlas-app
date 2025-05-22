local function area_sqm(object)
  return object:as_polygon():transform(5243):area()
end

return area_sqm
