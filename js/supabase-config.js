// Supabase 프로젝트: taiwan-food-map (doobootour 조직)
const SUPABASE_URL = "https://dgkiqvqbquekcizyczkm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRna2lxdnFicXVla2NpenljemttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMzM4MTksImV4cCI6MjEwMzkwOTgxOX0.2qWCUkAWVcgj2LzFmujMy1UrJgV7KYVHNe9uKJHwlq4";

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function tfmUid() {
  let id = localStorage.getItem("tfm_uid");
  if (!id) {
    id = "guest_" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("tfm_uid", id);
  }
  return id;
}

const VERIFIED_THRESHOLD = 3;
