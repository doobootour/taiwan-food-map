# 대만 맛집 지도 — 카테고리 이미지 프롬프트 (Midjourney)

타겟: 대만 여행을 계획 중인 2030 여성
컨셉: **"Golden Hour Taipei"** — 따뜻하고 감성적인 여행 매거진 톤의 에디토리얼 푸드 포토그래피

---

## 1. 공통 스타일 DNA

### 컬러 팔레트
- 베이스: 크림 화이트 `#F5E6D3`, 라탄 베이지 `#D9B896`
- 메인 악센트: 테라코타/버터스카치 오렌지 `#C97C4A`, 더스티 코랄 `#E8A798`
- 포인트: 세이지 그린 `#8A9A7E` (차/식물 소품으로만 소량)
- 하이라이트: 골든 옐로우 `#F0C05A`
- 그림자: 다크 브라운/에스프레소 `#3B2A20` — 순검정 사용 안 함

### 무드 & 구도
- 늦은 오후 골든아워 or 따뜻한 랜턴/펜던트 조명, 은은한 필름 그레인
- 음식: 45도 앵글 또는 탑뷰, 얕은 심도, 메인 요리 1개 + 미니멀 소품 1~2개
- 공간(카페/마트/노점/바/소품가게): 아이레벨, 인물은 손/실루엣 정도만

---

## 2. Midjourney 파라미터 가이드

| 파라미터 | 권장값 | 이유 |
|---|---|---|
| `--v` | `7` | 최신 버전, 텍스처·조명 사실감이 가장 좋음 |
| `--style raw` | 고정 | MJ 특유의 과장된 일러스트/아트풍을 억제하고 실제 포토그래피에 가깝게 |
| `--s` (stylize) | `100~150` | 너무 높으면(300+) MJ 특유의 "AI스러운" 룩으로 튐. 이 범위가 사실적 + 감성적 균형점 |
| `--ar` | `4:5` 카드 / `16:9` 히어로 배너 / `1:1` 썸네일 | 웹사이트 용도별 비율 |
| `--chaos` | `0~5` | 낮게 유지해 28장 간 결과 편차 최소화 |
| `--no` | 하단 목록 | negative prompt 역할 |
| `--sref [URL] --sw 100` | 앵커 이미지 업스케일 후 적용 | **28장 톤 통일의 핵심** — 아래 워크플로우 참고 |
| `--seed [숫자]` | 선택 | 같은 seed는 조명/구도 패턴을 유사하게 유지 (sref와 병행 시 과최적화 주의, 하나만 우선 적용 권장) |

### `--no` 공통 네거티브 키워드
```
--no cartoon, illustration, 3d render, plastic food, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people, blurry
```

---

## 3. 앵커(Anchor) 이미지 워크플로우 — 톤 통일 핵심 단계

1. 아래 "우육면" 프롬프트를 가장 먼저 생성 → 마음에 드는 결과를 **U(업스케일)**
2. 업스케일된 이미지를 열어 **이미지 URL을 복사** (Discord에서 이미지 우클릭 → "링크 복사")
3. 이후 27개 프롬프트 맨 앞에 `[복사한 URL]` 를 이미지 프롬프트로 추가하고 `--sref [복사한 URL] --sw 100` 파라미터를 붙여서 생성
   - 예: `[앵커 이미지 URL] A bowl of Taiwanese dry noodles... --ar 4:5 --style raw --v 7 --s 120 --sref [앵커 이미지 URL] --sw 100 --no ...`
4. 색감/조명이 계속 튀면 `--sw`를 150~250으로 올리고, 반대로 구도가 너무 획일화되면 50~80으로 낮추기

> 아래 28개 프롬프트는 `--sref` 없이 기본 파라미터만 넣은 버전입니다. 앵커 이미지 확보 후 각 프롬프트 끝에 `--sref [URL] --sw 100`만 추가하면 됩니다.

---

## 4. 카테고리별 /imagine 프롬프트 (바로 복붙)

