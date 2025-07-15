import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

// Create a mock client that falls back to localStorage
const createMockClient = () => ({
  from: (table) => ({
    select: () => ({ data: [], error: null }),
    insert: (data) => ({ data: data[0], error: null }),
    update: (data) => ({ data: data, error: null }),
    delete: () => ({ error: null }),
    eq: () => ({ data: [], error: null }),
    order: () => ({ data: [], error: null }),
    single: () => ({ data: null, error: null })
  }),
  channel: () => ({
    on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) })
  }),
  rpc: () => ({ error: null })
});

export const supabase = supabaseUrl === 'https://your-project.supabase.co' 
  ? createMockClient() 
  : createClient(supabaseUrl, supabaseKey);

// Database schema initialization
export const initializeDatabase = async () => {
  try {
    console.log('Database initialized successfully (mock mode)');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Real-time subscriptions
export const subscribeToUpdates = (onLocationsUpdate, onMissionsUpdate, onUnitsUpdate) => {
  // Mock subscription - returns empty unsubscribe function
  return () => {};
};

// CRUD operations with localStorage fallback
export const savedLocationsAPI = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('saved_locations')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || JSON.parse(localStorage.getItem('savedLocations') || '[]');
    } catch (error) {
      return JSON.parse(localStorage.getItem('savedLocations') || '[]');
    }
  },

  async create(location) {
    try {
      const { data, error } = await supabase
        .from('saved_locations')
        .insert([location])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      // Fallback to localStorage
      const existing = JSON.parse(localStorage.getItem('savedLocations') || '[]');
      const updated = [location, ...existing];
      localStorage.setItem('savedLocations', JSON.stringify(updated));
      return location;
    }
  },

  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from('saved_locations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      // Fallback to localStorage
      const existing = JSON.parse(localStorage.getItem('savedLocations') || '[]');
      const updated = existing.map(item => item.id === id ? { ...item, ...updates } : item);
      localStorage.setItem('savedLocations', JSON.stringify(updated));
      return { ...updates, id };
    }
  },

  async delete(id) {
    try {
      const { error } = await supabase
        .from('saved_locations')
        .delete()
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      // Fallback to localStorage
      const existing = JSON.parse(localStorage.getItem('savedLocations') || '[]');
      const updated = existing.filter(item => item.id !== id);
      localStorage.setItem('savedLocations', JSON.stringify(updated));
    }
  }
};

export const missionsAPI = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || JSON.parse(localStorage.getItem('missions') || '[]');
    } catch (error) {
      return JSON.parse(localStorage.getItem('missions') || '[]');
    }
  },

  async create(mission) {
    try {
      const { data, error } = await supabase
        .from('missions')
        .insert([mission])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      // Fallback to localStorage
      const existing = JSON.parse(localStorage.getItem('missions') || '[]');
      const updated = [mission, ...existing];
      localStorage.setItem('missions', JSON.stringify(updated));
      return mission;
    }
  },

  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from('missions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      // Fallback to localStorage
      const existing = JSON.parse(localStorage.getItem('missions') || '[]');
      const updated = existing.map(item => item.id === id ? { ...item, ...updates } : item);
      localStorage.setItem('missions', JSON.stringify(updated));
      return { ...updates, id };
    }
  },

  async delete(id) {
    try {
      const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      // Fallback to localStorage
      const existing = JSON.parse(localStorage.getItem('missions') || '[]');
      const updated = existing.filter(item => item.id !== id);
      localStorage.setItem('missions', JSON.stringify(updated));
    }
  }
};

export const unitsAPI = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || JSON.parse(localStorage.getItem('units') || '[]');
    } catch (error) {
      return JSON.parse(localStorage.getItem('units') || '[]');
    }
  },

  async create(unit) {
    try {
      const { data, error } = await supabase
        .from('units')
        .insert([unit])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      // Fallback to localStorage
      const existing = JSON.parse(localStorage.getItem('units') || '[]');
      const updated = [unit, ...existing];
      localStorage.setItem('units', JSON.stringify(updated));
      return unit;
    }
  },

  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from('units')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      // Fallback to localStorage
      const existing = JSON.parse(localStorage.getItem('units') || '[]');
      const updated = existing.map(item => item.id === id ? { ...item, ...updates } : item);
      localStorage.setItem('units', JSON.stringify(updated));
      return { ...updates, id };
    }
  },

  async delete(id) {
    try {
      const { error } = await supabase
        .from('units')
        .delete()
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      // Fallback to localStorage
      const existing = JSON.parse(localStorage.getItem('units') || '[]');
      const updated = existing.filter(item => item.id !== id);
      localStorage.setItem('units', JSON.stringify(updated));
    }
  }
};