import React, { useEffect } from 'react';
import { supabase } from '../supabaseClient';

const TestSupabase: React.FC = () => {
  useEffect(() => {
    const test = async () => {
      const { data, error } = await supabase.from('books').select('*');

      console.log('Supabase error:', error);
      console.log('Supabase data:', data);
    };

    test();
  }, []);

    return <div>Check console for Supabase test.</div>;
};

export default TestSupabase;