### 우육면 (Beef Noodle Soup) — 앵커 후보
```
/imagine prompt: A steaming bowl of Taiwanese beef noodle soup (牛肉麵) in a deep terracotta-glazed ceramic bowl, thick hand-pulled noodles, tender braised beef chunks, rich dark glossy broth, topped with bok choy and scallions, wisps of steam rising, wooden chopsticks resting on the bowl's edge, rustic wood table, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain, blurred cozy background --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, plastic food, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people, blurry
```

### 국수 (Noodles)
```
/imagine prompt: A bowl of Taiwanese dry noodles (乾麵) tossed in glossy savory sauce, minced pork and pickled vegetables on top, fresh scallion garnish, warm cream ceramic bowl, chopsticks resting alongside, small side dish of blanched greens, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, plastic food, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people, blurry
```

### 일식 (Japanese)
```
/imagine prompt: An elegant sashimi and nigiri platter on a dark slate board, glistening fresh salmon and tuna slices, small dish of soy sauce with wasabi, single delicate flower garnish, minimalist styling, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, plastic food, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people, blurry
```

### 해산물 (Seafood)
```
/imagine prompt: A generous platter of fresh steamed prawns, clams, and crab, glistening with light garlic butter glaze, lemon wedge and herb garnish, rustic ceramic plate, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, plastic food, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people, blurry
```

### 라멘 (Ramen)
```
/imagine prompt: A steaming bowl of rich tonkotsu ramen, jammy soft-boiled egg halved on top, chashu pork slices, nori, bamboo shoots, scallions, glossy golden broth, steam rising, dark ceramic bowl, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, plastic food, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people, blurry
```

### 훠궈 (Hotpot)
```
/imagine prompt: Overhead shot of a divided hotpot (鴛鴦鍋), spicy red broth on one side and clear mushroom broth on the other, gently simmering, surrounded by small plates of thinly sliced beef, mushrooms, leafy greens and tofu, warm terracotta and cream color palette, soft golden hour lighting, editorial food photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, plastic food, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people, blurry
```

### 조식 (Breakfast, Taiwanese)
```
/imagine prompt: A cozy Taiwanese breakfast spread — golden folded egg pancake (蛋餅), a warm glass of soy milk, crispy youtiao, light wooden tray, soft morning light streaming in, warm terracotta and cream color palette, shallow depth of field, editorial food photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, plastic food, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people, blurry
```

### 브런치 (Brunch)
```
/imagine prompt: A bright brunch table with fluffy pancakes drizzled with honey, fresh berries, soft poached egg on avocado toast, latte with delicate foam art, soft natural morning light, warm terracotta and cream color palette, shallow depth of field, editorial food photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, plastic food, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people, blurry
```

### 카페 (Cafe)
```
/imagine prompt: A cozy boutique cafe corner in Taipei, latte with soft foam art on a marble table, slice of cake on a small plate, warm ambient light through a window, potted plant softly blurred in background, warm terracotta and cream color palette, shallow depth of field, editorial lifestyle photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people's faces, blurry
```

### 빙수 (Shaved Ice)
```
/imagine prompt: A towering mountain of fluffy mango shaved ice, generous fresh mango cubes, condensed milk drizzle, small scoop of mango sorbet, wide ceramic bowl, soft pastel background, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, plastic food, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people, blurry
```

### 한식 (Korean Food)
```
/imagine prompt: A vibrant bibimbap in a stone bowl, colorful julienned vegetables, marinated beef, sunny fried egg on top, dollop of gochujang, small banchan side dishes around, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, plastic food, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people, blurry
```

### 파스타 (Pasta)
```
/imagine prompt: An elegant plate of creamy truffle pasta twirled neatly at the center of a white ceramic plate, fresh herb garnish, shaved parmesan, warm restaurant lighting, warm terracotta and cream color palette, shallow depth of field, editorial food photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, plastic food, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people, blurry
```

### BBQ
```
/imagine prompt: A sizzling BBQ grill plate with marinated beef short ribs and pork belly over open flame, smoky char marks, small side dishes around, warm smoky ambiance, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, plastic food, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people, blurry
```

