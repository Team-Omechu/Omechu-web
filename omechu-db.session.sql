-- UPDATE user -- SET email = 'user@example.com'
-- SET email = 'omechu@naver.com', name = '김덕환', password = 'User1234!', profileImageUrl = 'https://omechu-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/409b45ff-414f-4e11-81ea-a23f040193da.jpg'
-- WHERE id = 25;


-- DELETE FROM `user`
-- WHERE `id` IN (19, 20, 61);


-- -- 약관 동의 내역 추가
-- INSERT INTO `agreement_consent` (user_id, terms_of_service, privacy_policy, location_service, is_over14, created_at)
-- VALUES (25, TRUE, TRUE, TRUE, TRUE, NOW())
-- ON DUPLICATE KEY UPDATE -- 이미 데이터가 있으면 업데이트
--   terms_of_service = VALUES(terms_of_service),
--   privacy_policy = VALUES(privacy_policy),
--   location_service = VALUES(location_service),
--   is_over14 = VALUES(is_over14);

-- -- 알레르기 정보 추가 (2개)
-- -- 참고: "달걀(난류) 알레르기", "우유 알레르기", "갑각류 알레르기", "해산물 알레르기", "견과류 알레르기"
-- INSERT IGNORE INTO `allergy` (userId, allergy) VALUES (25, '갑각류 알레르기');
-- INSERT IGNORE INTO `allergy` (userId, allergy) VALUES (25, '견과류 알레르기');

-- -- 선호 음식 정보 추가 (2개)
-- -- 참고: "한식", "양식", "중식", "일식", "다른나라"
-- INSERT IGNORE INTO `prefer` (userId, prefer) VALUES (25, '한식');
-- INSERT IGNORE INTO `prefer` (userId, prefer) VALUES (25, '일식');

-- -- 먹부림(식사 기록) 내역 추가 (3개)
-- -- 주의: '김치찌개', '돈까스', '된장찌개' 메뉴가 `menu` 테이블에 있어야 합니다. 없으면 다른 메뉴로 변경해주세요.
-- INSERT IGNORE INTO `mukburim` (user_id, menu_name, `date`) VALUES
-- (25, '김치찌개', NOW() - INTERVAL 1 DAY),
-- (25, '돈까스', NOW() - INTERVAL 3 DAY),
-- (25, '된장찌개', NOW() - INTERVAL 5 DAY);

-- -- 리뷰 작성 내역 추가
-- -- 주의: rest_id=1인 음식점이 `restaurant` 테이블에 있어야 합니다. 없으면 다른 ID로 변경해주세요.
-- INSERT IGNORE INTO `review` (user_id, rest_id, rating, tag, `text`, created_at, `like`)
-- VALUES (25, 1, 4, '{"tags": ["#분위기좋은", "#가성비"]}', '여기 정말 맛있어요! 분위기도 좋고, 또 오고 싶네요.', NOW(), 5);

-- -- 음식점 찜(즐겨찾기) 내역 추가
-- -- 주의: rest_id=2인 음식점이 `restaurant` 테이블에 있어야 합니다. 없으면 다른 ID로 변경해주세요.
-- INSERT IGNORE INTO `zzim` (user_id, rest_id, created_at) VALUES (25, 2, NOW());

-- -- 최근 방문한 음식점 내역 추가
-- -- 주의: rest_id=1인 음식점이 `restaurant` 테이블에 있어야 합니다. 없으면 다른 ID로 변경해주세요.
-- INSERT IGNORE INTO `user_rest` (user_id, rest_id) VALUES (25, 1);

-- -- 추천 제외 메뉴 추가
-- -- 주의: menu_id=1인 메뉴가 `menu` 테이블에 있어야 합니다. 없으면 다른 ID로 변경해주세요.
-- INSERT IGNORE INTO `recommend_except` (menu_id, user_id, bit) VALUES (1, 25, TRUE);

-- -- 메뉴 조회 기록 추가
-- -- 주의: '파스타' 메뉴가 `menu` 테이블에 있어야 합니다. 없으면 다른 메뉴로 변경해주세요.
-- INSERT IGNORE INTO `menu_view_time` (user_id, menu_name, `time`) VALUES (25, '파스타', NOW());

-- SELECT '25번 사용자에 대한 더미 데이터 생성이 완료되었습니다.' AS '결과';

