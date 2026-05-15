-- Insert 3 Test Blog Posts for TimorList
-- Run: npx wrangler d1 execute timorlist-db --remote --file=migrations/0044_insert_test_blogs.sql

-- Coffee Shops Blog
INSERT INTO blog_posts (id, title, slug, excerpt, content, author_name, status, tags, published_at, created_at, updated_at)
VALUES (
  'blog-coffee-dili-001',
  'Best Coffee Spots in Dili: A Local''s Guide',
  'best-coffee-spots-in-dili',
  'Dili, the sunny capital of Timor-Leste, is home to a thriving coffee culture rooted in the country''s world-renowned coffee beans. Here are the top 3 must-visit coffee shops.',
  '<h2>Best Coffee Spots in Dili: A Local''s Guide</h2><p>Dili, the sunny capital of Timor-Leste, is home to a thriving coffee culture rooted in the country''s world-renowned coffee beans. Here are the top 3 must-visit coffee shops that showcase the best of Timorese coffee.</p><h3>1. Cafe Brisa Serena</h3><p>Located by the waterfront, Cafe Brisa Serena offers stunning ocean views paired with freshly brewed Timorese coffee. Their signature "Kafe Timor" - a smooth, medium roast made from locally sourced Arabica beans - is a must-try.</p><p><strong>Average price:</strong> $2-4 USD</p><p><strong>Must try:</strong> Kafe Timor, Iced Coffee with Condensed Milk</p><p><strong>Location:</strong> Waterfront, Dili</p><h3>2. Coffee To Go</h3><p>This cozy downtown spot specializes in traditional Timorese brewing methods. Try their robusta espresso or the refreshing iced coffee with condensed milk. Popular with locals and expats alike.</p><p><strong>Average price:</strong> $1-3 USD</p><p><strong>Must try:</strong> Traditional Robusta Espresso, Timor Cold Brew</p><p><strong>Location:</strong> Downtown Dili</p><h3>3. The Coffee Club</h3><p>A modern cafe near President Palace serving specialty coffee drinks alongside fresh pastries. Their cold brew is perfect for hot afternoons. Great WiFi makes it ideal for digital nomads.</p><p><strong>Average price:</strong> $3-6 USD</p><p><strong>Must try:</strong> Signature Cold Brew, Cappuccino</p><p><strong>Location:</strong> Near President Palace</p><h3>Why Timor-Leste Coffee?</h3><p>Timor-Leste is one of the world''s newest coffee-producing countries, but it has quickly gained recognition for its high-quality Arabica beans. The country''s unique terroir and traditional farming methods result in coffee with distinctive fruity and floral notes.</p><p>Whether you''re a coffee connoisseur or just looking for a great cup, Dili''s coffee scene has something for everyone. Support local cafes and enjoy the best of Timorese coffee culture!</p>',
  'TimorList',
  'published',
  '["Coffee", "Dili", "Travel", "Food"]',
  1750108800000,
  1750108800000,
  1750108800000
);

-- Attractions Blog
INSERT INTO blog_posts (id, title, slug, excerpt, content, author_name, status, tags, published_at, created_at, updated_at)
VALUES (
  'blog-attractions-001',
  'Must-Visit Natural Wonders in Timor-Leste''s Capital',
  'must-visit-natural-wonders-in-dili',
  'Dili offers breathtaking landscapes and cultural landmarks. Here are the top attractions you must visit when exploring Timor-Leste''s beautiful capital.',
  '<h2>Must-Visit Natural Wonders in Timor-Leste''s Capital</h2><p>Dili, the vibrant capital of Timor-Leste, offers breathtaking landscapes and cultural landmarks. From sacred mountains to pristine beaches, here are the top attractions you must visit.</p><h3>1. Cristo Rei - The Statue of Christ the King</h3><p>The iconic 27-meter statue of Christ the King overlooks Dili Bay, offering one of the most spectacular views in all of Southeast Asia. Take the 500 steps to the viewpoint for panoramic city and ocean vistas, especially stunning at sunset.</p><p><strong>Tips:</strong> Visit at sunset for the best photo opportunities. Bring water for the climb!</p><h3>2. Dili Beach (Praia de Dili)</h3><p>The city''s main beach is perfect for morning walks, swimming, and watching local fishermen at work. The golden sunrise views are legendary among photographers and locals alike.</p><p><strong>Activities:</strong> Swimming, jogging, fishing, watching the sunrise</p><h3>3. Areia Branca Beach</h3><p>Head east of Dili for white sand beaches and turquoise waters. Areia Branca offers some of the most pristine beaches in Southeast Asia, just 2-3 hours from the capital.</p><p><strong>Best time:</strong> Dry season (May to November)</p><h3>4. Lacluta Monastery and Holy Water</h3><p>A sacred Catholic site nestled in the mountains. The monastery is famous for its holy water spring that locals believe has healing properties. The mountain setting provides cool air and stunning views.</p><p><strong>Location:</strong> Approximately 45 minutes from Dili</p><h3>5. Cape Fatucama</h3><p>Located at the eastern tip of Dili, this dramatic headland offers incredible ocean views and is a popular spot for watching the sunrise. The area has interesting geological formations and a peaceful atmosphere.</p><h3>6. Tasi Tolu</h3><p>Three beautiful bays located west of Dili, each offering unique experiences. Popular for swimming, diving, and picnics. The area is less crowded than Dili Beach and offers clearer waters.</p><h3>Planning Your Visit</h3><p>Timor-Leste''s dry season (May to November) is the best time to visit these attractions. Rent a car or hire a driver for the best experience, especially for day trips to more remote locations.</p><p>Don''t forget to bring sunscreen, water, and your camera - these natural wonders are truly unforgettable!</p>',
  'TimorList',
  'published',
  '["Attractions", "Dili", "Travel", "Nature"]',
  1750195200000,
  1750195200000,
  1750195200000
);