### 스테이크 (Steak)
```
/imagine prompt: A perfectly seared steak with deep caramelized crust, sliced to reveal a juicy medium-rare center, dark plate, sprig of rosemary, small pool of pan sauce, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, plastic food, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people, blurry
```

### 딤섬 (Dim Sum)
```
/imagine prompt: A bamboo steamer basket filled with delicate translucent xiaolongbao and shrimp dumplings, steam gently rising, soy sauce dish with ginger julienne alongside, warm wooden table, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, plastic food, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people, blurry
```

### 거위 (Goose)
```
/imagine prompt: A platter of glossy Taiwanese roast goose (鵝肉), skin lacquered deep amber and crisp, neatly sliced over a bed of greens, small dish of tangy dipping sauce, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, plastic food, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people, blurry
```

### 노점 (Night Market Street Stall)
```
/imagine prompt: A bustling Taiwanese night market food stall at dusk, warm string lights and red lanterns glowing, steam rising from sizzling street food on a griddle, blurred colorful signage in the background, warm terracotta and golden tones, editorial travel photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 5 --no cartoon, illustration, 3d render, oversaturated, neon blue tones, cold lighting, text, watermark, logo, people's faces, blurry
```

### 마트 (Convenience Store / Mart)
```
/imagine prompt: A neatly organized Taiwanese convenience store shelf, colorful snack packaging and drinks under warm ambient light, softly blurred hand reaching for a product, warm terracotta and cream color palette, shallow depth of field, editorial lifestyle photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, oversaturated, cold lighting, text, watermark, logo, people's faces, blurry
```

### 과일 (Fruit)
```
/imagine prompt: An abundant display of fresh tropical Taiwanese fruits — mango, guava, dragon fruit, lychee — arranged in a woven basket, soft natural light highlighting vivid colors, warm terracotta and cream color palette, shallow depth of field, editorial food photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, plastic food, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people, blurry
```

### 태국 (Thai Food)
```
/imagine prompt: A vibrant bowl of tom yum goong, fragrant with lemongrass and chili, glistening prawns, fresh herbs floating on top, warm ceramic bowl, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, plastic food, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people, blurry
```

### 베트남 (Vietnamese Food)
```
/imagine prompt: A steaming bowl of pho with thinly sliced rare beef, fresh herbs, bean sprouts and lime on the side, clear fragrant broth, chopsticks resting on the bowl, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, plastic food, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people, blurry
```

### 인도 (Indian Food)
```
/imagine prompt: A warm platter of butter chicken curry with rich orange-red sauce, fluffy naan bread, scoop of basmati rice, fresh cilantro garnish, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, plastic food, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people, blurry
```

### 대만식 (Taiwanese Cuisine)
```
/imagine prompt: Classic Taiwanese three-cup chicken (三杯雞) in a sizzling clay pot, glossy dark soy-sesame glaze, fresh basil leaves scattered on top, rustic table setting, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, plastic food, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people, blurry
```

### 피자 (Pizza)
```
/imagine prompt: A rustic wood-fired margherita pizza, bubbling melted mozzarella, fresh basil leaves, charred leopard-spotted crust, wooden pizza board, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, plastic food, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people, blurry
```

### 취두부 (Stinky Tofu)
```
/imagine prompt: A plate of crispy fried Taiwanese stinky tofu (臭豆腐), golden and crackly outside, tangy pickled cabbage and sweet chili sauce alongside, street-food styling, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, plastic food, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people, blurry
```

### 베이커리 (Bakery)
```
/imagine prompt: A warm bakery display of freshly baked pastries — golden croissants, soft milk bread, pineapple buns — arranged on a wooden tray, soft morning light through a cafe window, warm terracotta and cream color palette, shallow depth of field, editorial food photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, plastic food, oversaturated, cluttered background, neon blue tones, cold lighting, text, watermark, logo, people, blurry
```

### 바/펍 (Bar/Pub)
```
/imagine prompt: An intimate bar scene, a craft cocktail glowing amber under warm pendant lighting, condensation on the glass, blurred bottles and warm string lights in the background, warm terracotta and golden tones, editorial lifestyle photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, oversaturated, neon blue tones, cold lighting, text, watermark, logo, people's faces, blurry
```

