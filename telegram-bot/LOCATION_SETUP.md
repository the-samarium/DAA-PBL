# Location-Based Features Setup

## Overview

The `/nearby` command uses latitude and longitude columns from the `harvesters` table to calculate distances and find nearest equipment.

## Database Columns Required

The code already uses these columns (which you've added):
- `latitude` (DECIMAL/Double)
- `longitude` (DECIMAL/Double)

## How Distance Calculation Works

### 1. Haversine Formula
The bot uses the Haversine formula to calculate great-circle distances between two points on Earth:

```
Distance = R × 2 × atan2(√a, √(1-a))

Where:
- R = Earth's radius (6371 km)
- a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)
- Δlat = difference in latitude
- Δlon = difference in longitude
```

**Time Complexity:** O(1) - constant time for each distance calculation

### 2. Algorithm Flow

1. **Get Equipment** - Fetch all equipment with latitude/longitude from database
2. **Filter** - Remove equipment with invalid/missing coordinates
3. **Calculate** - Use Haversine formula for each equipment (O(1) each)
4. **Sort** - Sort by distance (O(n log n))
5. **Select** - Take top 5 nearest (O(1))

**Overall Time Complexity:** O(n log n) where n = number of equipment

## Code Updates Made

### 1. Location Handler (`locationHandler.js`)

**What was updated:**
- ✅ Added geocoding for common cities (Delhi, Mumbai, Bangalore, etc.)
- ✅ Improved latitude/longitude parsing with validation
- ✅ Better error handling for invalid coordinates
- ✅ Enhanced distance calculation to handle DECIMAL types from database

**Key changes:**
```javascript
// Now validates coordinates before calculating distance
.filter(eq => {
  const lat = parseFloat(eq.latitude);
  const lon = parseFloat(eq.longitude);
  return !isNaN(lat) && !isNaN(lon) && 
         lat >= -90 && lat <= 90 && 
         lon >= -180 && lon <= 180;
})
```

### 2. Distance Calculation (`dijkstra.js`)

**Already correct:**
- ✅ Uses Haversine formula
- ✅ Handles coordinate parsing
- ✅ Returns distance in kilometers

## Usage Examples

### Text Location Query
```
/nearby delhi
```
- Geocodes "delhi" to coordinates (28.6139, 77.2090)
- Calculates distance to all equipment
- Returns top 5 nearest

### Shared Location
User shares location via Telegram button:
- Uses exact user coordinates
- Calculates distance to all equipment
- Returns top 5 nearest

## Supported Cities (Text Query)

Currently supports:
- Delhi
- Mumbai
- Bangalore
- Chennai
- Kolkata
- Hyderabad
- Pune
- Ahmedabad
- Jaipur
- Lucknow

**To add more cities:**
Edit `locationHandler.js` and add to `locationMap`:
```javascript
this.locationMap = {
  'cityname': { latitude: XX.XXXX, longitude: YY.YYYY, name: 'City Name' },
  // ... existing cities
};
```

## Testing

### 1. Verify Equipment Has Coordinates
```sql
SELECT name, latitude, longitude FROM harvesters 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
```

### 2. Test Distance Calculation
Try in Telegram:
- `/nearby delhi` - Should find equipment near Delhi
- Share location - Should find equipment near your location

### 3. Check Bot Console
Look for:
- "No equipment with location data available" - No equipment has coordinates
- Distance calculations should show in results

## Adding Location Data

### Option 1: Add via SQL
```sql
UPDATE harvesters 
SET latitude = 28.6139, longitude = 77.2090 
WHERE id = 'equipment-uuid-here';
```

### Option 2: Add via Next.js App
The add-harvester page should include latitude/longitude fields.

## Troubleshooting

**No results?**
1. Check equipment has latitude/longitude values
2. Verify coordinates are valid (lat: -90 to 90, lon: -180 to 180)
3. Check console for errors

**Wrong distances?**
1. Verify coordinates are in correct format (decimal degrees)
2. Check if coordinates are swapped (lat/lon)
3. Ensure database returns numeric values, not strings

## Future Enhancements

1. **Use Actual Geocoding API** - Replace city mapping with real geocoding service
2. **Graph Algorithm** - Use actual Dijkstra's for route optimization (not just distance)
3. **Caching** - Cache geocoded locations for faster queries
4. **Max Distance Filter** - Add maximum distance parameter (e.g., within 50km)

