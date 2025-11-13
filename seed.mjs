import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}


const supabase = createClient(supabaseUrl, serviceRoleKey);

//  Default knjige 
const DEFAULT_BOOKS = [
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    year: 1937,
    genre: 'Fantasy',
    available: true,
  },
  {
    title: '1984',
    author: 'George Orwell',
    year: 1949,
    genre: 'Dystopian',
    available: true,
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    year: 2008,
    genre: 'Programming',
    available: false,
  },
  
];

// Default members 
const DEFAULT_MEMBERS = [
  {
    name: 'John Doe',
    address: 'Main Street 12',
    city: 'Belgrade',
    phone: '+381 64 123 4567',
  },
  {
    name: 'Anna Smith',
    address: 'Green Avenue 5',
    city: 'Novi Sad',
    phone: '+381 63 222 333',
  },
  {
    name: 'Peter Johnson',
    address: 'Library Street 1',
    city: 'Niš',
    phone: '+381 61 999 888',
  },
];

// Funkcija za seedovanje books tabele
async function seedBooks() {
  console.log('Checking books table...');

  const { data, error } = await supabase
    .from('books')
    .select('id')
    .limit(1);

  if (error) {
    console.error('Error checking books table:', error.message);
    return;
  }

  if (data && data.length > 0) {
    console.log('Books table already has data. Skipping seed.');
    return;
  }

  console.log('Books table is empty. Inserting default books...');

  // ne šaljemo id, baza ima svoj auto-increment
  const booksToInsert = DEFAULT_BOOKS.map(
    ({ title, author, year, genre, available }) => ({
      title,
      author,
      year,
      genre,
      available,
    })
  );

  const { error: insertError } = await supabase
    .from('books')
    .insert(booksToInsert);

  if (insertError) {
    console.error('Error inserting books:', insertError.message);
  } else {
    console.log('Books seeded successfully.');
  }
}

//  Funkcija za seedovanje members tabele
async function seedMembers() {
  console.log('Checking members table...');

  const { data, error } = await supabase
    .from('members')
    .select('id')
    .limit(1);

  if (error) {
    console.error('Error checking members table:', error.message);
    return;
  }

  if (data && data.length > 0) {
    console.log('Members table already has data. Skipping seed.');
    return;
  }

  console.log('Members table is empty. Inserting default members...');

  const { error: insertError } = await supabase
    .from('members')
    .insert(DEFAULT_MEMBERS);

  if (insertError) {
    console.error('Error inserting members:', insertError.message);
  } else {
    console.log('Members seeded successfully.');
  }
}

//  Main funkcija
async function main() {
  await seedBooks();
  await seedMembers();
  console.log('Seeding done.');
  process.exit(0);
}

main();