### 소품가게 (Lifestyle / Souvenir Shop)
```
/imagine prompt: A charming Taiwanese lifestyle shop corner, shelves of handcrafted ceramics, dried flowers, pastel stationery, soft warm light streaming through a window, cozy inviting atmosphere, warm terracotta and cream color palette, shallow depth of field, editorial lifestyle photography, gentle film grain --ar 4:5 --style raw --v 7 --s 120 --chaos 3 --no cartoon, illustration, 3d render, oversaturated, cold lighting, text, watermark, logo, people's faces, blurry
```

---

## 5. 웹사이트 용도별 비율 변경 치트시트

- **카테고리 카드/썸네일**: `--ar 4:5` (기본값, 위 프롬프트 그대로)
- **히어로 배너/메인 비주얼**: `--ar 16:9`
- **인스타그램 피드/정사각 썸네일**: `--ar 1:1`
- **모바일 풀스크린 배경**: `--ar 9:16`

프롬프트 텍스트는 그대로 두고 `--ar` 값만 바꿔서 재생성하면 됩니다.

---

## 6. Google Flow(Imagen) 버전 — 파라미터 없이 바로 복붙

Flow(Imagen 기반)는 Midjourney처럼 `--ar`, `--sref`, `--no` 같은 텍스트 파라미터를 해석하지 않습니다.
넣으면 그대로 프롬프트 문장으로 읽혀서 결과가 오히려 이상해질 수 있으니, 아래처럼 **파라미터를 뺀 순수 문장형**으로 입력하세요. 비율은 Flow 화면의 설정(Aspect ratio) 메뉴에서 선택합니다.

### 우육면
```
A steaming bowl of Taiwanese beef noodle soup (牛肉麵) in a deep terracotta-glazed ceramic bowl, thick hand-pulled noodles, tender braised beef chunks, rich dark glossy broth, topped with bok choy and scallions, wisps of steam rising, wooden chopsticks resting on the bowl's edge, rustic wood table, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain, blurred cozy background, no text, no watermark, no people
```

### 국수
```
A bowl of Taiwanese dry noodles (乾麵) tossed in glossy savory sauce, minced pork and pickled vegetables on top, fresh scallion garnish, warm cream ceramic bowl, chopsticks resting alongside, small side dish of blanched greens, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain, no text, no watermark, no people
```

### 일식
```
An elegant sashimi and nigiri platter on a dark slate board, glistening fresh salmon and tuna slices, small dish of soy sauce with wasabi, single delicate flower garnish, minimalist styling, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain, no text, no watermark, no people
```

### 해산물
```
A generous platter of fresh steamed prawns, clams, and crab, glistening with light garlic butter glaze, lemon wedge and herb garnish, rustic ceramic plate, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain, no text, no watermark, no people
```

### 라멘
```
A steaming bowl of rich tonkotsu ramen, jammy soft-boiled egg halved on top, chashu pork slices, nori, bamboo shoots, scallions, glossy golden broth, steam rising, dark ceramic bowl, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain, no text, no watermark, no people
```

### 훠궈
```
Overhead shot of a divided hotpot (鴛鴦鍋), spicy red broth on one side and clear mushroom broth on the other, gently simmering, surrounded by small plates of thinly sliced beef, mushrooms, leafy greens and tofu, warm terracotta and cream color palette, soft golden hour lighting, editorial food photography, gentle film grain, no text, no watermark, no people
```

### 조식
```
A cozy Taiwanese breakfast spread — golden folded egg pancake (蛋餅), a warm glass of soy milk, crispy youtiao, light wooden tray, soft morning light streaming in, warm terracotta and cream color palette, shallow depth of field, editorial food photography, gentle film grain, no text, no watermark, no people
```

### 브런치
```
A bright brunch table with fluffy pancakes drizzled with honey, fresh berries, soft poached egg on avocado toast, latte with delicate foam art, soft natural morning light, warm terracotta and cream color palette, shallow depth of field, editorial food photography, gentle film grain, no text, no watermark, no people
```

