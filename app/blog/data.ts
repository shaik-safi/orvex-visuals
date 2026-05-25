// ============================================================
// ORVEX VISUALS — BLOG DATA (Single Source of Truth)
// Add new blog posts here. Both /blog and /blog/[slug] import from this file.
// ============================================================

export type BlogCategory =
  | "pre-wedding"
  | "wedding"
  | "baby-maternity"
  | "pricing-guide"
  | "locations"
  | "tips"
  | "events"

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: BlogCategory
  image: string
  author: string
  date: string // YYYY-MM-DD
  readTime: number // minutes
  featured?: boolean
  content: string // HTML content for the post
  tags: string[]
}

export const blogCategories: { id: BlogCategory | "all"; label: string }[] = [
  { id: "all", label: "All Posts" },
  { id: "pre-wedding", label: "Pre-Wedding" },
  { id: "wedding", label: "Wedding" },
  { id: "baby-maternity", label: "Baby & Maternity" },
  { id: "pricing-guide", label: "Pricing Guides" },
  { id: "locations", label: "Locations" },
  { id: "tips", label: "Tips & Ideas" },
  { id: "events", label: "Events" },
]

export const blogPosts: BlogPost[] = [
  {
    slug: "pre-wedding-photoshoot-places-in-bangalore",
    title: "Top 15 Pre-Wedding Photoshoot Places in Bangalore (2026 Guide)",
    excerpt: "Discover the most stunning locations for your pre-wedding shoot in Bangalore — from heritage palaces to hidden gardens and urban rooftops.",
    category: "locations",
    image: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=800&q=80",
    author: "Orvex Visuals",
    date: "2026-05-15",
    readTime: 8,
    featured: true,
    tags: ["pre-wedding", "bangalore", "locations", "couple shoot"],
    content: `
      <p>Planning a pre-wedding photoshoot in Bangalore? The city offers an incredible mix of heritage architecture, lush greenery, modern urban backdrops, and serene lakes — perfect for every couple's style.</p>

      <p>We've photographed hundreds of couples across Bangalore and here are our absolute favorite spots, organized by vibe:</p>

      <h2>🏛️ Heritage & Royal Vibes</h2>

      <h3>1. Bangalore Palace</h3>
      <p>Tudor-style architecture with sprawling grounds. The wooden interiors and grand lawns create a regal feel. <strong>Best time:</strong> Early morning (7-9 AM) for soft golden light. <strong>Permit needed:</strong> Yes, ₹500-1000 for photography.</p>

      <h3>2. Jayamahal Palace</h3>
      <p>Beautiful Mughal-style arches and manicured gardens. Less crowded than Bangalore Palace. Perfect for traditional outfit shoots.</p>

      <h3>3. Tipu Sultan's Summer Palace</h3>
      <p>Wooden architecture with intricate carvings. Great for close-up couple shots with textured backgrounds.</p>

      <h2>🌿 Nature & Gardens</h2>

      <h3>4. Cubbon Park</h3>
      <p>100+ acres of greenery in the heart of the city. Tree-lined avenues, Victorian bandstand, and dappled sunlight make it a perennial favorite. <strong>Photography:</strong> Allowed without commercial tripods. Weekday mornings are best.</p>

      <h3>5. Lal Bagh Botanical Garden</h3>
      <p>The Glass House, the historic trees, and the flower beds create diverse backdrops in one location. <strong>Entry:</strong> ₹30/person.</p>

      <h3>6. Nandi Hills (40 km from Bangalore)</h3>
      <p>Misty mornings, sunrise shots, and dramatic cliff edges. Worth the early drive for dreamy, ethereal photos. <strong>Tip:</strong> Arrive by 5:30 AM on weekdays to avoid crowds.</p>

      <h3>7. Hesaraghatta Lake</h3>
      <p>Open grasslands with a lake backdrop. Perfect for sunset shoots and twirling dress shots. Very photogenic and rarely crowded.</p>

      <h2>🏙️ Urban & Modern</h2>

      <h3>8. UB City Rooftop Area</h3>
      <p>Luxury mall surroundings with clean modern architecture. Great for suited-up, sophisticated couple looks.</p>

      <h3>9. MG Road & Brigade Road</h3>
      <p>Busy street vibes, neon signs, and traffic trails for edgy urban shoots. Best at blue hour (6:30-7 PM).</p>

      <h3>10. Orion Mall Surroundings</h3>
      <p>Water features and evening lights create a romantic ambiance without leaving the city.</p>

      <h2>🎨 Unique & Offbeat</h2>

      <h3>11. Art of Living Ashram, Kanakapura</h3>
      <p>Stunning Visalakshi Mantap dome and serene surroundings. Requires prior permission.</p>

      <h3>12. Innovative Film City</h3>
      <p>Multiple themed sets — Japanese garden, European castle, Indian village — all in one location. <strong>Cost:</strong> ₹600-800/person entry.</p>

      <h3>13. Ramanagara Rocks (Sholay location)</h3>
      <p>Dramatic boulder landscapes for adventurous couples. 50 km from Bangalore.</p>

      <h3>14. KR Market (Flower Market)</h3>
      <p>Burst of colors! Marigold piles and jasmine strands create unforgettable frames. <strong>Best time:</strong> 6-8 AM.</p>

      <h3>15. Savandurga Hills</h3>
      <p>Asia's largest monolith rock. Dramatic, rugged backdrop for adventure-loving couples.</p>

      <h2>📋 Quick Tips for Your Shoot</h2>
      <ul>
        <li><strong>Timing:</strong> Golden hour (6-8 AM or 4-6 PM) gives the best natural light</li>
        <li><strong>Outfits:</strong> Carry 2-4 outfits — mix formal and casual</li>
        <li><strong>Avoid weekends</strong> at popular spots for fewer crowd interruptions</li>
        <li><strong>Permits:</strong> Always check if commercial photography needs permission</li>
        <li><strong>Season:</strong> Oct-Feb is ideal (pleasant weather, clear skies)</li>
      </ul>

      <h2>Ready to Book Your Pre-Wedding Shoot?</h2>
      <p>At Orvex Visuals, we handle everything — location scouting, outfit guidance, and professional photography. Our pre-wedding packages start at just <strong>₹15,000</strong> (GST inclusive, no hidden costs).</p>
    `,
  },
  {
    slug: "wedding-photography-price-list-bangalore-2026",
    title: "Wedding Photography Price List in Bangalore (2026) — Complete Guide",
    excerpt: "Transparent breakdown of wedding photography costs in Bangalore. Budget, standard, and premium options compared with what you actually get.",
    category: "pricing-guide",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    author: "Orvex Visuals",
    date: "2026-05-10",
    readTime: 10,
    featured: true,
    tags: ["wedding", "pricing", "bangalore", "packages"],
    content: `
      <p>Looking for wedding photography pricing in Bangalore? Here's a transparent, no-BS guide based on actual market rates in 2026. We'll cover what you should expect at every budget level.</p>

      <h2>Quick Price Summary (Bangalore, 2026)</h2>

      <table>
        <thead>
          <tr><th>Category</th><th>Price Range</th><th>What You Get</th></tr>
        </thead>
        <tbody>
          <tr><td>Budget</td><td>₹15,000 - ₹30,000</td><td>1 photographer, traditional, 100-200 photos</td></tr>
          <tr><td>Standard</td><td>₹30,000 - ₹60,000</td><td>1-2 photographers, candid + traditional, 300-500 photos</td></tr>
          <tr><td>Premium</td><td>₹60,000 - ₹1,50,000</td><td>2-3 photographers, full candid, album, pre-wedding, video</td></tr>
          <tr><td>Luxury</td><td>₹1,50,000+</td><td>Full team, cinematic video, drone, 2-day coverage, premium album</td></tr>
        </tbody>
      </table>

      <h2>What Affects the Price?</h2>

      <h3>1. Number of Days & Hours</h3>
      <p>A single-day wedding (muhurtham only) costs less than a 2-3 day celebration with mehendi, sangeet, and reception. Most photographers charge per day or per event.</p>

      <h3>2. Candid vs Traditional</h3>
      <p>Traditional photography (posed, group shots) is cheaper (₹10K-15K/day). Candid photography requires more skill, better equipment, and more editing — hence costs ₹20K-35K/day.</p>

      <h3>3. Team Size</h3>
      <p>Solo photographer vs a team of 2-3 photographers + assistants makes a big difference in coverage quality and price.</p>

      <h3>4. Deliverables</h3>
      <p>Digital-only delivery is cheapest. Add a premium album (₹5K-15K), canvas prints, or same-day edits and the price goes up.</p>

      <h3>5. Video/Cinematic</h3>
      <p>Adding videography typically doubles the photography-only cost. A highlight film adds another ₹10K-25K.</p>

      <h2>Orvex Visuals — Our Packages</h2>

      <h3>Essential — ₹20,000</h3>
      <ul>
        <li>1 Photographer, 4-6 hours</li>
        <li>Traditional + Some Candid</li>
        <li>200+ Edited Photos, Online Gallery</li>
        <li>Delivery in 15 days</li>
      </ul>

      <h3>Premium — ₹55,000 (Most Popular)</h3>
      <ul>
        <li>2 Photographers, Full Day</li>
        <li>Candid + Traditional Coverage</li>
        <li>500+ Edited Photos, Photo Album (40 pages)</li>
        <li>Same-Day Teaser, Pre-Wedding Consultation</li>
      </ul>

      <h3>Luxury — ₹95,000</h3>
      <ul>
        <li>3 Photographers + Drone, 2 Days</li>
        <li>1000+ Photos, Cinematic Teaser Video</li>
        <li>Premium Album (60 pages), Canvas Print</li>
        <li>All functions covered (Mehendi to Reception)</li>
      </ul>

      <h2>Hidden Costs to Watch For</h2>
      <ul>
        <li><strong>GST:</strong> Many studios quote "plus 18% GST" — our prices are always inclusive</li>
        <li><strong>Travel:</strong> Outstation charges if your venue is outside city limits</li>
        <li><strong>Extra hours:</strong> Check if overtime is charged separately</li>
        <li><strong>Raw files:</strong> Usually not included, costs ₹5K-10K extra</li>
        <li><strong>Album printing:</strong> Some quote separately (₹5K-15K)</li>
      </ul>

      <h2>How to Choose the Right Package</h2>
      <p>Ask yourself: How important are candid moments vs traditional photos? Do you need video? How many events need coverage? These answers will naturally point you to the right budget range.</p>

      <p><strong>Our recommendation:</strong> For most couples having a 1-day wedding, the ₹55,000 Premium package offers the best value — you get candid + traditional, enough photos for a lifetime, and an album to show off.</p>
    `,
  },
  {
    slug: "best-baby-photoshoot-ideas-bangalore",
    title: "20 Adorable Baby Photoshoot Ideas in Bangalore (With Themes & Tips)",
    excerpt: "From milestone shoots to themed setups — creative baby photography ideas that parents love, with tips on timing, props, and what to expect.",
    category: "baby-maternity",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80",
    author: "Orvex Visuals",
    date: "2026-05-01",
    readTime: 7,
    featured: false,
    tags: ["baby", "photoshoot ideas", "bangalore", "newborn", "themes"],
    content: `
      <p>Baby photoshoots are one of the most rewarding types of photography — those tiny fingers, curious eyes, and milestone moments deserve to be captured beautifully. Here are our favorite ideas that parents in Bangalore absolutely love.</p>

      <h2>By Age: Best Themes for Each Milestone</h2>

      <h3>Newborn (5-14 days)</h3>
      <ul>
        <li>Wrapped in soft muslin — classic, timeless portraits</li>
        <li>Sleeping in a basket or bowl with flowers</li>
        <li>Tiny feet and hands close-ups</li>
        <li>Parent's hands cradling baby</li>
      </ul>
      <p><strong>Pro tip:</strong> Book within the first 2 weeks when babies sleep deeply and curl naturally.</p>

      <h3>3 Months</h3>
      <ul>
        <li>Tummy time portraits — those wobbly head lifts!</li>
        <li>Pastel setups with matching outfits</li>
        <li>First smile captures</li>
      </ul>

      <h3>6 Months (Sitting Baby)</h3>
      <ul>
        <li>Bubble bath theme</li>
        <li>Fruit basket setup (watermelon, strawberries)</li>
        <li>Princess/Prince themed with crown</li>
        <li>Superhero capes (tiny Batman, Superman)</li>
      </ul>

      <h3>9 Months (Crawling)</h3>
      <ul>
        <li>Explorer theme — mini suitcase, map backdrop</li>
        <li>Chef theme with tiny hat and utensils</li>
        <li>Garden party setup</li>
      </ul>

      <h3>12 Months (First Birthday / Cake Smash)</h3>
      <ul>
        <li>Cake smash — let them go wild with a themed cake!</li>
        <li>Balloon garland backdrop</li>
        <li>Number "1" prop with flowers</li>
        <li>Before/after — clean outfit vs cake-covered chaos</li>
      </ul>

      <h2>Popular Themes That Always Work</h2>
      <ol>
        <li><strong>Floral Garden:</strong> Fresh flowers, green leaves, nature feel</li>
        <li><strong>Royal/Traditional:</strong> Silk outfits, gold jewelry, palace vibes</li>
        <li><strong>Fairytale:</strong> Princess dress, castle backdrop, wand</li>
        <li><strong>Sports:</strong> Cricket bat, football, tiny jerseys</li>
        <li><strong>Festive:</strong> Diwali lamps, Christmas tree, Ugadi setup</li>
        <li><strong>Professional:</strong> Doctor, pilot, engineer — tiny costumes</li>
        <li><strong>Vintage:</strong> Antique props, muted colors, classic feel</li>
        <li><strong>Rainbow:</strong> Colorful balloons, ribbons, bright backdrop</li>
      </ol>

      <h2>Tips for a Successful Baby Shoot</h2>
      <ul>
        <li><strong>Schedule around nap/feed times</strong> — a well-rested baby is a happy baby</li>
        <li><strong>Keep the room warm</strong> — especially for newborns</li>
        <li><strong>Bring backup outfits</strong> — diaper explosions happen!</li>
        <li><strong>Be patient</strong> — the best shots happen when baby is comfortable</li>
        <li><strong>Parents in frame</strong> — include at least some family shots</li>
        <li><strong>Natural light is best</strong> — no harsh flashes for babies</li>
      </ul>

      <h2>How Much Does a Baby Photoshoot Cost in Bangalore?</h2>
      <p>At Orvex Visuals, our baby shoot packages start at <strong>₹8,000</strong> (including themed setup, props, costumes, and professional editing). We come to your home or arrange a studio — whatever's comfortable for your little one.</p>
    `,
  },
  {
    slug: "how-to-choose-wedding-photographer-bangalore",
    title: "How to Choose the Best Wedding Photographer in Bangalore (2026)",
    excerpt: "A buyer's guide to finding the right wedding photographer — what to look for, red flags to avoid, and questions to ask before booking.",
    category: "tips",
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80",
    author: "Orvex Visuals",
    date: "2026-04-20",
    readTime: 6,
    featured: false,
    tags: ["wedding", "tips", "how-to", "bangalore", "photography"],
    content: `
      <p>Your wedding photos are the only thing that lasts forever from your big day. Choosing the right photographer is one of the most important decisions you'll make. Here's how to do it right.</p>

      <h2>Step 1: Define Your Style</h2>
      <p>Before you start searching, know what you want:</p>
      <ul>
        <li><strong>Traditional:</strong> Posed group shots, formal portraits, every ritual documented</li>
        <li><strong>Candid:</strong> Natural moments, emotions, storytelling approach</li>
        <li><strong>Cinematic:</strong> Film-like quality, dramatic lighting, editorial feel</li>
        <li><strong>Documentary:</strong> Raw, unposed, photojournalistic</li>
      </ul>
      <p>Most modern couples want a mix of candid + traditional. Make sure your photographer can do both.</p>

      <h2>Step 2: Check Their Portfolio (Properly)</h2>
      <ul>
        <li>Look at <strong>full wedding galleries</strong>, not just highlight reels</li>
        <li>Check consistency — are ALL photos well-edited, or just the best 10?</li>
        <li>Look for <strong>similar venues/lighting</strong> to your wedding</li>
        <li>Check if they've shot your <strong>community/culture's rituals</strong> before</li>
      </ul>

      <h2>Step 3: Ask the Right Questions</h2>
      <ol>
        <li>How many weddings have you shot?</li>
        <li>Will YOU personally shoot, or your team?</li>
        <li>What equipment do you use? Do you carry backups?</li>
        <li>How many photos will I receive? In what format?</li>
        <li>What's your delivery timeline?</li>
        <li>Is the price inclusive of GST and travel?</li>
        <li>What's your cancellation/rescheduling policy?</li>
        <li>Can I see a full wedding album (not just Instagram highlights)?</li>
      </ol>

      <h2>Red Flags to Watch For</h2>
      <ul>
        <li>❌ No full wedding galleries to show — only "best of" posts</li>
        <li>❌ Price quoted "plus GST" with vague add-on charges</li>
        <li>❌ Won't confirm who'll actually shoot on the day</li>
        <li>❌ No written contract or terms</li>
        <li>❌ Delivery timeline more than 30 days without explanation</li>
        <li>❌ Watermarks on your final delivered photos</li>
        <li>❌ Pressure to book immediately "or lose the date"</li>
      </ul>

      <h2>Green Flags</h2>
      <ul>
        <li>✅ Transparent, all-inclusive pricing (GST included)</li>
        <li>✅ Happy to show full galleries and share references</li>
        <li>✅ Written contract with clear deliverables</li>
        <li>✅ Pre-wedding consultation to understand your vision</li>
        <li>✅ Backup equipment policy</li>
        <li>✅ Reasonable advance (50%) with clear refund terms</li>
      </ul>

      <h2>Budget Allocation Tips</h2>
      <p>Most wedding planners recommend allocating <strong>10-15% of your total wedding budget</strong> to photography and videography. For a ₹10 lakh wedding, that's ₹1-1.5 lakh for photo+video.</p>

      <h2>Why Orvex Visuals?</h2>
      <p>We tick every green flag: transparent GST-inclusive pricing, full galleries available, written contracts, backup equipment, and a pre-wedding consultation included in every package. Our wedding photography starts at ₹20,000.</p>
    `,
  },
  {
    slug: "pre-wedding-shoot-cost-bangalore",
    title: "Pre-Wedding Photoshoot Cost in Bangalore (2026) — Budget to Premium",
    excerpt: "How much does a pre-wedding shoot cost? Complete price breakdown from budget ₹10K shoots to luxury ₹1L+ packages.",
    category: "pricing-guide",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
    author: "Orvex Visuals",
    date: "2026-04-15",
    readTime: 6,
    featured: false,
    tags: ["pre-wedding", "pricing", "bangalore", "cost guide"],
    content: `
      <p>Pre-wedding photoshoots have become a must-do for couples in Bangalore. But how much should you actually spend? Here's a complete price breakdown.</p>

      <h2>Pre-Wedding Shoot Price Ranges (Bangalore 2026)</h2>

      <table>
        <thead>
          <tr><th>Level</th><th>Price</th><th>Duration</th><th>What's Included</th></tr>
        </thead>
        <tbody>
          <tr><td>Budget</td><td>₹8,000 - ₹15,000</td><td>2-3 hours</td><td>1 location, 1-2 outfits, 30-50 photos</td></tr>
          <tr><td>Standard</td><td>₹15,000 - ₹30,000</td><td>4-5 hours</td><td>2 locations, 3-4 outfits, 80-150 photos, styling help</td></tr>
          <tr><td>Premium</td><td>₹30,000 - ₹60,000</td><td>6-8 hours</td><td>3+ locations, unlimited outfits, 200+ photos, short video</td></tr>
          <tr><td>Luxury</td><td>₹60,000 - ₹1,50,000</td><td>Full day+</td><td>Destination, cinematic video, drone, MUA, concept shoot</td></tr>
        </tbody>
      </table>

      <h2>What Makes Pre-Wedding Shoots Expensive?</h2>
      <ul>
        <li><strong>Location:</strong> Outstation locations (Pondicherry, Goa, Jaipur) add travel costs</li>
        <li><strong>Video:</strong> Adding a cinematic video increases cost by 40-60%</li>
        <li><strong>Duration:</strong> More hours = more outfit changes = more variety</li>
        <li><strong>Team size:</strong> Photographer + videographer + assistant vs solo</li>
        <li><strong>Editing style:</strong> Heavy retouching and color grading takes time</li>
        <li><strong>Drone:</strong> Aerial shots add ₹3,000-5,000</li>
      </ul>

      <h2>Our Packages at Orvex Visuals</h2>

      <h3>Silver — ₹15,000</h3>
      <p>1 location, 3 hours, 2 outfit changes, 50+ edited photos. Perfect for couples on a budget who want quality without overspending.</p>

      <h3>Gold — ₹25,000 (Best Value)</h3>
      <p>2 locations, 5 hours, 4 outfits, 100+ photos, location scouting, styling guide. Our most popular choice.</p>

      <h3>Platinum — ₹45,000</h3>
      <p>3 locations, 8 hours, unlimited outfits, 200+ photos, 3-min cinematic video, drone shots, props included.</p>

      <h2>Tips to Save Money</h2>
      <ul>
        <li>Shoot on weekdays — some photographers offer 10-20% off</li>
        <li>Choose nearby locations to save on travel time</li>
        <li>Do your own makeup for lower tiers</li>
        <li>Book photo-only (skip video) if budget is tight</li>
        <li>Ask about combo deals if booking wedding + pre-wedding together</li>
      </ul>
    `,
  },
  {
    slug: "maternity-photoshoot-bangalore-guide",
    title: "Maternity Photoshoot in Bangalore — Complete Guide (2026)",
    excerpt: "Everything you need to know about maternity photography: when to shoot, what to wear, indoor vs outdoor, and pricing in Bangalore.",
    category: "baby-maternity",
    image: "https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=800&q=80",
    author: "Orvex Visuals",
    date: "2026-04-08",
    readTime: 6,
    featured: false,
    tags: ["maternity", "pregnancy", "bangalore", "photoshoot guide"],
    content: `
      <p>A maternity photoshoot celebrates one of life's most beautiful chapters. Here's everything Bangalore moms-to-be need to know.</p>

      <h2>When to Schedule Your Maternity Shoot</h2>
      <p>The ideal window is <strong>28-34 weeks</strong> (7-8 months). Your bump is beautifully round, you're still comfortable enough to pose, and the risk of early delivery is low.</p>
      <ul>
        <li><strong>Too early (before 28 weeks):</strong> Bump may not be prominently visible</li>
        <li><strong>Too late (after 36 weeks):</strong> Discomfort, swelling, and risk of early labor</li>
        <li><strong>Sweet spot:</strong> 30-32 weeks for most moms</li>
      </ul>

      <h2>Indoor vs Outdoor</h2>

      <h3>Indoor/Studio</h3>
      <ul>
        <li>Controlled lighting — consistently beautiful results</li>
        <li>Privacy — comfortable for flowing fabric/silhouette shots</li>
        <li>AC — no weather worries, no sweating</li>
        <li>Best for: Artistic, dramatic, fabric draping styles</li>
      </ul>

      <h3>Outdoor</h3>
      <ul>
        <li>Natural light — soft, flattering glow</li>
        <li>Beautiful backgrounds — parks, gardens, architecture</li>
        <li>More variety in a single session</li>
        <li>Best for: Natural, bright, lifestyle-style photos</li>
      </ul>

      <p><strong>Our recommendation:</strong> A combo of both! Start with indoor (flowing dress, silhouettes), then move outdoors for lifestyle shots.</p>

      <h2>What to Wear</h2>
      <ul>
        <li><strong>Fitted gowns</strong> that show off your bump shape</li>
        <li><strong>Flowing fabrics</strong> (chiffon, tulle) for ethereal shots</li>
        <li><strong>Sarees</strong> for traditional elegance</li>
        <li><strong>Solid colors</strong> work better than busy prints</li>
        <li>Avoid: Very loose clothing that hides the bump</li>
      </ul>

      <h2>Pricing in Bangalore</h2>
      <table>
        <thead>
          <tr><th>Package</th><th>Price</th><th>Includes</th></tr>
        </thead>
        <tbody>
          <tr><td>Basic</td><td>₹5,000 - ₹8,000</td><td>1 hour, 1 outfit, 15-20 photos</td></tr>
          <tr><td>Standard</td><td>₹8,000 - ₹15,000</td><td>2 hours, 2-3 outfits, 30-50 photos</td></tr>
          <tr><td>Premium</td><td>₹15,000 - ₹25,000</td><td>3 hours, unlimited outfits, 80+ photos, partner shots</td></tr>
        </tbody>
      </table>

      <h2>Orvex Visuals Maternity Packages</h2>
      <p>Starting at ₹8,000 inclusive of styling guidance, professional editing, and online gallery delivery. We specialize in making moms-to-be feel beautiful and comfortable throughout the session.</p>
    `,
  },
  {
    slug: "candid-wedding-photography-vs-traditional",
    title: "Candid vs Traditional Wedding Photography — Which Should You Choose?",
    excerpt: "Understanding the difference between candid and traditional styles, when each works best, and how to get the perfect mix for your wedding.",
    category: "wedding",
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80",
    author: "Orvex Visuals",
    date: "2026-03-28",
    readTime: 5,
    featured: false,
    tags: ["wedding", "candid", "traditional", "photography styles"],
    content: `
      <p>One of the most common questions we get: "Should we go for candid or traditional photography?" The short answer: both. Here's why.</p>

      <h2>Traditional Photography</h2>
      <p><strong>What it is:</strong> Posed, directed shots — family groups, couple portraits, ritual documentation with everyone looking at the camera.</p>
      <ul>
        <li>✅ Everyone looks their best (posed and ready)</li>
        <li>✅ Complete ritual documentation</li>
        <li>✅ Family group shots that grandparents love</li>
        <li>✅ Predictable, reliable results</li>
        <li>❌ Can feel stiff and staged</li>
        <li>❌ Misses genuine emotional moments</li>
      </ul>

      <h2>Candid Photography</h2>
      <p><strong>What it is:</strong> Unposed, natural moments captured as they happen — laughter, tears, stolen glances, dancing, genuine emotions.</p>
      <ul>
        <li>✅ Real emotions and authentic moments</li>
        <li>✅ Storytelling approach — your day unfolds naturally</li>
        <li>✅ More artistic and editorial quality</li>
        <li>✅ Captures moments you didn't even notice</li>
        <li>❌ Can't guarantee specific group compositions</li>
        <li>❌ Requires experienced, skilled photographer</li>
        <li>❌ Costs more (more skill, more editing)</li>
      </ul>

      <h2>The Best Approach: Hybrid</h2>
      <p>90% of our clients choose a <strong>hybrid approach</strong> — primarily candid with dedicated time for traditional group shots and portraits. This gives you:</p>
      <ul>
        <li>Emotional, storytelling candid coverage throughout</li>
        <li>Clean family group shots during a scheduled 30-45 min slot</li>
        <li>Beautiful couple portraits during golden hour</li>
        <li>All rituals documented from multiple angles</li>
      </ul>

      <h2>Price Difference</h2>
      <table>
        <thead>
          <tr><th>Style</th><th>Typical Cost (per day)</th></tr>
        </thead>
        <tbody>
          <tr><td>Traditional Only</td><td>₹10,000 - ₹15,000</td></tr>
          <tr><td>Candid Only</td><td>₹20,000 - ₹35,000</td></tr>
          <tr><td>Hybrid (Candid + Traditional)</td><td>₹20,000 - ₹55,000</td></tr>
        </tbody>
      </table>

      <p>At Orvex Visuals, all our packages from Premium (₹55K) onwards include hybrid coverage by default.</p>
    `,
  },
  {
    slug: "nandi-hills-pre-wedding-shoot-guide",
    title: "Pre-Wedding Photoshoot at Nandi Hills — Everything You Need to Know",
    excerpt: "Planning a pre-wedding shoot at Nandi Hills? Timing, permits, best spots, outfit ideas, and photographer tips for stunning hilltop photos.",
    category: "locations",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
    author: "Orvex Visuals",
    date: "2026-03-15",
    readTime: 5,
    featured: false,
    tags: ["nandi hills", "pre-wedding", "location guide", "bangalore"],
    content: `
      <p>Nandi Hills is THE most popular pre-wedding location near Bangalore — and for good reason. The misty mornings, dramatic cliff views, and lush greenery create magical backdrops. Here's our complete guide.</p>

      <h2>Why Nandi Hills?</h2>
      <ul>
        <li>Just 60 km from Bangalore (1.5 hour drive)</li>
        <li>Stunning sunrise with mist and clouds below</li>
        <li>Multiple backdrops: fort walls, temple, viewpoints, gardens</li>
        <li>Pleasant weather year-round (cooler than Bangalore)</li>
      </ul>

      <h2>Best Time to Visit</h2>
      <ul>
        <li><strong>For sunrise (recommended):</strong> Arrive by 5:30 AM — gates open at 5 AM</li>
        <li><strong>For golden light:</strong> 6:00 - 8:00 AM is perfect</li>
        <li><strong>Avoid:</strong> Weekends and public holidays (extremely crowded)</li>
        <li><strong>Best season:</strong> Oct - Feb (misty mornings, clear skies)</li>
        <li><strong>Monsoon (July-Sep):</strong> Lush green but cloudy/rainy — risky</li>
      </ul>

      <h2>Best Spots at Nandi Hills</h2>
      <ol>
        <li><strong>Tipu's Drop Point:</strong> Dramatic cliff edge with valley views below</li>
        <li><strong>Nehru Nilaya Guest House area:</strong> Beautiful stone arches and columns</li>
        <li><strong>Amrita Sarovar Lake:</strong> Reflections and calm water backdrop</li>
        <li><strong>Fort Entrance & Walls:</strong> Heritage, rustic stone texture</li>
        <li><strong>Garden Pathway:</strong> Tree-lined walk, dappled light</li>
      </ol>

      <h2>Permits & Rules</h2>
      <ul>
        <li>Entry fee: ₹20/person (car parking: ₹75)</li>
        <li>Commercial photography: May need forest dept permission for equipment like tripods, lights</li>
        <li>Drone: NOT allowed (restricted zone)</li>
        <li>Our team handles permits when you book with us</li>
      </ul>

      <h2>Outfit Suggestions</h2>
      <ul>
        <li>Light, flowy fabrics that catch the wind (dramatic effect at viewpoints)</li>
        <li>Bold colors stand out against green/misty backgrounds</li>
        <li>Avoid white (blends with mist/fog)</li>
        <li>Carry a shawl/jacket — mornings are cold (15-18°C)</li>
      </ul>

      <h2>Book Your Nandi Hills Shoot</h2>
      <p>Orvex Visuals regularly shoots at Nandi Hills. We handle timing, location planning, and know all the hidden spots. Pre-wedding packages start at ₹15,000.</p>
    `,
  },
]

// ============ HELPER ============
export function getBlogPost(slug: string): BlogPost | null {
  return blogPosts.find((p) => p.slug === slug) || null
}

export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const current = blogPosts.find((p) => p.slug === currentSlug)
  if (!current) return blogPosts.slice(0, limit)

  return blogPosts
    .filter((p) => p.slug !== currentSlug)
    .sort((a, b) => {
      const aMatch = a.category === current.category ? 1 : 0
      const bMatch = b.category === current.category ? 1 : 0
      return bMatch - aMatch
    })
    .slice(0, limit)
}
