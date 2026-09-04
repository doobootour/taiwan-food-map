/* =========================================================================
   경량 i18n — 한국어/영어 2개 언어만 지원.
   data-i18n(textContent) / data-i18n-html(innerHTML) / data-i18n-placeholder /
   data-i18n-alt / data-i18n-title 속성을 가진 요소를 현재 언어로 채운다.
   ========================================================================= */
const I18N = {
  ko: {
    nav_home: "홈",
    nav_categories: "카테고리",
    nav_regions: "지역",
    nav_map: "지도",
    nav_profile: "마이페이지",
    nav_community: "커뮤니티",
    brand_name: "나만 알고 싶은 대만 맛집",
    brand_tagline: "My Secret Taiwan Eats",
    btn_register: "맛집 등록하기",

    footer_desc: "한국인 여행자와 거주자가 직접 찾고 검증하는 대만 맛집 지도. 함께 만들어가는 진짜 로컬 가이드입니다.",
    footer_explore: "둘러보기",
    footer_categories: "카테고리",
    footer_regions: "지역별 탐험",
    footer_map: "지도",
    footer_join: "참여하기",
    footer_register: "맛집 등록하기",
    footer_community: "커뮤니티",
    footer_mypage: "마이페이지",
    footer_lang: "언어",
    footer_copyright: "© 2026 나만 알고 싶은 대만 맛집",

    hero_eyebrow: "Taiwan Food Map",
    hero_title_html: "골목 하나까지 다 아는<br/><em>나만의</em> 대만 맛집 지도",
    hero_sub: "현지인만 아는 골목 식당부터 최신 유행 디저트까지 — 한국인 여행자와 거주자가 직접 찾고 검증한 대만 맛집을 지도 위에서 만나보세요.",
    hero_cta_primary: "지금 맛집 찾기 →",
    hero_cta_secondary: "지역별로 둘러보기",
    hero_stat_count: "실시간 등록된 맛집",

    sec_categories_title: "무엇을 먹어볼까요?",
    sec_categories_desc: "31가지 카테고리를 골라서 지도 위 맛집을 바로 확인하세요. 핀을 눌러 추천 투표도 남길 수 있어요.",
    link_full_map: "전체 화면 지도로 보기 →",

    filter_toggle_label: "전체 메뉴 카테고리 열기",
    filter_select_all: "전체선택",
    filter_clear_all: "전체해제",
    filter_all: "전체",
    filter_selected_count: "{n}개 선택",
    map_loading: "맛집을 불러오는 중...",
    empty_note_html: "이 카테고리엔 아직 등록된 맛집이 없어요.<br/>첫 발견자가 되어보세요!",
    locate_title: "내 위치",
    add_title: "맛집 추가",
    map_hint: "지도를 눌러 맛집을 추가하세요",

    recent_contributors_label: "최근 맛집을 공유해준 여행자",

    sec_regions_title: "지역별 탐험",
    sec_regions_desc: "대만은 지역마다 다른 매력의 로컬 푸드가 있어요. 여행 동선에 맞춰 골라보세요.",

    cta_title: "나만의 맛집을 공유해주세요 🤫",
    cta_desc: "여러분의 발견이 다른 여행자들에게 진짜 대만을 경험하게 해줍니다.",
    cta_btn: "지금 등록하기 →",

    sheet_title: "나만의 맛집을 공유해주세요! 🤫",
    sheet_desc: "여러분의 발견이 다른 여행자들에게 진짜 대만을 경험하게 해줍니다. 함께해주셔서 감사해요! 💛",
    sheet_step1: "가게 이름은 링크에서 자동으로 채워져요. 어떤 종류의 맛집인지 카테고리만 골라주세요",
    sheet_step2: "닉네임·한줄평은 선택이에요. 등록하기를 누르면 바로 지도에 올라가요!",
    field_location: "위치 지정",
    gmap_link_placeholder: "구글맵에서 복사한 링크 붙여넣기",
    autofill_btn: "링크에서 위치 가져오기",
    autofill_btn_loading: "위치를 찾는 중...",
    field_name: "가게 이름",
    name_placeholder: "가게 이름을 입력하세요",
    field_category: "어떤 종류의 맛집인가요?",
    cat_select_default: "카테고리를 선택하세요",
    field_nickname: "닉네임",
    optional: "(선택)",
    nickname_placeholder: "닉네임을 입력하세요",
    nickname_hint: "💡 닉네임은 기여자 랭킹에 표시돼요. 지도를 함께 만들어주셔서 감사해요!",
    field_review: "한줄평",
    review_placeholder: "한줄평을 남겨주세요 (예: 야시장 안쪽 노점, 우육면이 진짜 맛있어요)",
    btn_cancel: "취소",
    btn_submit: "등록하기",
    btn_submitting: "등록 중...",

    toast_already_confirmed: "이미 확인하신 곳이에요",
    toast_vote_error: "투표 처리 중 오류가 발생했어요",
    toast_vote_thanks: "확인해주셔서 감사해요!",
    toast_load_error: "맛집 데이터를 불러오지 못했어요",
    toast_paste_link_first: "구글맵 링크를 먼저 붙여넣어주세요",
    toast_found_loc_name: "링크에서 위치와 이름을 찾았어요!",
    toast_found_loc: "링크에서 위치를 찾았어요!",
    toast_link_no_coords: "링크에서 좌표를 찾지 못했어요. 지도를 클릭해서 직접 선택해주세요.",
    toast_link_error: "링크를 확인하는 중 오류가 발생했어요. 지도를 클릭해서 직접 선택해주세요.",
    toast_submit_error: "등록 중 오류가 발생했어요",
    toast_submit_success: "맛집이 등록되었습니다! 🎉",
    toast_no_geolocation: "위치 정보를 사용할 수 없어요",
    toast_check_permission: "위치 권한을 확인해주세요",
    toast_moved_to_region: "{region} 지역으로 이동했어요",

    popup_verified: "검증됨",
    popup_link: "구글맵에서 보기 →",
    popup_vote_up: "👍 추천해요",
    popup_vote_down: "👎 아쉬워요",
    popup_recommend_count: "추천 {n}",
    popup_not_suited_count: "비추천 {n}",
    popup_fallback_name: "맛집",
    popup_registered_by: "등록: {name}",

    sec_findings_title: "여행자들이 등록한 진짜 맛집",
    sec_findings_desc: "이 지역에 실제로 등록된 맛집을 카테고리별로 모아봤어요. 새로 등록되면 여기에도 바로 반영돼요. 핀을 눌러 추천 투표도 남길 수 있어요.",
    region_h2_highlights: "여행자들이 가장 많이 찾는 곳",
    region_h2_activities: "여기서 즐길 거리",
    hero_btn_region_map: "이 지역 맛집 지도 보기 ↓",
    hero_btn_other_regions: "다른 지역 보기",
    loading_generic: "불러오는 중...",
    region_spots_none: "아직 {region}에 등록된 맛집이 없어요. 첫 발견자가 되어보세요! 🤫",
    region_spots_error: "맛집 목록을 불러오지 못했어요.",
    view_on_map: "지도에서 보기 →",

    profile_uid_note: "이 브라우저에서 활동 중인 익명 계정이에요",
    stat_submissions: "내가 등록한 맛집",
    stat_votes: "확인 투표 수",
    level_progress_title: "등급 진행도",
    level_new: "신규",
    level_explorer: "탐험가",
    level_local: "로컬전문가",
    level_master: "마스터",
    leaderboard_title: "🏆 이달의 기여자",
    lang_setting_title: "언어 설정",
    level_note_master: "최고 등급 '마스터'에 도달했어요! 🎉",
    level_note_next: "다음 등급까지 {remain}회 더 기여하면 '{next}' 등급이 돼요!",
    seed_label: "🍜 초기 큐레이션 데이터",
    me_suffix: " (나)",
    me_label: "나 ({id})",
    lb_pts: "{n} 기여",
    leaderboard_empty: "아직 활동 데이터가 없어요",

    community_title: "커뮤니티",
    community_desc: "대만 여행 준비하면서 궁금한 거 물어보고, 정보도 나누고, 동행도 구해보세요.",
    community_write: "글쓰기 ✏️",
    community_load_more: "더 불러오기",
    back_to_list: "← 목록으로",
    comment_label: "댓글",
    comment_placeholder: "댓글을 남겨주세요",
    comment_nickname_placeholder: "닉네임 (선택)",
    comment_submit: "댓글 등록",
  },
  en: {
    nav_home: "Home",
    nav_categories: "Categories",
    nav_regions: "Regions",
    nav_map: "Map",
    nav_profile: "My Page",
    nav_community: "Community",
    brand_name: "My Secret Taiwan Eats",
    brand_tagline: "Taiwan food map, curated by travelers",
    btn_register: "Add a Spot",

    footer_desc: "A Taiwan restaurant map found and verified by travelers and residents — a real local guide, built together.",
    footer_explore: "Explore",
    footer_categories: "Categories",
    footer_regions: "Explore by Region",
    footer_map: "Map",
    footer_join: "Get Involved",
    footer_register: "Add a Spot",
    footer_community: "Community",
    footer_mypage: "My Page",
    footer_lang: "Language",
    footer_copyright: "© 2026 My Secret Taiwan Eats",

    hero_eyebrow: "Taiwan Food Map",
    hero_title_html: "Down to the very last alley —<br/><em>your own</em> Taiwan food map.",
    hero_sub: "From hidden alley eateries only locals know to the latest trending desserts — discover Taiwan spots found and verified by Korean travelers and residents, all on one map.",
    hero_cta_primary: "Find Spots Now →",
    hero_cta_secondary: "Browse by Region",
    hero_stat_count: "Live Spots Registered",

    sec_categories_title: "What Should We Eat?",
    sec_categories_desc: "Pick from 31 categories to see spots on the map instantly. Tap a pin to leave a recommendation vote too.",
    link_full_map: "View Full-Screen Map →",

    filter_toggle_label: "Open All Categories",
    filter_select_all: "Select All",
    filter_clear_all: "Clear All",
    filter_all: "All",
    filter_selected_count: "{n} selected",
    map_loading: "Loading spots...",
    empty_note_html: "No spots in this category yet.<br/>Be the first to discover one!",
    locate_title: "My Location",
    add_title: "Add a Spot",
    map_hint: "Tap the map to add a spot",

    recent_contributors_label: "Travelers who recently shared a spot",

    sec_regions_title: "Explore by Region",
    sec_regions_desc: "Every region in Taiwan has its own local food scene — pick the one that matches your route.",

    cta_title: "Share your own hidden gem 🤫",
    cta_desc: "Your discovery helps other travelers experience the real Taiwan.",
    cta_btn: "Add a Spot Now →",

    sheet_title: "Share your own hidden gem! 🤫",
    sheet_desc: "Your discovery helps other travelers experience the real Taiwan. Thanks for being part of it! 💛",
    sheet_step1: "The shop name fills in automatically from the link. Just pick the category.",
    sheet_step2: "Nickname and a short review are optional. Tap Submit and it's live on the map!",
    field_location: "Set Location",
    gmap_link_placeholder: "Paste a Google Maps link here",
    autofill_btn: "Get Location from Link",
    autofill_btn_loading: "Finding location...",
    field_name: "Shop Name",
    name_placeholder: "Enter the shop name",
    field_category: "What kind of spot is it?",
    cat_select_default: "Select a category",
    field_nickname: "Nickname",
    optional: "(optional)",
    nickname_placeholder: "Enter a nickname",
    nickname_hint: "💡 Your nickname shows up on the contributor leaderboard. Thanks for helping build the map!",
    field_review: "One-line Review",
    review_placeholder: "Leave a short review (e.g. \"Tucked inside the night market — the beef noodles are amazing\")",
    btn_cancel: "Cancel",
    btn_submit: "Submit",
    btn_submitting: "Submitting...",

    toast_already_confirmed: "You've already confirmed this spot",
    toast_vote_error: "Something went wrong while voting",
    toast_vote_thanks: "Thanks for confirming!",
    toast_load_error: "Couldn't load spot data",
    toast_paste_link_first: "Paste a Google Maps link first",
    toast_found_loc_name: "Found the location and name from the link!",
    toast_found_loc: "Found the location from the link!",
    toast_link_no_coords: "Couldn't find coordinates from the link. Try tapping the map to pick a spot instead.",
    toast_link_error: "Something went wrong checking the link. Try tapping the map to pick a spot instead.",
    toast_submit_error: "Something went wrong while submitting",
    toast_submit_success: "Your spot has been added! 🎉",
    toast_no_geolocation: "Location access isn't available",
    toast_check_permission: "Please check your location permission",
    toast_moved_to_region: "Moved to {region}",

    popup_verified: "Verified",
    popup_link: "View on Google Maps →",
    popup_vote_up: "👍 Recommend",
    popup_vote_down: "👎 Not great",
    popup_recommend_count: "{n} recommends",
    popup_not_suited_count: "{n} not great",
    popup_fallback_name: "Spot",
    popup_registered_by: "Added by {name}",

    sec_findings_title: "Real Spots Added by Travelers",
    sec_findings_desc: "Real spots added in this region, grouped by category. New additions show up here right away. Tap a pin to leave a recommendation vote too.",
    region_h2_highlights: "Traveler Favorites",
    region_h2_activities: "Things to Do Here",
    hero_btn_region_map: "View This Region's Food Map ↓",
    hero_btn_other_regions: "See Other Regions",
    loading_generic: "Loading...",
    region_spots_none: "No spots added in {region} yet. Be the first to discover one! 🤫",
    region_spots_error: "Couldn't load the spot list.",
    view_on_map: "View on Map →",

    profile_uid_note: "An anonymous account active on this browser",
    stat_submissions: "Spots I've Added",
    stat_votes: "Votes Cast",
    level_progress_title: "Level Progress",
    level_new: "New",
    level_explorer: "Explorer",
    level_local: "Local Expert",
    level_master: "Master",
    leaderboard_title: "🏆 This Month's Contributors",
    lang_setting_title: "Language Settings",
    level_note_master: "You've reached the top level, 'Master'! 🎉",
    level_note_next: "{remain} more contribution(s) to reach '{next}'!",
    seed_label: "🍜 Initial curated data",
    me_suffix: " (me)",
    me_label: "Me ({id})",
    lb_pts: "{n} contributions",
    leaderboard_empty: "No activity yet",

    community_title: "Community",
    community_desc: "Ask questions, share tips, and find travel buddies while planning your Taiwan trip.",
    community_write: "Write ✏️",
    community_load_more: "Load More",
    back_to_list: "← Back to list",
    comment_label: "Comments",
    comment_placeholder: "Leave a comment",
    comment_nickname_placeholder: "Nickname (optional)",
    comment_submit: "Post Comment",
  },
};

function getLang() {
  return localStorage.getItem("tfm_lang") || "ko";
}

function t(key, vars) {
  const lang = getLang();
  let str = (I18N[lang] && I18N[lang][key] != null) ? I18N[lang][key] : I18N.ko[key];
  if (str == null) return key;
  if (vars) {
    Object.keys(vars).forEach(k => { str = str.split(`{${k}}`).join(vars[k]); });
  }
  return str;
}

function applyI18n(root = document) {
  const lang = getLang();
  document.documentElement.lang = lang;

  root.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  root.querySelectorAll("[data-i18n-html]").forEach(el => {
    el.innerHTML = t(el.getAttribute("data-i18n-html"));
  });
  root.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
  });
  root.querySelectorAll("[data-i18n-alt]").forEach(el => {
    el.alt = t(el.getAttribute("data-i18n-alt"));
  });
  root.querySelectorAll("[data-i18n-title]").forEach(el => {
    el.title = t(el.getAttribute("data-i18n-title"));
  });
}

function setLang(lang) {
  localStorage.setItem("tfm_lang", lang);
  applyI18n();
  document.dispatchEvent(new CustomEvent("tfm:langchange", { detail: { lang } }));
}

applyI18n(document);
