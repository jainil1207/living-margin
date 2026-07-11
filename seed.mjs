import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf-8');
const envUrl = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
const envKey = envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

const supabase = createClient(envUrl, envKey);

const books = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover_url: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    title: "1984",
    author: "George Orwell",
    cover_url: "https://m.media-amazon.com/images/I/71kxa1-0mfL.jpg"
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover_url: "https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    title: "Frankenstein",
    author: "Mary Shelley",
    cover_url: "https://m.media-amazon.com/images/I/71hXwG7s0wL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    title: "Alice's Adventures in Wonderland",
    author: "Lewis Carroll",
    cover_url: "https://m.media-amazon.com/images/I/71X8k7r+F6L._AC_UF1000,1000_QL80_.jpg"
  }
];

async function seed() {
    console.log("Attempting to insert books...");
    const { data, error } = await supabase.from('books').insert(books).select();
    
    if (error) {
        console.error("Error inserting:", error);
    } else {
        console.log("Successfully inserted", data.length, "books!");
    }
}

seed();