### 카페
```
A cozy boutique cafe corner in Taipei, latte with soft foam art on a marble table, slice of cake on a small plate, warm ambient light through a window, potted plant softly blurred in background, warm terracotta and cream color palette, shallow depth of field, editorial lifestyle photography, gentle film grain, no text, no watermark, no visible faces
```

### 빙수
```
A towering mountain of fluffy mango shaved ice, generous fresh mango cubes, condensed milk drizzle, small scoop of mango sorbet, wide ceramic bowl, soft pastel background, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain, no text, no watermark, no people
```

### 한식
```
A vibrant bibimbap in a stone bowl, colorful julienned vegetables, marinated beef, sunny fried egg on top, dollop of gochujang, small banchan side dishes around, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain, no text, no watermark, no people
```

### 파스타
```
An elegant plate of creamy truffle pasta twirled neatly at the center of a white ceramic plate, fresh herb garnish, shaved parmesan, warm restaurant lighting, warm terracotta and cream color palette, shallow depth of field, editorial food photography, gentle film grain, no text, no watermark, no people
```

### BBQ
```
A sizzling BBQ grill plate with marinated beef short ribs and pork belly over open flame, smoky char marks, small side dishes around, warm smoky ambiance, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain, no text, no watermark, no people
```

### 스테이크
```
A perfectly seared steak with deep caramelized crust, sliced to reveal a juicy medium-rare center, dark plate, sprig of rosemary, small pool of pan sauce, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain, no text, no watermark, no people
```

### 딤섬
```
A bamboo steamer basket filled with delicate translucent xiaolongbao and shrimp dumplings, steam gently rising, soy sauce dish with ginger julienne alongside, warm wooden table, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain, no text, no watermark, no people
```

### 거위
```
A platter of glossy Taiwanese roast goose (鵝肉), skin lacquered deep amber and crisp, neatly sliced over a bed of greens, small dish of tangy dipping sauce, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain, no text, no watermark, no people
```

### 노점
```
A bustling Taiwanese night market food stall at dusk, warm string lights and red lanterns glowing, steam rising from sizzling street food on a griddle, blurred colorful signage in the background, warm terracotta and golden tones, editorial travel photography, gentle film grain, no text, no watermark, no visible faces
```

### 마트
```
A neatly organized Taiwanese convenience store shelf, colorful snack packaging and drinks under warm ambient light, softly blurred hand reaching for a product, warm terracotta and cream color palette, shallow depth of field, editorial lifestyle photography, gentle film grain, no text, no watermark, no visible faces
```

### 과일
```
An abundant display of fresh tropical Taiwanese fruits — mango, guava, dragon fruit, lychee — arranged in a woven basket, soft natural light highlighting vivid colors, warm terracotta and cream color palette, shallow depth of field, editorial food photography, gentle film grain, no text, no watermark, no people
```

### 태국
```
A vibrant bowl of tom yum goong, fragrant with lemongrass and chili, glistening prawns, fresh herbs floating on top, warm ceramic bowl, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain, no text, no watermark, no people
```

### 베트남
```
A steaming bowl of pho with thinly sliced rare beef, fresh herbs, bean sprouts and lime on the side, clear fragrant broth, chopsticks resting on the bowl, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain, no text, no watermark, no people
```

### 인도
```
A warm platter of butter chicken curry with rich orange-red sauce, fluffy naan bread, scoop of basmati rice, fresh cilantro garnish, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain, no text, no watermark, no people
```

### 대만식
```
Classic Taiwanese three-cup chicken (三杯雞) in a sizzling clay pot, glossy dark soy-sesame glaze, fresh basil leaves scattered on top, rustic table setting, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain, no text, no watermark, no people
```

### 피자
```
A rustic wood-fired margherita pizza, bubbling melted mozzarella, fresh basil leaves, charred leopard-spotted crust, wooden pizza board, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain, no text, no watermark, no people
```

