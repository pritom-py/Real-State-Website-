import { PrismaClient, PropertyStatus, PropertyType, LeadInterest, LeadStatus, InsightStatus, RepresentationType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ─── Admin User ───────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash(
    process.env.SEED_ADMIN_PASSWORD || 'ChangeMe@2024!',
    12
  )
  const admin = await prisma.user.upsert({
    where: { email: process.env.SEED_ADMIN_EMAIL || 'admin@alexandravoss.com' },
    update: {},
    create: {
      email: process.env.SEED_ADMIN_EMAIL || 'admin@alexandravoss.com',
      passwordHash,
      name: 'Alexandra Voss',
      role: 'SUPER_ADMIN',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // ─── Broker Profile ───────────────────────────────────────────────────────
  await prisma.brokerProfile.upsert({
    where: { id: 'broker-main' },
    update: {},
    create: {
      id: 'broker-main',
      name: 'Alexandra Voss',
      title: 'Luxury Real Estate Advisor',
      tagline: 'Where Exceptional Homes Find Exceptional People',
      bio: `Alexandra Voss is one of Los Angeles's most respected luxury real estate advisors, with over 18 years of experience guiding discerning clients through the acquisition and sale of the region's most distinguished properties. Known for her discretion, market intelligence, and unwavering commitment to client interests, Alexandra has built a reputation as the trusted partner for buyers and sellers who refuse to compromise.\n\nA native of Beverly Hills, Alexandra brings an insider's perspective to every transaction. Her intimate knowledge of ultra-premium neighborhoods — from the gated estates of Bel-Air to the cliff-top retreats of Malibu — enables her to provide clients with strategic counsel that goes beyond the transactional.\n\nBefore entering real estate, Alexandra held senior roles in luxury hospitality and private wealth management, disciplines that continue to inform her elevated approach to client service. She holds an MBA from USC's Marshall School of Business and is a Certified Luxury Home Marketing Specialist (CLHMS), a designation awarded to fewer than 1% of practicing agents nationwide.\n\nAlexandra's portfolio spans some of the most celebrated addresses in California, with over $2.4 billion in career sales across Beverly Hills, Bel-Air, Holmby Hills, Malibu, Santa Monica, and the Pacific Palisades. She consistently ranks among the top 10 agents in Los Angeles County and has received recognition from the Wall Street Journal, The Agency, and LA Magazine.`,
      shortBio: `With 18 years of experience and over $2.4 billion in career sales, Alexandra Voss is the trusted advisor for buyers and sellers seeking the finest properties in Los Angeles and surrounding communities.`,
      philosophy: `I believe that luxury real estate is not merely a transaction — it is the transfer of a lifestyle, a legacy, and a vision. My role is to understand your deepest aspirations and to match them with the right property at precisely the right moment. I approach every engagement with patience, precision, and absolute discretion.`,
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=90',
      photoAlt: 'Alexandra Voss, Luxury Real Estate Advisor',
      email: 'alexandra@alexandravoss.com',
      phone: '(310) 555-0142',
      licenseNumber: 'CA DRE #01923847',
      serviceAreas: ['Beverly Hills', 'Bel-Air', 'Holmby Hills', 'Malibu', 'Santa Monica', 'Pacific Palisades', 'Brentwood', 'West Hollywood'],
      yearsExperience: 18,
      salesVolume: '$2.4B+',
      transactions: 847,
      areasServed: 8,
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
      facebook: 'https://facebook.com',
    },
  })
  console.log('✅ Broker profile created')

  // ─── Site Settings ────────────────────────────────────────────────────────
  const settings = [
    { key: 'site_title', value: 'Alexandra Voss | Luxury Real Estate Beverly Hills' },
    { key: 'site_description', value: 'Beverly Hills luxury real estate advisor with $2.4B+ in career sales. Exclusive properties in Beverly Hills, Bel-Air, Malibu, Santa Monica, and Pacific Palisades.' },
    { key: 'hero_headline', value: 'An Uncompromising Standard\nof Real Estate Excellence' },
    { key: 'hero_subline', value: 'Representing the finest properties in Beverly Hills, Bel-Air, Malibu and beyond.' },
    { key: 'contact_address', value: '9601 Wilshire Blvd, Suite 300, Beverly Hills, CA 90210' },
  ]
  for (const s of settings) {
    await prisma.siteSetting.upsert({ where: { key: s.key }, update: {}, create: s })
  }
  console.log('✅ Site settings created')

  // ─── Categories ───────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'market-insights' }, update: {}, create: { name: 'Market Insights', slug: 'market-insights' } }),
    prisma.category.upsert({ where: { slug: 'lifestyle' }, update: {}, create: { name: 'Lifestyle', slug: 'lifestyle' } }),
    prisma.category.upsert({ where: { slug: 'buying-guide' }, update: {}, create: { name: 'Buying Guide', slug: 'buying-guide' } }),
    prisma.category.upsert({ where: { slug: 'selling-strategy' }, update: {}, create: { name: 'Selling Strategy', slug: 'selling-strategy' } }),
    prisma.category.upsert({ where: { slug: 'neighborhood-spotlight' }, update: {}, create: { name: 'Neighborhood Spotlight', slug: 'neighborhood-spotlight' } }),
  ])
  console.log('✅ Categories created')

  // ─── Neighborhoods ────────────────────────────────────────────────────────
  const neighborhoods = await Promise.all([
    prisma.neighborhood.upsert({
      where: { slug: 'beverly-hills' },
      update: {},
      create: {
        name: 'Beverly Hills',
        slug: 'beverly-hills',
        heroImage: 'https://images.unsplash.com/photo-1609902726285-00668009f004?w=1600&q=90',
        description: 'Beverly Hills stands apart as California\'s most celebrated address — a city of immaculate streets, legendary boutiques, and estates that have housed the most storied names in entertainment, business, and culture. To own here is to belong to a community defined by privacy, prestige, and perpetual desirability.',
        lifestyle: 'Life in Beverly Hills unfolds against a backdrop of manicured parkways, world-class dining on Rodeo Drive, and a sense of effortless luxury that permeates every corner. Residents enjoy private clubs, the finest schools, and a social fabric woven from ambition and achievement.',
        marketOverview: 'The Beverly Hills market remains one of the most resilient and sought-after in the nation. With limited inventory and sustained demand from domestic and international buyers, prices have appreciated consistently over the past decade. Median home prices range from $4M in the flats to $30M+ for trophy estates in the hills.',
        highlights: ['Rodeo Drive & Luxury Retail', 'Beverly Hills Unified School District', 'Private & Gated Communities', 'World-Class Dining Scene', 'Central Location to All of LA', 'Legendary Cultural Heritage'],
        latitude: 34.0736,
        longitude: -118.4004,
        featured: true,
        seoTitle: 'Beverly Hills Luxury Real Estate | Alexandra Voss',
        seoDescription: 'Explore luxury homes and estates in Beverly Hills, CA. Expert guidance from Alexandra Voss, top luxury real estate advisor.',
      },
    }),
    prisma.neighborhood.upsert({
      where: { slug: 'bel-air' },
      update: {},
      create: {
        name: 'Bel-Air',
        slug: 'bel-air',
        heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=90',
        description: 'Bel-Air occupies a singular position in the Los Angeles luxury landscape — an enclave of winding canyon roads, sweeping city views, and grand estates set behind gates that the general public rarely passes. Here, privacy is paramount and scale is spectacular.',
        lifestyle: 'Bel-Air\'s residents value seclusion above all else. The community offers proximity to the Bel-Air Country Club, the UCLA campus, and the boutiques of Westwood Village, while maintaining an atmosphere of extraordinary calm just minutes from Beverly Hills and Century City.',
        marketOverview: 'Bel-Air commands some of the highest price points in California. Trophy properties regularly trade north of $50M, and the neighborhood\'s consistent trophy-asset status attracts global ultra-high-net-worth buyers. The market is characterized by extreme discretion, with many transactions occurring off-market.',
        highlights: ['Gated & Ultra-Private Estates', 'Sweeping City & Canyon Views', 'Bel-Air Country Club', 'Minutes to Beverly Hills', 'Trophy-Asset Market', 'Celebrity & Executive Community'],
        latitude: 34.0908,
        longitude: -118.4428,
        featured: true,
        seoTitle: 'Bel-Air Luxury Homes & Estates | Alexandra Voss',
        seoDescription: 'Browse exclusive Bel-Air estates and luxury homes. Guided by Alexandra Voss, Los Angeles\'s premier luxury real estate advisor.',
      },
    }),
    prisma.neighborhood.upsert({
      where: { slug: 'malibu' },
      update: {},
      create: {
        name: 'Malibu',
        slug: 'malibu',
        heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=90',
        description: 'Stretching 21 miles along the Pacific Coast Highway, Malibu is California\'s ultimate coastal retreat. From the Colony\'s beachfront compounds to the hillside sanctuaries above Zuma, Malibu offers a rare combination of natural grandeur, artistic community, and investment-grade real estate.',
        lifestyle: 'Malibu exists at the intersection of the natural and the refined. Mornings begin with surf and silence; evenings end with sunsets over the Pacific that rival any view in the world. The community is intimate, creative, and fiercely protective of its laid-back ethos — even among the world\'s most accomplished residents.',
        marketOverview: 'Malibu\'s oceanfront market is defined by scarcity. True beachfront properties rarely come available, and when they do, they attract immediate global attention. Carbon Beach — known colloquially as "Billionaire\'s Beach" — regularly sees transactions exceeding $50M. The broader market shows strong resilience driven by permanent demand for ocean-adjacent luxury.',
        highlights: ['Pacific Oceanfront Living', 'Carbon Beach (Billionaire\'s Beach)', 'World-Class Surf Breaks', 'Intimate Creative Community', 'Malibu Country Mart', 'Natural Reserve & Open Space'],
        latitude: 34.0259,
        longitude: -118.7798,
        featured: true,
        seoTitle: 'Malibu Luxury Beach Homes | Alexandra Voss',
        seoDescription: 'Discover Malibu\'s finest oceanfront estates and beach homes with Alexandra Voss, luxury real estate advisor.',
      },
    }),
    prisma.neighborhood.upsert({
      where: { slug: 'pacific-palisades' },
      update: {},
      create: {
        name: 'Pacific Palisades',
        slug: 'pacific-palisades',
        heroImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&q=90',
        description: 'Perched on bluffs above Santa Monica Bay, Pacific Palisades offers a village-like intimacy combined with the amenities of a world-class address. Tree-lined streets, award-winning schools, and proximity to both mountains and ocean make it perpetually desirable among families and executives alike.',
        lifestyle: 'The Palisades has long attracted those who want the complete California experience — ocean breezes, hiking trails, exceptional schools, and a genuine neighborhood feel — without sacrificing proximity to the city\'s commercial and cultural centers. It is, in many ways, the most livable luxury community in Los Angeles.',
        marketOverview: 'Pacific Palisades has seen dramatic appreciation over the past decade, driven by supply constraints and sustained demand from tech executives, entertainment figures, and international buyers. Entry-level luxury begins around $3M, with the finest bluff-top and ocean-view estates reaching $20M+.',
        highlights: ['Blufftop Ocean Views', 'Palisades Village Dining', 'Top-Rated Schools', 'Mountains-to-Ocean Access', 'Temescal Canyon Trails', 'Strong Community Culture'],
        latitude: 34.0522,
        longitude: -118.5233,
        featured: false,
        seoTitle: 'Pacific Palisades Luxury Real Estate | Alexandra Voss',
        seoDescription: 'Pacific Palisades luxury homes and estates. Expert representation by Alexandra Voss, Beverly Hills real estate advisor.',
      },
    }),
    prisma.neighborhood.upsert({
      where: { slug: 'holmby-hills' },
      update: {},
      create: {
        name: 'Holmby Hills',
        slug: 'holmby-hills',
        heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=90',
        description: 'Holmby Hills completes the "Platinum Triangle" alongside Beverly Hills and Bel-Air, offering some of the most magnificent estate properties in the world. Characterized by vast parcels, mature tree canopies, and unparalleled architectural heritage, this is where Los Angeles\'s greatest estates reside.',
        lifestyle: 'Holmby Hills is defined by scale and seclusion. The neighborhood\'s large lots — many exceeding five acres — provide a sense of removal from the city that is remarkable given its central location. The Los Angeles Country Club borders the neighborhood to the south, and Westwood Village is minutes away.',
        marketOverview: 'Properties in Holmby Hills are among the rarest in California. The neighborhood\'s limited housing stock and trophy-asset character make it a preferred destination for buyers seeking legacy estates. Transactions rarely occur below $10M, and the most significant properties have traded at historic price points.',
        highlights: ['Platinum Triangle Location', 'Grand Estate Architecture', 'Adjacent to LA Country Club', 'Mature Tree-Lined Streets', 'Exceptional Privacy', 'Legacy Trophy Properties'],
        latitude: 34.0784,
        longitude: -118.4270,
        featured: false,
        seoTitle: 'Holmby Hills Estates | Alexandra Voss Luxury Real Estate',
        seoDescription: 'Holmby Hills luxury estates and trophy properties. Represented by Alexandra Voss, LA\'s premier luxury real estate advisor.',
      },
    }),
  ])
  console.log('✅ Neighborhoods created')

  const beverlyHillsId = neighborhoods[0].id
  const belAirId = neighborhoods[1].id
  const malibuId = neighborhoods[2].id
  const pacificPalisadesId = neighborhoods[3].id
  const holmbyHillsId = neighborhoods[4].id

  // ─── Properties ───────────────────────────────────────────────────────────
  const propertiesData = [
    {
      title: '12 Carolwood Drive',
      slug: '12-carolwood-drive',
      description: 'An extraordinary Holmby Hills estate of rare architectural distinction, offering over 14,000 square feet of meticulously curated living across a private 1.2-acre promontory. The residence, designed by architect William Hefner, presents a masterful dialogue between classical proportion and contemporary restraint. Grand motor court, resort-style pool complex, and a six-car gallery are among the exceptional appointments. The formal rooms flow seamlessly to covered outdoor pavilions framed by mature European olive trees, creating an atmosphere of perpetual summer elegance.',
      price: 28500000,
      status: PropertyStatus.FOR_SALE,
      address: '12 Carolwood Drive',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90024',
      bedrooms: 8,
      bathrooms: 11,
      squareFeet: 14200,
      lotSize: 1.2,
      yearBuilt: 2018,
      propertyType: PropertyType.LUXURY_ESTATE,
      amenities: ['Home Theater', 'Wine Cellar', 'Gym & Spa', 'Resort Pool & Spa', 'Six-Car Garage', 'Staff Quarters', 'Gourmet Kitchen', 'Smart Home System', 'Guest House', 'Motor Court'],
      latitude: 34.0784,
      longitude: -118.4270,
      featured: true,
      signature: true,
      representedAs: RepresentationType.SELLERS_AGENT,
      neighborhoodId: holmbyHillsId,
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=90', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=90', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=90', 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1600&q=90', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=90'],
    },
    {
      title: '1240 Stone Canyon Road',
      slug: '1240-stone-canyon-road',
      description: 'A landmark Bel-Air estate commanding sweeping canyon and city views from its elevated position above Stone Canyon Reservoir. The 10,800-square-foot Georgian-influenced residence offers museum-quality proportions, a double-height entry rotunda, and formal gardens designed by noted landscape architect Mark Rios. Every primary room captures panoramic views; the master suite features a private terrace, dual dressing rooms, and a spa bath that rivals any luxury resort. Motor court accommodates eight vehicles.',
      price: 19750000,
      status: PropertyStatus.FOR_SALE,
      address: '1240 Stone Canyon Road',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90077',
      bedrooms: 7,
      bathrooms: 9,
      squareFeet: 10800,
      lotSize: 0.85,
      yearBuilt: 2005,
      propertyType: PropertyType.LUXURY_ESTATE,
      amenities: ['Infinity Pool', 'Tennis Court', 'Wine Cave', 'Home Theater', 'Staff Suite', 'Formal Gardens', 'City View Terraces', 'Chef\'s Kitchen', 'Smart Automation', 'Security System'],
      latitude: 34.0908,
      longitude: -118.4428,
      featured: true,
      signature: false,
      representedAs: RepresentationType.SELLERS_AGENT,
      neighborhoodId: belAirId,
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=90', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=90', 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1600&q=90', 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1600&q=90'],
    },
    {
      title: '23688 Pacific Coast Highway',
      slug: '23688-pacific-coast-highway',
      description: 'An architectural triumph occupying a coveted Malibu oceanfront position with direct private beach access and unobstructed Pacific views from every principal room. The 7,200-square-foot contemporary masterwork was conceived as a love letter to the California coast: expansive glass walls dissolve the boundary between interior and ocean, a cantilevered deck hovers above the waterline, and the open-plan great room flows directly to the sand. Four ensuite guest quarters, a rooftop terrace, and a private boat dock complete this singular offering.',
      price: 34900000,
      status: PropertyStatus.JUST_LISTED,
      address: '23688 Pacific Coast Highway',
      city: 'Malibu',
      state: 'CA',
      zip: '90265',
      bedrooms: 5,
      bathrooms: 7,
      squareFeet: 7200,
      lotSize: 0.42,
      yearBuilt: 2021,
      propertyType: PropertyType.LUXURY_ESTATE,
      amenities: ['Direct Beach Access', 'Private Boat Dock', 'Rooftop Terrace', 'Infinity Pool', 'Outdoor Kitchen', 'Home Theater', 'Chef\'s Kitchen', 'Smart Home System', 'Guest Suite', 'Panoramic Ocean Views'],
      latitude: 34.0259,
      longitude: -118.7798,
      featured: true,
      signature: false,
      representedAs: RepresentationType.SELLERS_AGENT,
      neighborhoodId: malibuId,
      images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&q=90', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600&q=90', 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1600&q=90', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=90'],
    },
    {
      title: '902 N Roxbury Drive',
      slug: '902-n-roxbury-drive',
      description: 'A flawless Beverly Hills Traditional positioned on one of the most sought-after streets in the flats. Recently subjected to an exhaustive renovation by interior designer Martyn Lawrence Bullard, the 8,400-square-foot residence balances classic architectural detail with contemporary luxury living. The garden, pool, and entertaining pavilion are exceptional; the kitchen, designed in collaboration with a Michelin-starred chef, is among the finest in Beverly Hills.',
      price: 12500000,
      status: PropertyStatus.FOR_SALE,
      address: '902 N Roxbury Drive',
      city: 'Beverly Hills',
      state: 'CA',
      zip: '90210',
      bedrooms: 6,
      bathrooms: 7,
      squareFeet: 8400,
      lotSize: 0.52,
      yearBuilt: 1938,
      propertyType: PropertyType.SINGLE_FAMILY,
      amenities: ['Heated Pool & Spa', 'Formal Garden', 'Chef\'s Kitchen', 'Wine Cellar', 'Library', 'Home Theater', 'Guest Suite', 'Three-Car Garage', 'Smart Home', 'Security Gate'],
      latitude: 34.0736,
      longitude: -118.4004,
      featured: true,
      signature: false,
      representedAs: RepresentationType.SELLERS_AGENT,
      neighborhoodId: beverlyHillsId,
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=90', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=90', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=90', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=90'],
    },
    {
      title: '1481 Amalfi Drive',
      slug: '1481-amalfi-drive',
      description: 'Perched atop the bluffs of Pacific Palisades with panoramic ocean and canyon views, this contemporary estate represents the pinnacle of California indoor-outdoor living. Designed by Marmol Radziner, the 6,800-square-foot residence features retractable glass walls, a resort-caliber pool terrace, and meticulously crafted interiors that draw from the natural palette of the surrounding landscape.',
      price: 9850000,
      status: PropertyStatus.UNDER_CONTRACT,
      address: '1481 Amalfi Drive',
      city: 'Pacific Palisades',
      state: 'CA',
      zip: '90272',
      bedrooms: 5,
      bathrooms: 6,
      squareFeet: 6800,
      lotSize: 0.67,
      yearBuilt: 2017,
      propertyType: PropertyType.LUXURY_ESTATE,
      amenities: ['Ocean View Terrace', 'Infinity Pool', 'Outdoor Kitchen', 'Home Office', 'Wine Room', 'Four-Car Garage', 'Smart Home', 'Generator', 'Guest Suite', 'Fitness Room'],
      latitude: 34.0522,
      longitude: -118.5233,
      featured: false,
      signature: false,
      representedAs: RepresentationType.SELLERS_AGENT,
      neighborhoodId: pacificPalisadesId,
      images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=90', 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1600&q=90', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=90'],
    },
    {
      title: '414 St Pierre Road',
      slug: '414-st-pierre-road',
      description: 'A rare Bel-Air compound offering extraordinary privacy and scale on 1.8 gated acres. The main residence of 9,200 square feet is joined by a two-bedroom guest house, a full tennis complex, and a resort-caliber pool pavilion with bar and changing rooms. The property\'s mature canopy of oak and olive trees creates an atmosphere of profound seclusion despite its proximity to Beverly Hills.',
      price: 16200000,
      status: PropertyStatus.FOR_SALE,
      address: '414 St Pierre Road',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90077',
      bedrooms: 9,
      bathrooms: 10,
      squareFeet: 12400,
      lotSize: 1.8,
      yearBuilt: 1992,
      propertyType: PropertyType.LUXURY_ESTATE,
      amenities: ['Tennis Court', 'Pool Pavilion', 'Guest House', 'Home Gym', 'Wine Cellar', 'Home Theater', 'Staff Quarters', 'Motor Court', 'Professional Kitchen', 'Security System'],
      latitude: 34.0920,
      longitude: -118.4450,
      featured: false,
      signature: false,
      representedAs: RepresentationType.SELLERS_AGENT,
      neighborhoodId: belAirId,
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=90', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=90', 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1600&q=90'],
    },
    // SOLD PROPERTIES
    {
      title: '1011 N Hillcrest Road',
      slug: '1011-n-hillcrest-road',
      description: 'A landmark Beverly Hills estate meticulously restored to its original 1930s grandeur while integrating every modern luxury.',
      price: 22000000,
      status: PropertyStatus.SOLD,
      soldPrice: 21500000,
      soldDate: new Date('2024-08-15'),
      address: '1011 N Hillcrest Road',
      city: 'Beverly Hills',
      state: 'CA',
      zip: '90210',
      bedrooms: 7,
      bathrooms: 9,
      squareFeet: 11200,
      lotSize: 0.94,
      yearBuilt: 1934,
      propertyType: PropertyType.LUXURY_ESTATE,
      amenities: ['Pool', 'Tennis Court', 'Wine Cellar', 'Guest House'],
      latitude: 34.0750,
      longitude: -118.4100,
      featured: false,
      signature: false,
      representedAs: RepresentationType.SELLERS_AGENT,
      neighborhoodId: beverlyHillsId,
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=90', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=90'],
    },
    {
      title: '24440 Malibu Road',
      slug: '24440-malibu-road',
      description: 'A coveted Malibu Colony compound with 85 feet of private beach frontage.',
      price: 41000000,
      status: PropertyStatus.SOLD,
      soldPrice: 38750000,
      soldDate: new Date('2024-05-22'),
      address: '24440 Malibu Road',
      city: 'Malibu',
      state: 'CA',
      zip: '90265',
      bedrooms: 6,
      bathrooms: 8,
      squareFeet: 8900,
      lotSize: 0.38,
      yearBuilt: 2008,
      propertyType: PropertyType.LUXURY_ESTATE,
      amenities: ['Oceanfront', 'Private Beach', 'Pool', 'Rooftop Deck', 'Boat Dock'],
      latitude: 34.0240,
      longitude: -118.7820,
      featured: false,
      signature: false,
      representedAs: RepresentationType.SELLERS_AGENT,
      neighborhoodId: malibuId,
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=90', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&q=90'],
    },
    {
      title: '750 Bel Air Road',
      slug: '750-bel-air-road',
      description: 'A stately Georgian manor on Bel Air Road with exceptional motor court and sweeping grounds.',
      price: 14800000,
      status: PropertyStatus.SOLD,
      soldPrice: 14200000,
      soldDate: new Date('2024-03-10'),
      address: '750 Bel Air Road',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90077',
      bedrooms: 6,
      bathrooms: 8,
      squareFeet: 9800,
      lotSize: 0.78,
      yearBuilt: 1949,
      propertyType: PropertyType.SINGLE_FAMILY,
      amenities: ['Pool & Spa', 'Tennis Court', 'Wine Cellar', 'Motor Court'],
      latitude: 34.0890,
      longitude: -118.4380,
      featured: false,
      signature: false,
      representedAs: RepresentationType.BUYERS_AGENT,
      neighborhoodId: belAirId,
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=90'],
    },
    {
      title: 'Penthouse at The Century',
      slug: 'penthouse-at-the-century',
      description: 'The crown jewel of Century City\'s most prestigious tower, offering 360-degree panoramic views from Santa Monica Bay to downtown Los Angeles.',
      price: 19500000,
      status: PropertyStatus.SOLD,
      soldPrice: 18900000,
      soldDate: new Date('2023-11-30'),
      address: '1 Century Drive, PH-44',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90067',
      bedrooms: 4,
      bathrooms: 5,
      squareFeet: 6200,
      yearBuilt: 2010,
      propertyType: PropertyType.PENTHOUSE,
      amenities: ['360° Views', 'Private Terrace', 'Concierge', 'Valet', 'Gym', 'Pool', 'Private Wine Storage'],
      latitude: 34.0557,
      longitude: -118.4165,
      featured: false,
      signature: false,
      representedAs: RepresentationType.BUYERS_AGENT,
      neighborhoodId: null,
      images: ['https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1600&q=90', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=90'],
    },
  ]

  for (const p of propertiesData) {
    const { images, ...propertyData } = p
    const existing = await prisma.property.findUnique({ where: { slug: p.slug } })
    if (!existing) {
      const property = await prisma.property.create({ data: propertyData })
      await Promise.all(images.map((url, i) =>
        prisma.propertyImage.create({
          data: { propertyId: property.id, url, alt: property.title, order: i, isCover: i === 0 },
        })
      ))
    }
  }
  console.log('✅ Properties created')

  // ─── Testimonials ─────────────────────────────────────────────────────────
  const testimonials = [
    {
      clientName: 'Richard & Catherine Harmon',
      review: 'Alexandra\'s knowledge of the Bel-Air market is simply unmatched. She guided us through an incredibly complex purchase with grace and patience, ultimately securing a property that was never publicly listed. Her network is extraordinary, and her counsel throughout was that of a true fiduciary. We would not consider working with anyone else.',
      rating: 5,
      transactionType: 'Buyer Representation',
      location: 'Bel-Air, CA',
      propertyAddress: '1240 Stone Canyon Road',
      featured: true,
    },
    {
      clientName: 'Marcus T.',
      review: 'Selling a property of this caliber requires an advisor who understands that the sale is about far more than the transaction. Alexandra marketed our Malibu estate with extraordinary discretion and produced multiple qualified buyers within three weeks of a quiet launch. The final sale price exceeded our expectations by $2.1 million.',
      rating: 5,
      transactionType: 'Seller Representation',
      location: 'Malibu, CA',
      propertyAddress: '24440 Malibu Road',
      featured: true,
    },
    {
      clientName: 'Jennifer & David Calloway',
      review: 'We\'d been searching for the right Beverly Hills home for nearly two years before a colleague referred us to Alexandra. Within sixty days of our first meeting, we were in escrow on the most beautiful property we\'ve ever seen — one that had never appeared on the MLS. Her off-market access is real, and her negotiating skill on our behalf was remarkable.',
      rating: 5,
      transactionType: 'Buyer Representation',
      location: 'Beverly Hills, CA',
      featured: true,
    },
    {
      clientName: 'Anastasia V.',
      review: 'As an international buyer unfamiliar with the Los Angeles market, I required an advisor who could be my guide, my advocate, and my confidante. Alexandra was all three, and more. Her patience with my questions, her depth of knowledge about every micro-market in the city, and her ability to negotiate on my behalf were truly impressive.',
      rating: 5,
      transactionType: 'Buyer Representation',
      location: 'Pacific Palisades, CA',
      featured: true,
    },
    {
      clientName: 'The Nakamura Family',
      review: 'We trusted Alexandra to handle the sale of our family\'s Holmby Hills estate, a property with deep personal significance. She treated the process with the sensitivity and professionalism it required, found the right buyer, and achieved a record price for the street. We are grateful beyond words.',
      rating: 5,
      transactionType: 'Seller Representation',
      location: 'Holmby Hills, CA',
      featured: false,
    },
    {
      clientName: 'Thomas & Sarah Whitfield',
      review: 'Alexandra represented us in both the sale of our Brentwood home and the subsequent purchase of our new Pacific Palisades estate. Managing both transactions simultaneously requires extraordinary coordination and expertise. Alexandra made the entire experience feel effortless.',
      rating: 5,
      transactionType: 'Buy & Sell Representation',
      location: 'Pacific Palisades, CA',
      featured: false,
    },
  ]

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t }).catch(() => {})
  }
  console.log('✅ Testimonials created')

  // ─── Media Mentions ───────────────────────────────────────────────────────
  const media = [
    { publication: 'The Wall Street Journal', title: 'LA\'s Most Powerful Real Estate Agents', url: '#', date: new Date('2024-09-01'), logo: '', featured: true },
    { publication: 'Los Angeles Magazine', title: 'Top 20 Real Estate Agents in LA', url: '#', date: new Date('2024-07-15'), logo: '', featured: true },
    { publication: 'Forbes', title: 'The Real Estate Agents Shaping Luxury Markets', url: '#', date: new Date('2024-03-20'), logo: '', featured: true },
    { publication: 'Architectural Digest', title: 'Inside LA\'s Most Extraordinary Property Sales', url: '#', date: new Date('2023-11-10'), logo: '', featured: false },
    { publication: 'The Real Deal', title: '$38.75M Malibu Colony Sale Sets Market Record', url: '#', date: new Date('2024-06-05'), logo: '', featured: false },
    { publication: 'Mansion Global', title: 'Beverly Hills Market Report: A Broker\'s Perspective', url: '#', date: new Date('2024-01-18'), logo: '', featured: false },
  ]

  for (const m of media) {
    await prisma.mediaMention.create({ data: m }).catch(() => {})
  }
  console.log('✅ Media mentions created')

  // ─── Awards ───────────────────────────────────────────────────────────────
  const awards = [
    { title: 'Certified Luxury Home Marketing Specialist (CLHMS)', issuer: 'Institute for Luxury Home Marketing', year: 2012, description: 'Top 1% designation awarded to agents demonstrating exceptional expertise in the luxury market.' },
    { title: '#1 Agent — Los Angeles County', issuer: 'The Agency', year: 2024, description: 'Ranked first by sales volume among all agents in Los Angeles County.' },
    { title: 'Wall Street Journal Top 250 Agents', issuer: 'The Wall Street Journal', year: 2024, description: 'Recognized among the 250 highest-performing agents nationwide.' },
    { title: 'Five Star Real Estate Agent', issuer: 'Five Star Professional', year: 2023, description: 'Annual award based on client satisfaction and service excellence.' },
    { title: 'Platinum Circle Award', issuer: 'National Association of Realtors', year: 2023, description: 'For career sales volume exceeding $2 billion.' },
    { title: 'MBA — Marshall School of Business', issuer: 'University of Southern California', year: 2006, description: '' },
  ]

  for (const a of awards) {
    await prisma.award.create({ data: a }).catch(() => {})
  }
  console.log('✅ Awards created')

  // ─── Insights / Blog Posts ────────────────────────────────────────────────
  const insightsData = [
    {
      title: 'The State of the Beverly Hills Luxury Market: Q3 2024',
      slug: 'beverly-hills-luxury-market-q3-2024',
      excerpt: 'Despite broader macroeconomic headwinds, the Beverly Hills luxury market continues to demonstrate remarkable resilience. A detailed analysis of current trends, price movements, and what they mean for buyers and sellers.',
      content: `<h2>A Market That Defies Gravity</h2><p>The Beverly Hills luxury market has always operated by its own rules. In a year characterized by rising interest rates and heightened uncertainty in the broader residential market, properties priced above $5 million in Beverly Hills, Bel-Air, and Holmby Hills have continued to trade at robust levels — and in many cases, at prices that set new records.</p><p>Through the first three quarters of 2024, we have seen 47 transactions close above $10 million in the 90210 ZIP code alone — a figure that represents a 12% increase over the same period in 2023. What's driving this strength?</p><h2>The Scarcity Premium</h2><p>Perhaps the most significant factor is one that no monetary policy can address: there is a finite amount of land in Beverly Hills, and an effectively finite number of truly exceptional properties. As the pool of ultra-high-net-worth buyers globally continues to expand, the supply of trophy assets remains essentially static.</p><p>This structural scarcity creates a floor beneath luxury prices that has proven remarkably durable across multiple economic cycles. Buyers who understand this dynamic — particularly international buyers from Asia and Europe — continue to view Beverly Hills real estate as a store of value as much as a residence.</p><h2>What This Means for Sellers</h2><p>For sellers, the current environment is nuanced. Well-prepared, strategically priced properties continue to attract multiple qualified buyers and close at or above asking. Properties that are overpriced relative to the market, however, are sitting — sometimes for months — before sellers accept reality and reduce their expectations.</p><p>The key to success in this environment is partnering with an advisor who can price with precision on day one, and who has the network to reach qualified buyers before a property reaches the open market.</p><h2>What This Means for Buyers</h2><p>For buyers, the current environment offers more selection than we've seen in several years. The off-market opportunity remains significant — perhaps 40% of transactions I facilitate never appear on the MLS — and buyers who establish relationships with the right advisors gain access to inventory that the broader market never sees.</p><p>Interest rates, while higher than their historic lows, remain manageable for many luxury buyers who are either purchasing with cash or financing a portion of a portfolio-appropriate acquisition. The buyers I work with today are sophisticated enough to recognize that timing the market perfectly is a fool's errand; finding the right property is the only objective that matters.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=90',
      tags: ['Beverly Hills', 'Market Analysis', 'Luxury Real Estate', 'Q3 2024'],
      featured: true,
      status: InsightStatus.PUBLISHED,
      publishedAt: new Date('2024-10-01'),
      readTime: 8,
      seoTitle: 'Beverly Hills Luxury Market Report Q3 2024 | Alexandra Voss',
      seoDescription: 'In-depth analysis of the Beverly Hills luxury real estate market through Q3 2024. Price trends, transaction volume, and expert insights.',
    },
    {
      title: 'Why Off-Market Transactions Are Reshaping LA\'s Ultra-Luxury Segment',
      slug: 'off-market-transactions-la-ultra-luxury',
      excerpt: 'A growing share of LA\'s highest-value transactions never touch the public market. Understanding why — and how to access them — is the single most important competitive advantage for serious buyers.',
      content: `<h2>The Invisible Market</h2><p>If you rely solely on the MLS or real estate portals to identify luxury opportunities in Los Angeles, you are seeing roughly half of the market — and in some neighborhoods, considerably less. The off-market segment has grown substantially over the past decade, and it is now the dominant channel for transactions above $15 million in neighborhoods like Bel-Air, Holmby Hills, and select pockets of Beverly Hills.</p><h2>Why Sellers Choose Privacy</h2><p>The reasons sellers choose to transact off-market are numerous and understandable. Days on market creates a perception of stigma that can undermine negotiating position. Public listings attract curiosity seekers as well as qualified buyers, creating security concerns for high-profile owners. And for sellers who are not yet certain of their timeline, a quiet exploration of the market carries none of the commitment of a formal listing.</p><h2>The Broker Network Advantage</h2><p>Access to off-market inventory is fundamentally a function of relationships. Sellers who wish to transact quietly turn to trusted advisors who they know can deliver qualified, serious buyers efficiently and discreetly. Those advisors, in turn, maintain close relationships with other top-tier brokers and with the ecosystem of family offices, private wealth managers, and attorneys who represent ultra-high-net-worth individuals.</p><p>Over 18 years in this market, I have built precisely these relationships. They represent the most durable competitive advantage I offer my clients — both buyers seeking access and sellers seeking discretion.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=90',
      tags: ['Off-Market', 'Luxury Real Estate', 'Buying Strategy', 'Los Angeles'],
      featured: true,
      status: InsightStatus.PUBLISHED,
      publishedAt: new Date('2024-09-12'),
      readTime: 6,
      seoTitle: 'Off-Market Luxury Real Estate Los Angeles | Alexandra Voss',
      seoDescription: 'How off-market transactions are reshaping LA\'s luxury real estate segment and how serious buyers can gain access.',
    },
    {
      title: 'A Guide to Understanding Luxury Property Valuation in Los Angeles',
      slug: 'luxury-property-valuation-los-angeles',
      excerpt: 'Valuing a luxury property is an art as much as a science. Standard appraisal methodologies often fail to capture the nuances that drive price in the ultra-premium segment. Here\'s how experienced advisors approach the question.',
      content: `<h2>Beyond the Comparable Sale</h2><p>In standard residential real estate, valuation is relatively straightforward: identify comparable sold properties, adjust for differences, and arrive at a supportable range. In the luxury segment, this methodology breaks down quickly. When two properties of broadly similar specification trade for $12 million and $19 million respectively, it is almost always because of factors that no algorithmic model can capture.</p><h2>The Elements That Defy Formulas</h2><p>View is perhaps the most significant of these factors. An unobstructed ocean view in Malibu can add $5-10 million to a property's value over an otherwise comparable home with no view. Similarly, a trophy address on a street with cultural or historical significance — Carolwood Drive, Sunset Boulevard, or Copa de Oro — commands a premium that transcends the property's physical attributes.</p><p>Privacy is another undervalued variable. A property on 1.2 acres that feels completely secluded will consistently outperform a similar property on an equivalent parcel where neighboring structures are visible. The psychology of privacy is deeply embedded in the luxury buyer's psyche.</p><h2>How I Approach Valuation</h2><p>When I'm advising a seller on pricing strategy, I examine not just recent sold data but the current competitive set — what will buyers see when they look at your home alongside the alternatives? I consider the story of the property: its history, its provenance, the quality of its execution. And I consider the buyer profile most likely to value what your specific property offers.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1600&q=90',
      tags: ['Property Valuation', 'Selling Strategy', 'Luxury Real Estate'],
      featured: false,
      status: InsightStatus.PUBLISHED,
      publishedAt: new Date('2024-08-05'),
      readTime: 7,
      seoTitle: 'Luxury Property Valuation Guide Los Angeles | Alexandra Voss',
      seoDescription: 'Expert guide to understanding luxury property valuation in Los Angeles. How experienced advisors assess value in the ultra-premium segment.',
    },
    {
      title: 'Malibu\'s Carbon Beach: The Last Great Oceanfront Opportunity',
      slug: 'malibu-carbon-beach-oceanfront-opportunity',
      excerpt: 'Known as "Billionaire\'s Beach," Carbon Beach in Malibu represents one of the most finite and coveted real estate markets in the world. A deep dive into this extraordinary stretch of California coastline.',
      content: `<h2>The World's Most Exclusive Stretch of Sand</h2><p>Carbon Beach — the 1.8-mile stretch of Malibu shoreline fronting Pacific Coast Highway between Malibu Pier and Malibu Colony — has been called "Billionaire's Beach" for decades, and the nickname has only grown more accurate with time. The roughly 90 properties along this strip of Pacific sand represent a genuine scarcity in a world where ultra-high-net-worth individuals have almost unlimited options.</p><h2>What Makes Carbon Beach Different</h2><p>Three factors combine to make Carbon Beach properties uniquely desirable. First, the beach itself: wide, sandy, and relatively protected from the most aggressive currents, it offers genuine usability that more dramatic oceanfront positions sometimes lack. Second, the community: a number of notable figures have owned here over the decades, creating a self-reinforcing cachet that perpetuates demand. Third, and most importantly: supply. Properties here rarely come to market, and when they do, they trade quickly.</p><h2>Market Dynamics</h2><p>The Carbon Beach market is almost entirely driven by cash buyers, many of them international. Properties have traded at prices ranging from $18 million for smaller, older structures to over $110 million for the most exceptional offerings. The key metric here is price per foot of oceanfront — not price per square foot of living space.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=90',
      tags: ['Malibu', 'Oceanfront', 'Carbon Beach', 'Investment', 'Neighborhood Spotlight'],
      featured: false,
      status: InsightStatus.PUBLISHED,
      publishedAt: new Date('2024-07-20'),
      readTime: 9,
      seoTitle: 'Malibu Carbon Beach Real Estate Guide | Alexandra Voss',
      seoDescription: 'An in-depth look at Malibu\'s Carbon Beach — the most coveted oceanfront real estate in California.',
    },
    {
      title: 'The Art of Staging a Trophy Property',
      slug: 'art-of-staging-trophy-property',
      excerpt: 'First impressions in luxury real estate operate at a different level. When a property trades above $10 million, the physical presentation must communicate value instantly. Here\'s how the professionals do it.',
      content: `<h2>Staging at the Highest Level</h2><p>Staging a luxury property bears little resemblance to its entry-level counterpart. There are no rental trucks, no IKEA furniture, no scented candles from Target. At the trophy level, staging is an exercise in lifestyle curation — and it requires the involvement of designers, stylists, and specialists who work exclusively in this segment.</p><h2>The Investment Case</h2><p>Properly staged luxury properties consistently outperform unstaged alternatives. The return on investment from top-tier staging at the $10M+ level is one of the most compelling in real estate. I've seen properties where a $150,000 staging investment generated $800,000 in additional sale price — a return that most asset classes cannot match.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=90',
      tags: ['Staging', 'Selling Strategy', 'Luxury Properties'],
      featured: false,
      status: InsightStatus.PUBLISHED,
      publishedAt: new Date('2024-06-15'),
      readTime: 5,
      seoTitle: 'How to Stage a Luxury Trophy Property | Alexandra Voss',
      seoDescription: 'Expert advice on staging luxury properties for maximum impact and value. Insights from a Beverly Hills luxury real estate advisor.',
    },
  ]

  for (const ins of insightsData) {
    const catId = categories[0].id
    await prisma.insight.create({ data: { ...ins, categoryId: catId } }).catch(() => {})
  }
  console.log('✅ Insights created')

  // ─── Sample Leads ─────────────────────────────────────────────────────────
  const leads = [
    { name: 'James Whitmore', email: 'jwhitmore@example.com', phone: '(310) 555-0189', interest: LeadInterest.BUYING, message: 'Looking for a Beverly Hills home in the $8-12M range. Need 5+ bedrooms, pool, preferably in the flats.', preferredContact: 'phone', status: LeadStatus.QUALIFIED },
    { name: 'Sofia Andreessen', email: 'sofia.a@example.com', phone: '', interest: LeadInterest.SELLING, message: 'Considering listing our Malibu property. Curious about current market conditions.', preferredContact: 'email', status: LeadStatus.CONTACTED },
    { name: 'David & Michelle Park', email: 'dpark@example.com', phone: '(424) 555-0267', interest: LeadInterest.VALUATION, message: 'Would like a valuation for our Bel-Air home before deciding whether to sell.', preferredContact: 'phone', status: LeadStatus.NEW },
    { name: 'Anonymous', email: 'inquiry@example.com', phone: '', interest: LeadInterest.BUYING, message: 'International buyer looking for a discreet acquisition in the $20M+ range. Prefer off-market.', preferredContact: 'email', status: LeadStatus.NEW },
    { name: 'Robert Chen', email: 'rchen@example.com', phone: '(818) 555-0341', interest: LeadInterest.CONSULTATION, message: 'First-time luxury buyer, would like to discuss the process and available inventory.', preferredContact: 'email', status: LeadStatus.NEW },
  ]

  for (const lead of leads) {
    await prisma.lead.create({ data: lead }).catch(() => {})
  }
  console.log('✅ Sample leads created')

  console.log('\n🎉 Seeding complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
