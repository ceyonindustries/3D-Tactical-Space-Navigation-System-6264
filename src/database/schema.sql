-- Saved Locations Table
CREATE TABLE IF NOT EXISTS saved_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  quadrant_code VARCHAR(50) NOT NULL,
  position_x DECIMAL(10,6) NOT NULL,
  position_y DECIMAL(10,6) NOT NULL,
  position_z DECIMAL(10,6) NOT NULL,
  icon_type VARCHAR(50) DEFAULT 'location',
  description TEXT,
  color VARCHAR(7) DEFAULT '#00ff88',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Missions Table
CREATE TABLE IF NOT EXISTS missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  quadrant_code VARCHAR(50) NOT NULL,
  position_x DECIMAL(10,6) NOT NULL,
  position_y DECIMAL(10,6) NOT NULL,
  position_z DECIMAL(10,6) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  priority VARCHAR(20) DEFAULT 'medium',
  assigned_units TEXT[], -- Array of unit IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Units Table
CREATE TABLE IF NOT EXISTS units (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  unit_type VARCHAR(50) NOT NULL, -- ship, station, outpost, etc.
  quadrant_code VARCHAR(50) NOT NULL,
  position_x DECIMAL(10,6) NOT NULL,
  position_y DECIMAL(10,6) NOT NULL,
  position_z DECIMAL(10,6) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  commander VARCHAR(255),
  crew_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_saved_locations_quadrant ON saved_locations(quadrant_code);
CREATE INDEX IF NOT EXISTS idx_missions_quadrant ON missions(quadrant_code);
CREATE INDEX IF NOT EXISTS idx_units_quadrant ON units(quadrant_code);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_units_status ON units(status);