### 취두부
```
A plate of crispy fried Taiwanese stinky tofu (臭豆腐), golden and crackly outside, tangy pickled cabbage and sweet chili sauce alongside, street-food styling, warm terracotta and cream color palette, soft golden hour lighting, shallow depth of field, editorial food photography, gentle film grain, no text, no watermark, no people
```

### 베이커리
```
A warm bakery display of freshly baked pastries — golden croissants, soft milk bread, pineapple buns — arranged on a wooden tray, soft morning light through a cafe window, warm terracotta and cream color palette, shallow depth of field, editorial food photography, gentle film grain, no text, no watermark, no people
```

### 바/펍
```
An intimate bar scene, a craft cocktail glowing amber under warm pendant lighting, condensation on the glass, blurred bottles and warm string lights in the background, warm terracotta and golden tones, editorial lifestyle photography, gentle film grain, no text, no watermark, no visible faces
```

### 소품가게
```
A charming Taiwanese lifestyle shop corner, shelves of handcrafted ceramics, dried flowers, pastel stationery, soft warm light streaming through a window, cozy inviting atmosphere, warm terracotta and cream color palette, shallow depth of field, editorial lifestyle photography, gentle film grain, no text, no watermark, no visible faces
```

---

## 7. Flow에서 효율적으로 28장 생성하는 순서

1. **앵커 이미지 먼저 확정**: "우육면" 프롬프트로 3~4장 뽑아서 톤(색감·조명·질감)이 가장 마음에 드는 1장을 고른다. 이 1장이 이후 27장의 기준이 된다.
2. **참조 이미지로 재사용**: Flow의 이미지 생성 화면에는 레퍼런스/Ingredient로 이미지를 업로드해 스타일을 이어가는 기능이 있다. 앵커 이미지를 업로드하고 그 다음 프롬프트 텍스트를 함께 넣으면 색감·조명이 훨씬 잘 유지된다. (버튼 명칭은 업데이트에 따라 다를 수 있으니 "이미지 추가/참조" 계열 옵션을 찾으면 됨)
3. **문구는 절대 손대지 않기**: 위 28개 프롬프트의 공통 문구(`warm terracotta and cream color palette, soft golden hour lighting, editorial food photography, gentle film grain`)는 토씨 하나 안 바꾸고 그대로 유지한다. Imagen류 모델은 MJ보다 프롬프트 문장을 더 문자 그대로 반영하기 때문에, 이 반복 문구가 톤을 통일시키는 실질적 장치다.
4. **비슷한 구도끼리 묶어서 진행**: 음식 클로즈업 계열(우육면~취두부)을 먼저 몰아서 생성하고, 공간/장소 계열(노점·마트·카페·바/펍·소품가게·베이커리)을 나중에 묶어서 진행한다. 중간에 설정(비율 등)을 왔다갔다 바꿀 일이 줄어든다.
5. **한 프롬프트당 여러 장 뽑고 즉시 고르기**: Flow는 보통 한 번에 여러 장(보통 2~4장)을 생성해준다. 매번 바로 톤이 맞는 1장만 골라 저장하고 넘어가면, 나중에 몰아서 고르는 것보다 판단 기준이 흔들리지 않는다.
6. **최종 안전장치 — 후보정**: 28장을 다 고른 뒤, Photoshop/Lightroom(또는 무료 대안인 Photopea)에서 동일한 보정 프리셋 1개를 28장 전체에 일괄 적용한다. 생성 모델이 매번 미세하게 다른 색온도를 낼 수밖에 없는데, 이 마지막 일괄 보정 한 번이 "같은 화보에서 찍은 것 같은" 통일감을 사실상 완성시켜준다.

---

## 8. 홈페이지 메인 히어로 이미지 프롬프트

메인 히어로는 카테고리 이미지보다 훨씬 크게, 오래 노출되는 자리라 화질과 구도가 더 중요합니다. 컨셉이 다른 3가지 옵션을 준비했으니 사이트 톤에 맞는 걸 고르세요. (전부 Flow용 파라미터 없는 문장형)

