// Supabase 프로젝트: taiwan-food-map (doobootour 조직)
const SUPABASE_URL = "https://dgkiqvqbquekcizyczkm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRna2lxdnFicXVla2NpenljemttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMzM4MTksImV4cCI6MjEwMzkwOTgxOX0.2qWCUkAWVcgj2LzFmujMy1UrJgV7KYVHNe9uKJHwlq4";

function tfmUid() {
  let id = localStorage.getItem("tfm_uid");
  if (!id) {
    id = "guest_" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("tfm_uid", id);
  }
  return id;
}

// x-tfm-uid 헤더는 Supabase RLS에서 "본인이 올린 글만 삭제 가능" 정책(eats_owner_delete)이
// 요청자를 식별하는 데 쓴다 — 별도 로그인 없이 브라우저별 익명 id로 소유권을 구분하는 방식.
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: { headers: { "x-tfm-uid": tfmUid() } },
});

const VERIFIED_THRESHOLD = 3;