-- Flights Blog
INSERT INTO blog_posts (id, title, slug, excerpt, content, author_name, status, tags, published_at, created_at, updated_at)
VALUES (
  'blog-flights-001',
  'How to Reach Timor-Leste: International Flight Routes',
  'international-flights-to-timor-leste',
  'Timor-Leste''s main gateway is Presidente Nicolau Lobato International Airport (DIL) in Dili. Here''s your complete guide to international flight routes and travel tips.',
  '<h2>How to Reach Timor-Leste: International Flight Routes</h2><p>Timor-Leste''s main gateway is Presidente Nicolau Lobato International Airport (DIL) in Dili. Here''s your complete guide to reaching this beautiful island nation.</p><h3>About Timor-Leste''s Airport</h3><p>Presidente Nicolau Lobato International Airport (IATA: DIL) is located just outside Dili, the capital city. The airport has expanded significantly in recent years and now offers several international routes.</p><h3>Current Airlines & Routes</h3><table><thead><tr><th>Airline</th><th>Destination</th><th>Frequency</th><th>Duration</th></tr></thead><tbody><tr><td>Air Timor</td><td>Singapore</td><td>4x weekly</td><td>~3.5 hours</td></tr><tr><td>Air Timor</td><td>Darwin, Australia</td><td>3x weekly</td><td>~1.5 hours</td></tr><tr><td>Air Timor</td><td>Bali (Denpasar)</td><td>5x weekly</td><td>~1 hour</td></tr><tr><td>Air Timor</td><td>Jakarta</td><td>4x weekly</td><td>~2.5 hours</td></tr><tr><td>Sriwijaya Air</td><td>Bali</td><td>2x weekly</td><td>~1 hour</td></tr></tbody></table><h3>Popular Routes Explained</h3><h4>Dili to Singapore</h4><p>Duration: ~3.5 hours. Singapore is the main hub for connections to worldwide destinations. Singapore Airlines and Scoot offer excellent connectivity to Asia, Europe, and beyond.</p><h4>Dili to Darwin, Australia</h4><p>Duration: ~1.5 hours. The shortest international route. Darwin is a convenient gateway for those traveling from Australia, with connections to major Australian cities.</p><h4>Dili to Bali, Indonesia</h4><p>Duration: ~1 hour. The most frequent route, perfect for a weekend getaway or combining your Timor-Leste trip with a Bali visit.</p><h4>Dili to Jakarta, Indonesia</h4><p>Duration: ~2.5 hours. Direct connection to Indonesia''s capital, offering connections throughout Asia.</p><h3>Getting There Tips</h3><ul><li><strong>Book early:</strong> Flights can fill up quickly, especially during peak season (May to October)</li><li><strong>Transit through Singapore:</strong> Best option for most international connections</li><li><strong>Bali hub:</strong> Good alternative for budget travelers, especially from Southeast Asia</li><li><strong>Check schedules:</strong> Flight schedules can change seasonally - always verify before booking</li></ul><h3>Visa Requirements</h3><p>Most nationalities can obtain a visa on arrival for tourism purposes. Check with your local Timor-Leste embassy or consulate for the latest visa requirements.</p><h3>What to Expect at the Airport</h3><p>Presidente Nicolau Lobato Airport is relatively small but efficient. Facilities include:</p><ul><li>Basic restaurants and shops</li><li>ATM machines (arrivals area)</li><li>Taxi services to Dili</li><li>Car rental desks</li></ul><p>Book your flights early and get ready to explore the beauty of Timor-Leste!</p>',
  'TimorList',
  'published',
  '["Flights", "Travel", "Dili", "Guide"]',
  1750281600000,
  1750281600000,
  1750281600000
);