### 옵션 A — 노점 야시장 파노라마 (도착의 설렘)
```
A wide cinematic shot of a vibrant Taiwanese night market street at golden dusk, rows of glowing red lanterns and warm string lights stretching into the distance, soft blurred silhouette of a young woman seen from behind walking through the market in a light jacket, steam rising from food stalls on both sides, colorful shop signage softly blurred in the background, warm terracotta and golden color palette, cinematic wide angle, editorial travel photography, shallow depth of field, gentle film grain, ultra high resolution, highly detailed, no text, no watermark, no visible faces
```
→ 추천 비율: 데스크톱 `16:9`~`21:9`, 모바일 `9:16`

### 옵션 B — "지도 위의 음식들" 플랫레이 (사이트 컨셉과 가장 직결) ⭐ 추천
```
An overhead flat lay of a wooden table styled as a food journey map, a vintage-style illustrated map of Taiwan laid flat at the center, small ceramic bowls of iconic Taiwanese dishes arranged along the route — beef noodle soup, xiaolongbao dumplings, bubble tea, mango shaved ice — wooden chopsticks, a small brass compass and dried flowers as props, warm terracotta and cream color palette, soft golden hour lighting from one side, editorial flat lay photography, gentle film grain, ultra high resolution, highly detailed, no text, no watermark, no people
```
→ 추천 비율: 데스크톱 `16:9`, 정사각 SNS 홍보용 `1:1`

### 옵션 C — 시그니처 요리 클로즈업 + 타이베이 야경 보케 (감성 극대화)
```
A close-up of a beautifully plated bowl of Taiwanese beef noodle soup in the foreground with steam gently rising, softly out of focus, behind it a dreamy warm bokeh of blurred Taipei night market lanterns and neon signage glowing amber and coral, shallow depth of field, editorial food photography, cinematic warm lighting, gentle film grain, ultra high resolution, highly detailed, no text, no watermark, no people
```
→ 추천 비율: 데스크톱 `16:9`, 모바일 히어로 `4:5`

## 9. 지역별 탐험(6개 도시) 대표 이미지 프롬프트 — Google Flow용

지금 `지역별 탐험` 카드는 음식 카테고리 사진을 임시로 재사용 중입니다. 아래는 각 도시의 정체성(REGION_CONTENT의 소개글·하이라이트 기준)을 담은 도시 풍경/랜드마크 프롬프트입니다. 파라미터 없는 문장형(Flow용)이고, 카드 비율은 `4:5`로 생성하세요.

파일은 생성 후 `assets/images/regions/{지역id}.jpeg`로 저장해서 전달해주시면, `js/data.js`의 REGIONS `image` 경로를 새 파일로 바로 교체해드릴게요. (id: taipei / kaohsiung / taichung / tainan / hualien / yilan)

### 타이베이 (Taipei) — 미식의 성지
```
A cinematic golden hour skyline view of Taipei 101 tower rising above the city, seen from a rooftop terrace with warm string lights and soft silhouettes of potted plants in the foreground, glowing warm-toned buildings stretching into a soft hazy distance, warm terracotta and golden color palette, editorial travel photography, shallow depth of field, gentle film grain, ultra high resolution, highly detailed, no text, no watermark, no visible faces
```

### 가오슝 (Kaohsiung) — 항구 도시의 활기
```
A warm golden hour view along the Love River waterfront in Kaohsiung, the 85 Sky Tower glowing softly in the distance and reflected on calm water, a row of palm trees and outdoor riverside café tables in soft focus in the foreground, gentle warm light, warm terracotta and golden color palette, editorial travel photography, shallow depth of field, gentle film grain, ultra high resolution, highly detailed, no text, no watermark, no visible faces
```

### 타이중 (Taichung) — 버블티의 고향
```
A relaxed tree-lined promenade in Taichung at golden hour, dappled warm sunlight filtering through leafy branches onto a paved path, an independent café's outdoor rattan chairs and small round table softly blurred to one side, a bicycle leaning against a lamppost, warm terracotta and cream color palette, editorial travel photography, shallow depth of field, gentle film grain, ultra high resolution, highly detailed, no text, no watermark, no visible faces
```