-- -- 사용자 ID 25번의 먹부림(식사 기록) 데이터를 대량으로 추가합니다.
-- -- menu 테이블에 존재하는 메뉴 이름들을 사용하여 지난 한 달간의 기록으로 생성합니다.
-- INSERT INTO `mukburim` (user_id, menu_name, `date`) VALUES
-- (25, '김치찌개', NOW() - INTERVAL 29 DAY),
-- (25, '삼겹살', NOW() - INTERVAL 28 DAY),
-- (25, '피자', NOW() - INTERVAL 27 DAY),
-- (25, '라면', NOW() - INTERVAL 26 DAY),
-- (25, '치킨', NOW() - INTERVAL 25 DAY),
-- (25, '제육볶음', NOW() - INTERVAL 24 DAY),
-- (25, '된장찌개', NOW() - INTERVAL 23 DAY),
-- (25, '떡볶이', NOW() - INTERVAL 22 DAY),
-- (25, '까르보나라 파스타', NOW() - INTERVAL 21 DAY),
-- (25, '초밥', NOW() - INTERVAL 20 DAY),
-- (25, '불고기', NOW() - INTERVAL 19 DAY),
-- (25, '햄버거', NOW() - INTERVAL 18 DAY),
-- (25, '짜장면', NOW() - INTERVAL 17 DAY),
-- (25, '짬뽕', NOW() - INTERVAL 16 DAY),
-- (25, '족발', NOW() - INTERVAL 15 DAY),
-- (25, '보쌈', NOW() - INTERVAL 14 DAY),
-- (25, '스테이크', NOW() - INTERVAL 13 DAY),
-- (25, '비빔밥', NOW() - INTERVAL 12 DAY),
-- (25, '우동', NOW() - INTERVAL 11 DAY),
-- (25, '갈비탕', NOW() - INTERVAL 10 DAY),
-- (25, '돈까스', NOW() - INTERVAL 9 DAY),
-- (25, '마라탕', NOW() - INTERVAL 8 DAY),
-- (25, '쌀국수', NOW() - INTERVAL 7 DAY),
-- (25, '닭갈비', NOW() - INTERVAL 6 DAY),
-- (25, '순두부찌개', NOW() - INTERVAL 5 DAY),
-- (25, '카레라이스', NOW() - INTERVAL 4 DAY),
-- (25, '냉면', NOW() - INTERVAL 3 DAY),
-- (25, '김치볶음밥', NOW() - INTERVAL 2 DAY),
-- (25, '샌드위치', NOW() - INTERVAL 1 DAY);

-- SELECT '25번 사용자에 대한 먹부림 데이터 29건이 추가되었습니다.' AS '결과';

-- Select Name from menu;

-- -- 25번 사용자의 먹부림 데이터에 중복이 있는지 확인하는 쿼리
-- SELECT
--     user_id,
--     menu_name,
--     DATE(date) AS '날짜',
--     COUNT(*) AS '개수'
-- FROM
--     mukburim
-- WHERE
--     user_id = 25
-- GROUP BY
--     user_id, menu_name, DATE(date)
-- HAVING
--     COUNT(*) > 1;

-- user_id 25번 사용자의 mukburim 테이블에서 중복된 데이터를 제거합니다.
-- 중복 기준: menu_name, 그리고 날짜(시간 제외)가 동일한 경우
-- 각 중복 그룹에서 가장 먼저 생성된(id가 가장 작은) 데이터만 남기고 나머지를 삭제합니다.

-- DELETE t1 FROM `mukburim` AS t1
-- INNER JOIN `mukburim` AS t2
-- WHERE
--   t1.id > t2.id AND -- 나중에 추가된 데이터(id가 더 큼)를 선택
--   t1.user_id = 25 AND -- 25번 사용자에게만 한정
--   t1.user_id = t2.user_id AND
--   t1.menu_name = t2.menu_name AND
--   DATE(t1.date) = DATE(t2.date); -- 날짜(시간 제외)가 동일한 경우

-- SELECT '25번 사용자의 중복 먹부림 데이터 정리가 완료되었습니다.' AS '결과';

-- -- 사용자 ID 25번이 여러 메뉴를 조회한 기록을 추가합니다.
-- -- 최근 며칠간 다양한 메뉴의 상세 정보를 확인한 것처럼 데이터를 생성합니다.
-- INSERT INTO `menu_view_time` (user_id, menu_name, `time`) VALUES
-- (25, '해물파전', NOW() - INTERVAL 5 DAY),
-- (25, '감바스', NOW() - INTERVAL 4 DAY),
-- (25, '마제소바', NOW() - INTERVAL 3 DAY),
-- (25, '쌀국수', NOW() - INTERVAL 2 DAY),
-- (25, '함박스테이크', NOW() - INTERVAL 1 DAY),
-- (25, '타코', NOW() - INTERVAL 12 HOUR),
-- (25, '리조토', NOW() - INTERVAL 6 HOUR),
-- (25, '김치찌개', NOW() - INTERVAL 3 HOUR),
-- (25, '피자', NOW() - INTERVAL 1 HOUR);

-- SELECT '25번 사용자에 대한 메뉴 조회 기록(menu_view_time) 데이터 9건이 추가되었습니다.' AS '결과';

-- 사용자 ID 25번이 다른 사용자의 리뷰를 신고하는 더미 데이터를 추가합니다.
-- 주의: 아래 쿼리에서 사용된 review_id (35, 36, 37)가 `review` 테이블에 존재해야 합니다.
-- 만약 해당 review_id가 없으면, `review` 테이블에서 다른 사용자가 작성한 리뷰의 ID로 변경해주세요.

