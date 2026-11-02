INSERT INTO users (id, name, email, password_hash, role)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Admin Bilcode', 'admin@bilcode.id', crypt('password123', gen_salt('bf')), 'admin'),
    ('22222222-2222-2222-2222-222222222222', 'Pengguna Demo', 'user@bilcode.id', crypt('password123', gen_salt('bf')), 'user')
ON CONFLICT (email) DO NOTHING;

INSERT INTO waste_reports (user_id, image_url, category, confidence, description, latitude, longitude, status, created_at, updated_at)
SELECT '22222222-2222-2222-2222-222222222222', '/uploads/sample_plastic_1.jpg', 'Plastic Waste', 0.92,
       'Tumpukan kantong plastik berserakan di tepi Jalan Pandanaran dekat pasar.',
       -6.98550000::NUMERIC(10, 8), 110.42310000::NUMERIC(11, 8), 'Pending',
       now() - interval '9 hours', now() - interval '9 hours'
WHERE NOT EXISTS (SELECT 1 FROM waste_reports WHERE image_url = '/uploads/sample_plastic_1.jpg');

INSERT INTO waste_reports (user_id, image_url, category, confidence, description, latitude, longitude, status, created_at, updated_at)
SELECT '22222222-2222-2222-2222-222222222222', '/uploads/sample_plastic_2.jpg', 'Plastic Waste', 0.84,
       'Botol plastik bekas minuman menumpuk di dekat halte Trans Semarang Setiabudi.',
       -6.99123456::NUMERIC(10, 8), 110.41123456::NUMERIC(11, 8), 'In Progress',
       now() - interval '26 hours', now() - interval '26 hours'
WHERE NOT EXISTS (SELECT 1 FROM waste_reports WHERE image_url = '/uploads/sample_plastic_2.jpg');

INSERT INTO waste_reports (user_id, image_url, category, confidence, description, latitude, longitude, status, created_at, updated_at)
SELECT '22222222-2222-2222-2222-222222222222', '/uploads/sample_organic_1.jpg', 'Organic Waste', 0.88,
       'Sisa sayur dan daun kering terkumpul di belakang Pasar Johar.',
       -7.00345678::NUMERIC(10, 8), 110.43876543::NUMERIC(11, 8), 'Completed',
       now() - interval '3 days 2 hours', now() - interval '3 days 2 hours'
WHERE NOT EXISTS (SELECT 1 FROM waste_reports WHERE image_url = '/uploads/sample_organic_1.jpg');

INSERT INTO waste_reports (user_id, image_url, category, confidence, description, latitude, longitude, status, created_at, updated_at)
SELECT '22222222-2222-2222-2222-222222222222', '/uploads/sample_organic_2.jpg', 'Organic Waste', 0.95,
       'Rumput potongan dan sampah organik kantin kampus ditumpuk di area parkir.',
       -7.00891234::NUMERIC(10, 8), 110.44523456::NUMERIC(11, 8), 'Completed',
       now() - interval '5 days 4 hours', now() - interval '5 days 4 hours'
WHERE NOT EXISTS (SELECT 1 FROM waste_reports WHERE image_url = '/uploads/sample_organic_2.jpg');

INSERT INTO waste_reports (user_id, image_url, category, confidence, description, latitude, longitude, status, created_at, updated_at)
SELECT '22222222-2222-2222-2222-222222222222', '/uploads/sample_paper_1.jpg', 'Paper Waste', 0.86,
       'Kardus bekas pengiriman menumpuk di gang depan minimarket Tanjung Mas.',
       -6.97789012::NUMERIC(10, 8), 110.41965321::NUMERIC(11, 8), 'Pending',
       now() - interval '12 hours', now() - interval '12 hours'
WHERE NOT EXISTS (SELECT 1 FROM waste_reports WHERE image_url = '/uploads/sample_paper_1.jpg');

INSERT INTO waste_reports (user_id, image_url, category, confidence, description, latitude, longitude, status, created_at, updated_at)
SELECT '22222222-2222-2222-2222-222222222222', '/uploads/sample_paper_2.jpg', 'Paper Waste', 0.87,
       'Tumpukan koran bekas tercampur sampah dapur sehingga tidak layak didaur ulang.',
       -6.96012345::NUMERIC(10, 8), 110.46198765::NUMERIC(11, 8), 'Rejected',
       now() - interval '7 days 5 hours', now() - interval '7 days 5 hours'
WHERE NOT EXISTS (SELECT 1 FROM waste_reports WHERE image_url = '/uploads/sample_paper_2.jpg');