### 타이난 (Tainan) — 옛 수도의 손맛
```
A narrow old-town alley in Tainan at warm dusk, traditional red-brick buildings and a weathered temple roofline with ornate details, red lanterns glowing softly overhead, warm ambient light spilling from a small shopfront, quiet and nostalgic atmosphere, warm terracotta and golden color palette, editorial travel photography, shallow depth of field, gentle film grain, ultra high resolution, highly detailed, no text, no watermark, no visible faces
```

### 화롄 (Hualien) — 타이루거 맛집 탐험
```
A dramatic view inside Taroko Gorge, towering marble cliff walls rising on either side of a turquoise river, a narrow pedestrian bridge crossing the canyon, soft warm afternoon light catching the rock texture, lush greenery clinging to the cliffside, epic and serene natural landscape, warm terracotta and golden color palette, editorial travel photography, gentle film grain, ultra high resolution, highly detailed, no text, no watermark, no visible faces
```

### 이란 (Yilan) — 뤄둥 야시장 & 온천
```
A peaceful rural scene in Yilan at golden hour, vivid green rice paddies stretching toward misty mountains in the distance, a traditional wooden farmhouse and scattered scallion fields in the foreground, soft warm light and gentle haze, tranquil countryside atmosphere, warm terracotta and cream color palette, editorial travel photography, shallow depth of field, gentle film grain, ultra high resolution, highly detailed, no text, no watermark, no visible faces
```

### 지우펀 (Jiufen) — 예류·스펀·진과스 북동부 해안 탐험

```
A misty evening view down the famous narrow stone stairway street of Jiufen, rows of red paper lanterns glowing warmly overhead between old wooden teahouses, soft warm light spilling from shopfront windows, distant mountains and the sea faintly visible through evening haze, nostalgic and atmospheric, warm terracotta and golden color palette, editorial travel photography, shallow depth of field, gentle film grain, ultra high resolution, highly detailed, no text, no watermark, no visible faces
```

### 타이동 (Taitung) — 동부 해안의 여유

```
A serene golden hour view over Taitung's Luye Highland, a cluster of many colorful hot air balloons floating together above a vast open grassy meadow, low rolling green hills in the distance, no ocean or coastline visible, warm hazy light, wide open peaceful landscape with no paths, trails, or people, relaxed slow-travel atmosphere, warm terracotta and cream color palette, editorial travel photography, shallow depth of field, gentle film grain, ultra high resolution, highly detailed, no text, no watermark, no people, no visible faces
```

### 아리산 (Alishan) — 알프스 일출·삼림열차

```
A dreamlike sunrise over Alishan's sea of clouds, a vintage narrow-gauge forest railway train winding through misty cypress and pine forest, soft golden morning light filtering through tall trees, layered mountain ridges fading into the mist in the distance, tranquil alpine atmosphere, warm terracotta and soft golden color palette, editorial travel photography, shallow depth of field, gentle film grain, ultra high resolution, highly detailed, no text, no watermark, no visible faces
```

---

### 고화질로 뽑는 팁
- 프롬프트 끝에 `ultra high resolution, highly detailed`를 넣어두면 Flow가 텍스처를 더 촘촘하게 렌더링합니다.
- Flow 생성 결과가 웹 히어로 배너로 쓰기엔 해상도가 부족하면(가로 1920px 미만), 생성 후 Topaz Gigapixel / Photoshop의 Super Resolution / 무료 대안 Upscayl 같은 AI 업스케일러로 2~4배 확대하세요 — 원본 구도·색감은 그대로 유지되면서 해상도만 커집니다.
- 히어로는 텍스트(로고, 카피)가 얹힐 자리이므로, 화면 상단이나 좌측 1/3 정도는 비교적 단순한 영역(하늘, 흐린 배경)이 되도록 여러 장 뽑아서 텍스트 얹기 좋은 구도를 고르세요.
- 옵션 B(플랫레이)는 카테고리 이미지들과 같은 톤·소품(라탄, 도자기, 나무 테이블)을 공유하므로 전체 사이트 통일감이 가장 자연스럽게 이어집니다.