-- INSERT INTO `report` (user_id, review_id, `text`) VALUES
-- (25, 35, '광고/홍보성 내용이 포함되어 있습니다.'),
-- (25, 36, '부적절한 언어(욕설, 비방)가 사용되었습니다.'),
-- (25, 37, '음식과 관련 없는 내용입니다.');

-- SELECT '25번 사용자에 대한 리뷰 신고 기록(report) 데이터 3건이 추가되었습니다.' AS '결과';

-- 사용자 ID 25번에 대한 리뷰(review) 데이터를 대량으로 추가합니다.
-- 여러 음식점에 대한 다양한 내용과 평가를 포함하여 현실적인 데이터를 생성합니다.
-- 주의: 아래의 rest_id (1, 2, 3, 4, 5)가 restaurant 테이블에 존재해야 합니다.

-- INSERT INTO `review` (user_id, rest_id, rating, tag, `text`, created_at, `like`) VALUES
-- -- 1번 음식점에 대한 리뷰들
-- (25, 1, 5, '["#데이트", "#분위기", "#인생맛집"]', '파스타랑 스테이크 정말 맛있었어요! 기념일에 방문했는데 분위기도 좋고 완벽한 저녁이었습니다.', NOW() - INTERVAL 30 DAY, 15),
-- (25, 1, 4, '["#재방문의사있음", "#친절"]', '두 번째 방문입니다. 여전히 맛있고 직원분들도 친절해서 좋아요.', NOW() - INTERVAL 10 DAY, 8),

-- -- 2번 음식점에 대한 리뷰들
-- (25, 2, 3, '["#가성비", "#점심"]', '가격은 저렴하지만 맛은 평범했어요. 한 끼 간단히 해결하기엔 괜찮습니다.', NOW() - INTERVAL 25 DAY, 2),
-- (25, 2, 2, '["#솔직리뷰"]', '기대가 너무 컸는지 실망스러웠습니다. 위생이 조금 아쉬웠어요.', NOW() - INTERVAL 5 DAY, 0),

-- -- 3번 음식점에 대한 리뷰들
-- (25, 3, 5, '["#가족외식", "#고기맛집"]', '부모님 모시고 갔는데 정말 좋아하셨어요. 고기 질도 좋고 반찬도 다 맛있네요!', NOW() - INTERVAL 20 DAY, 22),
-- (25, 3, 5, '["#회식장소추천", "#주차편리"]', '회사 사람들이랑 다 같이 방문했는데 다들 만족했습니다. 주차 공간도 넉넉해서 편했어요.', NOW() - INTERVAL 18 DAY, 11),
-- (25, 3, 4, '["#친구랑"]', '친구 추천으로 왔는데 괜찮네요! 볶음밥이 별미입니다.', NOW() - INTERVAL 2 DAY, 5),

-- -- 4번 음식점에 대한 리뷰들
-- (25, 4, 4, '["#디저트맛집", "#뷰맛집"]', '커피랑 케이크가 맛있고, 창밖으로 보이는 뷰가 예뻐서 데이트하기 좋은 곳이에요.', NOW() - INTERVAL 12 DAY, 18),
-- (25, 4, 3, '["#주말엔사람많음"]', '주말에 갔더니 사람이 너무 많아서 정신이 없었어요. 평일에 가는 걸 추천합니다.', NOW() - INTERVAL 4 DAY, 3),

-- -- 5번 음식점에 대한 리뷰들
-- (25, 5, 5, '["#숨은맛집", "#혼밥"]', '혼자 조용히 밥 먹고 싶을 때 가는 곳. 여기 국밥은 정말 최고예요.', NOW() - INTERVAL 16 DAY, 9),
-- (25, 5, 4, '["#해장"]', '어제 과음하고 해장하러 갔는데 속이 다 풀렸습니다.', NOW() - INTERVAL 8 DAY, 6),
-- (25, 5, 5, '["#단골집"]', '일주일에 한 번은 꼭 가는 제 최애 맛집입니다. 강력 추천!', NOW() - INTERVAL 1 DAY, 12);

-- SELECT '25번 사용자에 대한 리뷰 데이터 12건이 추가되었습니다.' AS '결과';

-- 사용자 ID 25번이 여러 음식점을 '찜'한 기록을 추가합니다.
-- 주의: 아래의 rest_id (1, 3, 7, 12, 117)가 restaurant 테이블에 존재해야 합니다.

INSERT INTO `zzim` (user_id, rest_id, created_at) VALUES
(25, 1, NOW() - INTERVAL 15 DAY),
(25, 3, NOW() - INTERVAL 10 DAY),
(25, 7, NOW() - INTERVAL 5 DAY),
(25, 12, NOW() - INTERVAL 2 DAY),
(25, 117, NOW() - INTERVAL 1 DAY);

SELECT '25번 사용자에 대한 찜(zzim) 데이터 5건이 추가되었습니다.' AS '결과';