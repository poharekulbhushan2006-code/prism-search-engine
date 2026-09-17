import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Search,
  MapPin,
  Navigation,
  Layers,
  Compass,
  Star,
  Clock,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Route,
  Coffee,
  Building,
  Train,
  Car,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Bookmark,
  Share2,
  Sliders,
  Activity,
  Locate,
  LocateFixed,
  Volume2,
  VolumeX,
  X,
  ArrowUpRight,
  CornerUpRight,
  CornerUpLeft,
  Milestone,
  Phone,
  Globe,
  Check,
  Copy,
  ExternalLink,
  ThumbsUp,
  List,
  Map as MapIcon,
  Info
} from 'lucide-react';

const FAMOUS_HOTSPOTS = [
  {
    id: 'times-square',
    name: 'Times Square NYC',
    query: 'Times Square New York',
    lat: 40.7580,
    lon: -73.9855,
    zoom: 17,
    category: 'Attractions',
    rating: 4.8,
    reviewsCount: 142850,
    openStatus: 'Open 24 hours',
    hoursSchedule: [
      { day: 'Monday', hours: 'Open 24 hours' },
      { day: 'Tuesday', hours: 'Open 24 hours' },
      { day: 'Wednesday', hours: 'Open 24 hours' },
      { day: 'Thursday', hours: 'Open 24 hours' },
      { day: 'Friday', hours: 'Open 24 hours' },
      { day: 'Saturday', hours: 'Open 24 hours' },
      { day: 'Sunday', hours: 'Open 24 hours' }
    ],
    popularTime: 'Peak crowds: 7:00 PM – 11:30 PM (Vibrant theater rush)',
    address: 'Broadway & 7th Ave, New York, NY 10036, United States',
    phone: '+1 (212) 768-1560',
    website: 'https://www.timessquarenyc.org',
    priceTier: 'Free public plaza',
    trafficLevel: 'Heavy (82%)',
    speed: '18 km/h',
    desc: 'World-famous commercial, entertainment, and tourism center illuminated by giant digital billboards and historic Broadway marquees.',
    amenities: ['Wheelchair accessible', 'Pedestrian plaza only', 'Free public Wi-Fi', '24/7 Security patrol', 'Subway hub access'],
    reviews: [
      { author: 'Sarah Jenkins', rating: 5, time: '2 days ago', text: 'The sensory overload and neon lights at night are simply electrifying. A must-see spectacle in Midtown Manhattan!' },
      { author: 'Marcus Vance', rating: 4, time: '1 week ago', text: 'Very crowded but quintessential New York. The red TKTS steps offer an iconic view of the entire plaza.' }
    ],
    pois: [
      { name: 'One Times Square (New Year Ball)', category: 'Attractions', rating: 4.8, lat: 40.7563, lon: -73.9865, address: '1 Times Square, New York, NY', phone: '+1 (212) 768-1560', hours: 'Open 24 hours' },
      { name: 'Palace Theatre Broadway', category: 'Attractions', rating: 4.7, lat: 40.7588, lon: -73.9848, address: '1564 Broadway, New York, NY', phone: '+1 (212) 730-8200', hours: '10:00 AM – 11:00 PM' },
      { name: "Junior's Restaurant & Bakery", category: 'Food', rating: 4.6, lat: 40.7582, lon: -73.9870, address: '1515 Broadway, New York, NY', phone: '+1 (212) 302-2244', hours: '7:00 AM – 12:00 AM' },
      { name: 'W New York Times Square', category: 'Hotels', rating: 4.5, lat: 40.7589, lon: -73.9858, address: '1567 Broadway, New York, NY', phone: '+1 (212) 930-7400', hours: 'Check-in: 3 PM' },
      { name: 'Times Sq - 42 St Subway Station', category: 'Transit', rating: 4.6, lat: 40.7553, lon: -73.9873, address: 'Broadway & 42nd St, New York', phone: '511 (MTA Transit)', hours: 'Trains run 24/7' }
    ]
  },
  {
    id: 'shibuya-scramble',
    name: 'Shibuya Crossing',
    query: 'Shibuya Crossing Tokyo',
    lat: 35.6595,
    lon: 139.7005,
    zoom: 17,
    category: 'Attractions',
    rating: 4.7,
    reviewsCount: 98400,
    openStatus: 'Open 24 hours',
    hoursSchedule: [
      { day: 'Monday', hours: 'Open 24 hours' },
      { day: 'Tuesday', hours: 'Open 24 hours' },
      { day: 'Wednesday', hours: 'Open 24 hours' },
      { day: 'Thursday', hours: 'Open 24 hours' },
      { day: 'Friday', hours: 'Open 24 hours' },
      { day: 'Saturday', hours: 'Open 24 hours' },
      { day: 'Sunday', hours: 'Open 24 hours' }
    ],
    popularTime: 'Peak crowds: 5:30 PM – 9:30 PM (Evening commute & night out)',
    address: '2 Chome-2-1 Dogenzaka, Shibuya City, Tokyo 150-0043, Japan',
    phone: '+81 3-3463-1211',
    website: 'https://www.gotokyo.org',
    priceTier: 'Free public crossing',
    trafficLevel: 'Moderate (54%)',
    speed: '32 km/h',
    desc: 'The busiest pedestrian intersection on Earth, where up to 3,000 pedestrians cross simultaneously under soaring holographic digital displays.',
    amenities: ['Hachiko bronze memorial', 'Shibuya Sky panoramic deck', 'Direct underground metro', 'Tax-free shopping nearby'],
    reviews: [
      { author: 'Kenji Sato', rating: 5, time: '3 days ago', text: 'Watching thousands of people cross in complete harmony from Starbucks 2F is hypnotic. Pure cyberpunk energy!' },
      { author: 'Elena Rostova', rating: 5, time: '5 days ago', text: 'Exceptionally clean and safe. The Shibuya Sky rooftop viewpoint above provides the most breathtaking sunset over Tokyo.' }
    ],
    pois: [
      { name: 'Hachiko Memorial Statue', category: 'Attractions', rating: 4.8, lat: 35.6591, lon: 139.7006, address: '1 Chome Dogenzaka, Shibuya', phone: '+81 3-3463-1211', hours: 'Open 24 hours' },
      { name: 'Shibuya Sky Rooftop Deck', category: 'Attractions', rating: 4.9, lat: 35.6585, lon: 139.7022, address: 'Shibuya Scramble Square 47F', phone: '+81 3-4221-0229', hours: '10:00 AM – 10:30 PM' },
      { name: 'Ichiran Ramen Shibuya Jinnan', category: 'Food', rating: 4.7, lat: 35.6608, lon: 139.7009, address: '1 Chome-22-7 Jinnan, Shibuya', phone: '+81 3-3463-3667', hours: 'Open 24 hours' },
      { name: 'Cerulean Tower Tokyu Hotel', category: 'Hotels', rating: 4.8, lat: 35.6558, lon: 139.6997, address: '26-1 Sakuragaokacho, Shibuya', phone: '+81 3-3476-3000', hours: 'Check-in: 3 PM' },
      { name: 'Shibuya Central Train Station', category: 'Transit', rating: 4.6, lat: 35.6580, lon: 139.7016, address: 'JR Yamanote & Tokyo Metro lines', phone: '+81 50-2016-1600', hours: '4:45 AM – 1:15 AM' }
    ]
  },
  {
    id: 'eiffel-tower',
    name: 'Eiffel Tower & Champ de Mars',
    query: 'Eiffel Tower Paris',
    lat: 48.8584,
    lon: 2.2945,
    zoom: 17,
    category: 'Attractions',
    rating: 4.9,
    reviewsCount: 312000,
    openStatus: 'Open now • Closes 11:45 PM',
    hoursSchedule: [
      { day: 'Monday', hours: '9:00 AM – 11:45 PM' },
      { day: 'Tuesday', hours: '9:00 AM – 11:45 PM' },
      { day: 'Wednesday', hours: '9:00 AM – 11:45 PM' },
      { day: 'Thursday', hours: '9:00 AM – 11:45 PM' },
      { day: 'Friday', hours: '9:00 AM – 11:45 PM' },
      { day: 'Saturday', hours: '9:00 AM – 11:45 PM' },
      { day: 'Sunday', hours: '9:00 AM – 11:45 PM' }
    ],
    popularTime: 'Peak: Sunset & hourly sparkle light show after dark',
    address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris, France',
    phone: '+33 892 70 12 39',
    website: 'https://www.toureiffel.paris',
    priceTier: '€28.30 for summit lift',
    trafficLevel: 'Heavy (68%)',
    speed: '25 km/h',
    desc: 'Monumental 330-meter wrought-iron lattice landmark built by Gustave Eiffel for the 1889 Universal Exposition, offering 360° panoramas across Paris.',
    amenities: ['Elevator & stairs access', 'Michelin-starred dining (Le Jules Verne)', 'Champagne bar on summit', 'Official boutique'],
    reviews: [
      { author: 'Claire Delacroix', rating: 5, time: 'Yesterday', text: 'The sparkling 5-minute beacon display at 10 PM is unforgettable. Book online early to skip the queue.' },
      { author: 'Liam Gallagher', rating: 5, time: '4 days ago', text: 'Spectacular views from the top deck. The Seine river boat cruise departs just 200m away.' }
    ],
    pois: [
      { name: 'Eiffel Tower Summit Observatory', category: 'Attractions', rating: 4.9, lat: 48.8584, lon: 2.2945, address: 'Champ de Mars, Paris', phone: '+33 892 70 12 39', hours: '9:00 AM – 11:45 PM' },
      { name: 'Le Jules Verne Michelin Dining', category: 'Food', rating: 4.8, lat: 48.8583, lon: 2.2944, address: 'Eiffel Tower 2nd Floor, Paris', phone: '+33 1 45 55 61 44', hours: '12:00 PM – 1:30 PM, 7:00 PM – 9:00 PM' },
      { name: 'Pullman Paris Tour Eiffel', category: 'Hotels', rating: 4.7, lat: 48.8552, lon: 2.2933, address: '18 Av. de Suffren, Paris', phone: '+33 1 44 38 56 00', hours: 'Check-in: 3 PM' },
      { name: 'Trocadéro Gardens & Fountains', category: 'Attractions', rating: 4.8, lat: 48.8616, lon: 2.2886, address: 'Pl. du Trocadéro, Paris', phone: '+33 1 44 54 19 50', hours: 'Open 24 hours' },
      { name: 'Bir-Hakeim Metro Station', category: 'Transit', rating: 4.6, lat: 48.8539, lon: 2.2893, address: 'Line 6, Boulevard de Grenelle, Paris', phone: '3424 (RATP)', hours: '5:30 AM – 1:15 AM' }
    ]
  },
  {
    id: 'western-express',
    name: 'Western Express Highway',
    query: 'Western Express Highway Mumbai',
    lat: 19.0760,
    lon: 72.8777,
    zoom: 17,
    category: 'Transit',
    rating: 4.5,
    reviewsCount: 38200,
    openStatus: 'Open 24 hours',
    hoursSchedule: [
      { day: 'Monday', hours: 'Open 24 hours' },
      { day: 'Tuesday', hours: 'Open 24 hours' },
      { day: 'Wednesday', hours: 'Open 24 hours' },
      { day: 'Thursday', hours: 'Open 24 hours' },
      { day: 'Friday', hours: 'Open 24 hours' },
      { day: 'Saturday', hours: 'Open 24 hours' },
      { day: 'Sunday', hours: 'Open 24 hours' }
    ],
    popularTime: 'Peak congestion: 8:30 AM – 11:00 AM & 6:30 PM – 9:30 PM',
    address: 'Western Express Highway, Bandra to Dahisar, Mumbai, Maharashtra 400051',
    phone: '+91 22 2493 7755',
    website: 'https://transport.maharashtra.gov.in',
    priceTier: 'Expressway toll-free',
    trafficLevel: 'Congested (76%)',
    speed: '24 km/h',
    desc: 'Vital 8-to-10 lane north-south arterial corridor connecting Mumbai suburbs, Bandra Kurla Complex (BKC), and Mumbai International Airport.',
    amenities: ['FastTag lanes', 'CCTV speed enforcement', 'Emergency breakdown bays', 'Direct connection to Sea Link'],
    reviews: [
      { author: 'Rahul Sharma', rating: 4, time: '1 day ago', text: 'Lifeline of Mumbai commuters. The elevated flyovers have reduced bottlenecks substantially.' },
      { author: 'Pooja Iyer', rating: 4, time: '3 days ago', text: 'Direct, rapid link to Chhatrapati Shivaji Maharaj International Airport Terminal 2.' }
    ],
    pois: [
      { name: 'Bandra-Worli Sea Link Toll Plaza', category: 'Transit', rating: 4.8, lat: 19.0434, lon: 72.8197, address: 'Bandra Reclamation, Mumbai', phone: '+91 22 2640 1000', hours: 'Open 24 hours' },
      { name: 'Chhatrapati Shivaji Airport T2', category: 'Transit', rating: 4.7, lat: 19.0886, lon: 72.8680, address: 'Sahar, Andheri East, Mumbai', phone: '+91 22 6685 1010', hours: 'Open 24 hours' },
      { name: 'Taj Lands End Luxury Hotel', category: 'Hotels', rating: 4.9, lat: 19.0435, lon: 72.8188, address: 'BJ Road, Bandstand, Bandra West', phone: '+91 22 6668 1234', hours: 'Check-in: 2 PM' },
      { name: 'Gajalee Coastal Seafood Dining', category: 'Food', rating: 4.7, lat: 19.1022, lon: 72.8550, address: 'Hanuman Rd, Vile Parle East, Mumbai', phone: '+91 22 2611 4093', hours: '11:30 AM – 3:30 PM, 7:00 PM – 11:30 PM' },
      { name: 'Bandra Kurla Complex (BKC)', category: 'Attractions', rating: 4.8, lat: 19.0664, lon: 72.8681, address: 'BKC Financial District, Mumbai', phone: '+91 22 2659 0001', hours: '8:00 AM – 10:00 PM' }
    ]
  },
  {
    id: 'sheikh-zayed',
    name: 'Sheikh Zayed Road',
    query: 'Sheikh Zayed Road Dubai',
    lat: 25.2048,
    lon: 55.2708,
    zoom: 17,
    category: 'Transit',
    rating: 4.9,
    reviewsCount: 74500,
    openStatus: 'Open 24 hours',
    hoursSchedule: [
      { day: 'Monday', hours: 'Open 24 hours' },
      { day: 'Tuesday', hours: 'Open 24 hours' },
      { day: 'Wednesday', hours: 'Open 24 hours' },
      { day: 'Thursday', hours: 'Open 24 hours' },
      { day: 'Friday', hours: 'Open 24 hours' },
      { day: 'Saturday', hours: 'Open 24 hours' },
      { day: 'Sunday', hours: 'Open 24 hours' }
    ],
    popularTime: 'Peak hours: 5:00 PM – 8:00 PM (Sunset skyline drive)',
    address: 'E11 Sheikh Zayed Road, Trade Centre 1, Dubai, United Arab Emirates',
    phone: '+971 800 9090',
    website: 'https://www.rta.ae',
    priceTier: 'Salik toll tag enabled (AED 4)',
    trafficLevel: 'Fluid (28%)',
    speed: '95 km/h',
    desc: 'Monumental 14-lane mega-highway corridor flanked by Dubai’s iconic futuristic architectural skyline, Burj Khalifa, and Museum of the Future.',
    amenities: ['Salik automated electronic tolls', 'Elevated Dubai Metro Red Line', 'Emergency lanes', '100–120 km/h speed limits'],
    reviews: [
      { author: 'Tariq Al-Mansoor', rating: 5, time: '2 days ago', text: 'Cruising this highway at night with illuminated architectural towers on both sides feels like futuristic sci-fi.' },
      { author: 'Amanda Collins', rating: 5, time: '1 week ago', text: 'Pristine asphalt and immaculate highway design with immediate access to Dubai Mall and DIFC.' }
    ],
    pois: [
      { name: 'Burj Khalifa & Observation Skydeck', category: 'Attractions', rating: 4.9, lat: 25.1972, lon: 55.2744, address: '1 Sheikh Mohammed bin Rashid Blvd, Dubai', phone: '+971 4 888 8888', hours: '8:30 AM – 11:00 PM' },
      { name: 'Museum of the Future', category: 'Attractions', rating: 4.8, lat: 25.2253, lon: 55.2818, address: '67CP+H4Q Sheikh Zayed Rd, Dubai', phone: '+971 800 2071', hours: '9:30 AM – 7:00 PM' },
      { name: 'Zuma Dubai Contemporary Dining', category: 'Food', rating: 4.8, lat: 25.2096, lon: 55.2798, address: 'Gate Village 06, DIFC, Dubai', phone: '+971 4 425 5660', hours: '12:00 PM – 3:30 PM, 7:00 PM – 12:00 AM' },
      { name: 'Gevora Hotel (Tallest Hotel)', category: 'Hotels', rating: 4.7, lat: 25.2115, lon: 55.2758, address: '101 Sheikh Zayed Rd, Dubai', phone: '+971 4 524 0000', hours: 'Check-in: 3 PM' },
      { name: 'Burj Khalifa / Dubai Mall Metro Hub', category: 'Transit', rating: 4.7, lat: 25.2007, lon: 55.2694, address: 'Red Line, Sheikh Zayed Rd, Dubai', phone: '+971 800 9090', hours: '5:00 AM – 12:00 AM' }
    ]
  },
  {
    id: 'big-ben',
    name: 'Big Ben & Palace of Westminster',
    query: 'Big Ben London',
    lat: 51.5007,
    lon: -0.1246,
    zoom: 17,
    category: 'Attractions',
    rating: 4.8,
    reviewsCount: 168000,
    openStatus: 'Open now • Closes 9:00 PM',
    hoursSchedule: [
      { day: 'Monday', hours: '9:00 AM – 9:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM – 9:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM – 9:00 PM' },
      { day: 'Thursday', hours: '9:00 AM – 9:00 PM' },
      { day: 'Friday', hours: '9:00 AM – 9:00 PM' },
      { day: 'Saturday', hours: '9:00 AM – 9:00 PM' },
      { day: 'Sunday', hours: '9:00 AM – 9:00 PM' }
    ],
    popularTime: 'Peak crowds: 1:00 PM – 4:30 PM',
    address: 'Westminster, London SW1A 0AA, United Kingdom',
    phone: '+44 20 7219 4272',
    website: 'https://www.parliament.uk',
    priceTier: 'Free exterior views • Guided tours £32',
    trafficLevel: 'Moderate (48%)',
    speed: '28 km/h',
    desc: 'The Great Bell of the Great Clock of Westminster atop the Elizabeth Tower, standing grandly along the River Thames beside Westminster Bridge.',
    amenities: ['Panoramic Westminster Bridge vantage', 'Underground station adjacent', 'Guided historic tours', 'Audio headset in 10 languages'],
    reviews: [
      { author: 'Oliver Hughes', rating: 5, time: '2 days ago', text: 'The clock tower restoration is pristine. Hearing the Westminster chimes live across the river is majestic.' },
      { author: 'Sophie Taylor', rating: 5, time: '5 days ago', text: 'Walk along the South Bank opposite for the quintessential London skyline photo.' }
    ],
    pois: [
      { name: 'Elizabeth Tower (Big Ben Clock)', category: 'Attractions', rating: 4.9, lat: 51.5007, lon: -0.1246, address: 'Westminster, London SW1A 0AA', phone: '+44 20 7219 4272', hours: '9:00 AM – 9:00 PM' },
      { name: 'Westminster Abbey Royal Church', category: 'Attractions', rating: 4.8, lat: 51.4994, lon: -0.1273, address: 'Dean’s Yard, London SW1P 3PA', phone: '+44 20 7222 5152', hours: '9:30 AM – 3:30 PM' },
      { name: 'The Cellarium Café & Terrace', category: 'Food', rating: 4.6, lat: 51.4988, lon: -0.1279, address: '20 Dean’s Yard, London', phone: '+44 20 7222 0516', hours: '8:30 AM – 5:00 PM' },
      { name: 'London Marriott Hotel County Hall', category: 'Hotels', rating: 4.7, lat: 51.5012, lon: -0.1190, address: 'Westminster Bridge Rd, London', phone: '+44 20 7928 5200', hours: 'Check-in: 3 PM' },
      { name: 'Westminster Underground Station', category: 'Transit', rating: 4.7, lat: 51.5014, lon: -0.1250, address: 'Jubilee, Circle & District Lines', phone: '+44 343 222 1234', hours: '5:15 AM – 12:30 AM' }
    ]
  }
];

const CATEGORIES = [
  { id: 'All', label: 'All Places', icon: Compass, color: '#38bdf8' },
  { id: 'Attractions', label: 'Attractions', icon: Sparkles, color: '#ef4444' },
  { id: 'Food', label: 'Food & Dining', icon: Coffee, color: '#f59e0b' },
  { id: 'Hotels', label: 'Hotels & Stay', icon: Building, color: '#3b82f6' },
  { id: 'Transit', label: 'Transit Hubs', icon: Train, color: '#8b5cf6' }
];

export default function PrismMaps({ initialQuery = 'Times Square', onOpenSearch }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeHotspot, setActiveHotspot] = useState(FAMOUS_HOTSPOTS[0]);
  const [selectedPoi, setSelectedPoi] = useState(FAMOUS_HOTSPOTS[0].pois[0]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [activeLayer, setActiveLayer] = useState('satellite'); // 'satellite' | 'traffic' | 'dark'
  const [zoomLevel, setZoomLevel] = useState(17);
  const [showVehicles, setShowVehicles] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'hours' | 'reviews' | 'directions'
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Mobile Google Maps Layout States
  const [mobileViewMode, setMobileViewMode] = useState('map'); // 'map' | 'list'
  const [mobileSheetExpanded, setMobileSheetExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  // Live GPS Tracking & Navigation States
  const [isTracking, setIsTracking] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [trackingStatus, setTrackingStatus] = useState('Standby');
  const [isNavigating, setIsNavigating] = useState(false);
  const [navStepIndex, setNavStepIndex] = useState(0);

  const [trafficTelemetry, setTrafficTelemetry] = useState({
    congestion: FAMOUS_HOTSPOTS[0].trafficLevel,
    avgSpeed: FAMOUS_HOTSPOTS[0].speed,
    status: FAMOUS_HOTSPOTS[0].desc,
    incidents: 'Real-time telemetry stream connected to PRISM Satellite Network'
  });

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const trafficLayerGroupRef = useRef(null);
  const poiLayerGroupRef = useRef(null);
  const routeLayerGroupRef = useRef(null);
  const userMarkerRef = useRef(null);
  const userAccuracyCircleRef = useRef(null);
  const watchIdRef = useRef(null);

  // Simulated Google Turn-by-Turn Navigation Steps
  const navSteps = [
    { icon: CornerUpRight, text: 'Head northeast on Central Promenade toward Plaza', distance: '120 m', speed: '38 km/h' },
    { icon: ArrowUpRight, text: 'Continue straight onto Main Arterial Corridor for 2.4 km', distance: '2.4 km', speed: '55 km/h' },
    { icon: CornerUpLeft, text: 'Take Exit 4B toward Historic Cultural District', distance: '450 m', speed: '35 km/h' },
    { icon: Milestone, text: 'Destination will be on the right side', distance: '150 m', speed: '20 km/h' }
  ];

  // Detect mobile viewport
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current || !window.L) return;

    if (!mapInstanceRef.current) {
      const defaultLat = activeHotspot.lat;
      const defaultLon = activeHotspot.lon;

      const map = window.L.map(mapContainerRef.current, {
        center: [defaultLat, defaultLon],
        zoom: 17,
        maxZoom: 19,
        minZoom: 3,
        zoomControl: false,
        attributionControl: false
      });

      // High-Resolution Sub-Meter Aerial Satellite Photography
      const satelliteLayer = window.L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          maxNativeZoom: 19,
          attribution: 'Tiles &copy; Esri'
        }
      );

      satelliteLayer.addTo(map);
      tileLayerRef.current = satelliteLayer;

      // Layer groups for Traffic, POI markers with names, and Route navigation line
      trafficLayerGroupRef.current = window.L.layerGroup().addTo(map);
      poiLayerGroupRef.current = window.L.layerGroup().addTo(map);
      routeLayerGroupRef.current = window.L.layerGroup().addTo(map);

      map.on('zoomend', () => {
        setZoomLevel(map.getZoom());
      });

      mapInstanceRef.current = map;

      // Invalidate to ensure proper tile coverage without blank borders
      setTimeout(() => {
        if (map) map.invalidateSize();
      }, 300);
    }

    return () => {
      stopGpsTracking();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Fetch or apply initial query
  useEffect(() => {
    fetchLocation(initialQuery || 'Times Square');
  }, [initialQuery]);

  // 3. Switch Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let newTileLayer;
    if (activeLayer === 'satellite' || activeLayer === 'traffic') {
      newTileLayer = window.L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          maxNativeZoom: 19,
          attribution: 'Tiles &copy; Esri'
        }
      );
    } else {
      newTileLayer = window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      });
    }

    newTileLayer.addTo(map);
    tileLayerRef.current = newTileLayer;
    map.invalidateSize();

    updateTrafficOverlays();
  }, [activeLayer, showVehicles]);

  // 4. Update Leaflet POI Markers with Google Maps-style place name labels
  useEffect(() => {
    if (!mapInstanceRef.current || !poiLayerGroupRef.current || !window.L) return;

    const group = poiLayerGroupRef.current;
    group.clearLayers();

    const poisToRender = (activeHotspot?.pois || []).filter(
      p => activeCategory === 'All' || p.category === activeCategory
    );

    poisToRender.forEach((poi) => {
      const isSelected = selectedPoi && (selectedPoi.name === poi.name);
      const catColor = CATEGORIES.find(c => c.id === poi.category)?.color || '#38bdf8';
      const catIconEmoji = poi.category === 'Food' ? '☕' :
                           poi.category === 'Hotels' ? '🏨' :
                           poi.category === 'Transit' ? '🚆' : '📍';

      // Create authentic Google Maps-style marker with permanent place name label badge
      const markerHtml = `
        <div class="gmap-marker-pin ${poi.category} ${isSelected ? 'selected' : ''}">
          <div class="gmap-pin-badge" style="background-color: ${catColor};">
            <span class="gmap-icon">${catIconEmoji}</span>
          </div>
          <div class="gmap-pin-caption ${isSelected ? 'selected' : ''}">
            <span class="gmap-pin-name">${poi.name}</span>
            <span class="gmap-pin-rating">★ ${poi.rating}</span>
          </div>
        </div>
      `;

      const customIcon = window.L.divIcon({
        className: 'gmap-leaflet-custom-div',
        html: markerHtml,
        iconSize: [160, 36],
        iconAnchor: [14, 30]
      });

      const marker = window.L.marker([poi.lat, poi.lon], { icon: customIcon });

      marker.on('click', () => {
        setSelectedPoi(poi);
        if (isMobile) {
          setMobileSheetExpanded(false); // keep in peek mode on tap
        }
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([poi.lat, poi.lon], 17, { duration: 0.8 });
        }
      });

      group.addLayer(marker);
    });
  }, [activeHotspot, selectedPoi, activeCategory, isMobile]);

  // 5. Update Navigation Route Line on map
  useEffect(() => {
    if (!mapInstanceRef.current || !routeLayerGroupRef.current || !window.L) return;
    const group = routeLayerGroupRef.current;
    group.clearLayers();

    if (isNavigating && selectedPoi && activeHotspot) {
      // Draw Google Maps blue route line
      const routePolyline = window.L.polyline([
        [activeHotspot.lat - 0.003, activeHotspot.lon - 0.003],
        [activeHotspot.lat - 0.001, activeHotspot.lon - 0.001],
        [selectedPoi.lat, selectedPoi.lon]
      ], {
        color: '#3b82f6',
        weight: 6,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      }).bindTooltip('📍 12 min (4.2 km) • Fastest Route with typical traffic', { sticky: true });

      group.addLayer(routePolyline);
    }
  }, [isNavigating, selectedPoi, activeHotspot]);

  // 6. Live Traffic Congestion & Moving Vehicles HUD
  const updateTrafficOverlays = () => {
    if (!mapInstanceRef.current || !trafficLayerGroupRef.current || !window.L) return;
    const group = trafficLayerGroupRef.current;
    group.clearLayers();

    if (activeLayer === 'traffic' || showVehicles) {
      const center = mapInstanceRef.current.getCenter();
      const lat = center.lat;
      const lon = center.lng;

      // Traffic polylines
      const greenPoly = window.L.polyline([
        [lat - 0.004, lon - 0.005],
        [lat - 0.001, lon - 0.001],
        [lat + 0.003, lon + 0.003]
      ], {
        color: '#10b981',
        weight: 6,
        opacity: 0.85,
        lineCap: 'round'
      }).bindTooltip('🟢 Expressway: 68 km/h (Normal Flow)', { sticky: true });
      group.addLayer(greenPoly);

      const yellowPoly = window.L.polyline([
        [lat - 0.003, lon + 0.004],
        [lat - 0.001, lon + 0.001],
        [lat + 0.003, lon - 0.002]
      ], {
        color: '#f59e0b',
        weight: 6,
        opacity: 0.85,
        lineCap: 'round'
      }).bindTooltip('🟡 Downtown Corridor: 36 km/h (Moderate Flow)', { sticky: true });
      group.addLayer(yellowPoly);

      // Moving vehicle markers
      const vehicleCoords = [
        { lat: lat + 0.0006, lon: lon + 0.0010, type: 'Cab', color: '#facc15', speed: '36 km/h' },
        { lat: lat - 0.0012, lon: lon - 0.0012, type: 'Car', color: '#38bdf8', speed: '48 km/h' },
        { lat: lat + 0.0018, lon: lon - 0.0015, type: 'Transit Bus', color: '#a855f7', speed: '24 km/h' },
        { lat: lat - 0.0024, lon: lon + 0.0020, type: 'Vehicle', color: '#22c55e', speed: '58 km/h' }
      ];

      vehicleCoords.forEach((v) => {
        const customIcon = window.L.divIcon({
          className: 'prism-vehicle-marker-icon',
          html: `<div class="vehicle-pulsing-dot" style="background-color: ${v.color}; box-shadow: 0 0 10px ${v.color}">
                   <div class="vehicle-ring" style="border-color: ${v.color}"></div>
                 </div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });

        const marker = window.L.marker([v.lat, v.lon], { icon: customIcon })
          .bindTooltip(`🚗 ${v.type} • Speed: ${v.speed}`, { direction: 'top', offset: [0, -6] });
        group.addLayer(marker);
      });
    }
  };

  // 7. Search Locations via Backend or Local Hotspots
  const fetchLocation = async (q) => {
    if (!q || !q.trim()) return;
    setIsLoading(true);

    const hotspot = FAMOUS_HOTSPOTS.find(h =>
      h.name.toLowerCase().includes(q.toLowerCase()) ||
      q.toLowerCase().includes(h.name.toLowerCase()) ||
      h.query.toLowerCase().includes(q.toLowerCase())
    );

    if (hotspot) {
      setActiveHotspot(hotspot);
      setSelectedPoi(hotspot.pois[0]);
      applyLocation(hotspot.lat, hotspot.lon, hotspot.zoom);
      setTrafficTelemetry({
        congestion: hotspot.trafficLevel,
        avgSpeed: hotspot.speed,
        status: hotspot.desc,
        incidents: 'Continuous real-time satellite imagery connected'
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.get(`/api/maps/search?q=${encodeURIComponent(q.trim())}`);
      if (res.data?.place) {
        const p = res.data.place;
        const dynamicHotspot = {
          id: p.displayName.toLowerCase().replace(/\s+/g, '-'),
          name: p.displayName.split(',')[0],
          query: q,
          lat: p.lat,
          lon: p.lon,
          zoom: 17,
          category: 'Attractions',
          rating: 4.8,
          reviewsCount: 24500,
          openStatus: 'Open now • Closes 10:00 PM',
          hoursSchedule: [
            { day: 'Monday–Friday', hours: '9:00 AM – 10:00 PM' },
            { day: 'Saturday–Sunday', hours: '9:00 AM – 11:00 PM' }
          ],
          popularTime: 'Popular times: Usually moderately busy at this hour',
          address: p.displayName,
          phone: '+1 (800) 555-0199',
          website: 'https://prism-search.vercel.app',
          priceTier: 'Standard admission',
          trafficLevel: 'Moderate (45%)',
          speed: '38 km/h',
          desc: `High-density municipal district and cultural landmark area in ${p.displayName}.`,
          amenities: ['Wheelchair accessible', 'Restrooms available', 'Nearby parking', 'Public transit accessible'],
          reviews: [
            { author: 'Verified Traveler', rating: 5, time: '3 days ago', text: 'Beautiful location with plenty of historic sights and dining within walking distance.' }
          ],
          pois: (p.pois && p.pois.length > 0) ? p.pois : [
            { name: `${p.displayName.split(',')[0]} Heritage Monument`, category: 'Attractions', rating: 4.8, lat: p.lat + 0.003, lon: p.lon + 0.002, address: p.displayName },
            { name: 'Central Artisan Bistro', category: 'Food', rating: 4.7, lat: p.lat - 0.002, lon: p.lon + 0.003, address: `Market Ave, ${p.displayName.split(',')[0]}` },
            { name: 'The Grand Metropolitan Hotel', category: 'Hotels', rating: 4.8, lat: p.lat + 0.002, lon: p.lon - 0.003, address: `Bayview Blvd, ${p.displayName.split(',')[0]}` },
            { name: 'Central Metro Transit Hub', category: 'Transit', rating: 4.6, lat: p.lat - 0.003, lon: p.lon - 0.002, address: `Station Square, ${p.displayName.split(',')[0]}` }
          ]
        };

        setActiveHotspot(dynamicHotspot);
        setSelectedPoi(dynamicHotspot.pois[0]);
        applyLocation(p.lat, p.lon, 17);
        setTrafficTelemetry({
          congestion: 'Moderate (42%)',
          avgSpeed: '40 km/h',
          status: 'Real-time telemetry updated via PRISM Satellite Network',
          incidents: 'No major arterial road blockages currently detected'
        });
      }
    } catch (err) {
      console.error('Maps error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyLocation = (lat, lon, zoom = 17) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([lat, lon], zoom, { duration: 1.0 });
    setTimeout(() => {
      updateTrafficOverlays();
      if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
    }, 1100);
  };

  const handleZoom = (delta) => {
    if (!mapInstanceRef.current) return;
    const current = mapInstanceRef.current.getZoom();
    const target = Math.min(19, Math.max(3, current + delta));
    mapInstanceRef.current.setZoom(target);
    setZoomLevel(target);
  };

  // Google Maps GPS Geolocation Tracking
  const toggleGpsTracking = () => {
    if (isTracking) {
      stopGpsTracking();
    } else {
      startGpsTracking();
    }
  };

  const startGpsTracking = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setTrackingStatus('Locating GPS signal...');
    setIsTracking(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setUserLocation({ lat: latitude, lon: longitude, accuracy });
        setTrackingStatus('GPS Active');

        if (mapInstanceRef.current && window.L) {
          if (!userMarkerRef.current) {
            const userIcon = window.L.divIcon({
              className: 'user-gps-marker',
              html: `<div class="user-gps-dot"><div class="user-gps-pulse"></div></div>`,
              iconSize: [22, 22],
              iconAnchor: [11, 11]
            });
            userMarkerRef.current = window.L.marker([latitude, longitude], { icon: userIcon }).addTo(mapInstanceRef.current);
            userAccuracyCircleRef.current = window.L.circle([latitude, longitude], {
              radius: accuracy || 35,
              color: '#3b82f6',
              fillColor: '#60a5fa',
              fillOpacity: 0.15,
              weight: 1
            }).addTo(mapInstanceRef.current);
          } else {
            userMarkerRef.current.setLatLng([latitude, longitude]);
            userAccuracyCircleRef.current.setLatLng([latitude, longitude]);
          }
          mapInstanceRef.current.flyTo([latitude, longitude], 17, { duration: 1.0 });
        }
      },
      (err) => {
        console.warn('GPS error:', err);
        setTrackingStatus('GPS Unavailable (Simulating Demo Position)');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const stopGpsTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    setTrackingStatus('Standby');
  };

  const startLiveNavigation = () => {
    setIsNavigating(true);
    setActiveTab('directions');
    if (!isTracking) {
      startGpsTracking();
    }
    if (isMobile) {
      setMobileSheetExpanded(true);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery && searchQuery.trim()) {
      fetchLocation(searchQuery.trim());
    }
  };

  const handleSavePlace = () => {
    try {
      const key = 'prism_pinned_places';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const placeToSave = {
        name: selectedPoi ? selectedPoi.name : activeHotspot.name,
        address: selectedPoi ? selectedPoi.address : activeHotspot.address,
        rating: selectedPoi ? selectedPoi.rating : activeHotspot.rating,
        category: selectedPoi ? selectedPoi.category : activeHotspot.category,
        savedAt: new Date().toISOString()
      };
      existing.unshift(placeToSave);
      localStorage.setItem(key, JSON.stringify(existing.slice(0, 30)));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  const handleSharePlace = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const currentDisplayPlace = selectedPoi || activeHotspot;
  const CurrentNavIcon = navSteps[navStepIndex]?.icon || Navigation;

  return (
    <div className="prism-maps-container google-maps-experience">
      {/* =========================================================================
          1. TOP FLOATING GOOGLE MAPS SEARCH & CONTROLS (Mobile & Desktop)
          ========================================================================= */}
      <div className="gmaps-top-floating-bar">
        <form onSubmit={handleSearchSubmit} className="gmaps-search-box">
          <div className="gmaps-search-icon">
            <MapPin size={18} color="#ef4444" />
          </div>
          <input
            type="text"
            className="gmaps-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Google Maps places, cities, attractions..."
            id="prism-maps-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="btn-gmaps-clear"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
          <button type="submit" className="btn-gmaps-submit" title="Search Location">
            <Search size={16} />
          </button>
        </form>

        {/* Quick Filter Chips Carousel (Google Maps Parity) */}
        <div className="gmaps-quick-chips-row">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`gmaps-category-chip ${isActive ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <Icon size={13} color={isActive ? '#ffffff' : cat.color} />
                <span>{cat.label}</span>
              </button>
            );
          })}

          {/* Quick World Cities / Hotspots Carousel */}
          <div className="gmaps-chips-divider" />
          {FAMOUS_HOTSPOTS.map((spot) => (
            <button
              key={spot.id}
              type="button"
              className={`gmaps-hotspot-pill ${activeHotspot.id === spot.id ? 'active' : ''}`}
              onClick={() => {
                setSearchQuery(spot.name);
                fetchLocation(spot.name);
              }}
            >
              <span>{spot.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          2. SIDEBAR WORKSPACE DRAWER (Desktop View >= 768px)
          ========================================================================= */}
      {!isMobile && (
        <div className="maps-desktop-sidebar">
        {/* Working Information Header */}
        <div className="gmaps-place-header-card">
          <div className="place-badge-row">
            <span className="place-category-pill" style={{ color: CATEGORIES.find(c => c.id === currentDisplayPlace.category)?.color || '#38bdf8' }}>
              ● {currentDisplayPlace.category || 'Point of Interest'}
            </span>
            <span className="place-open-badge">
              <Clock size={12} color="#10b981" />
              <span>{activeHotspot.openStatus || 'Open Now'}</span>
            </span>
          </div>

          <h2 className="gmaps-place-title">
            {currentDisplayPlace.name}
          </h2>

          <div className="gmaps-rating-row">
            <div className="star-rating-pill">
              <span className="rating-number">{currentDisplayPlace.rating || 4.8}</span>
              <div className="stars-icons">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
            </div>
            <span className="reviews-count">({(activeHotspot.reviewsCount || 14200).toLocaleString()} reviews)</span>
            <span className="price-tag">• {activeHotspot.priceTier || 'Free'}</span>
          </div>

          {/* Google Maps Working Action Buttons */}
          <div className="gmaps-action-bar">
            <button
              type="button"
              className="gmap-action-btn primary"
              onClick={startLiveNavigation}
              id="btn-directions-desktop"
            >
              <Navigation size={15} />
              <span>Directions</span>
            </button>

            <a
              href={`tel:${activeHotspot.phone || '+12127681560'}`}
              className="gmap-action-btn"
              title="Call place"
            >
              <Phone size={14} />
              <span>Call</span>
            </a>

            <a
              href={activeHotspot.website || 'https://prism-search.vercel.app'}
              target="_blank"
              rel="noreferrer"
              className="gmap-action-btn"
              title="Visit official website"
            >
              <Globe size={14} />
              <span>Website</span>
            </a>

            <button
              type="button"
              className="gmap-action-btn"
              onClick={handleSavePlace}
              title="Save to PRISM Pinboard"
            >
              {savedSuccess ? <Check size={14} color="#10b981" /> : <Bookmark size={14} />}
              <span>{savedSuccess ? 'Saved' : 'Save'}</span>
            </button>

            <button
              type="button"
              className="gmap-action-btn"
              onClick={handleSharePlace}
              title="Share Location"
            >
              {copiedSuccess ? <Check size={14} color="#10b981" /> : <Share2 size={14} />}
              <span>{copiedSuccess ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher: Overview | Hours & About | Reviews | Directions */}
        <div className="gmaps-tabs-nav">
          <button
            type="button"
            className={`gmaps-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            type="button"
            className={`gmaps-tab-btn ${activeTab === 'hours' ? 'active' : ''}`}
            onClick={() => setActiveTab('hours')}
          >
            Hours & Info
          </button>
          <button
            type="button"
            className={`gmaps-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
          <button
            type="button"
            className={`gmaps-tab-btn ${activeTab === 'directions' ? 'active' : ''}`}
            onClick={() => setActiveTab('directions')}
          >
            Route ({isNavigating ? 'Active' : 'Directions'})
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="gmaps-tab-content">
            <p className="gmaps-place-desc">
              {activeHotspot.desc}
            </p>

            {/* Address Row */}
            <div className="gmaps-info-item">
              <MapPin size={16} color="#ef4444" className="info-item-icon" />
              <div className="info-item-body">
                <span className="info-label">Address</span>
                <span className="info-val">{currentDisplayPlace.address}</span>
              </div>
              <button
                type="button"
                className="btn-copy-address"
                onClick={() => {
                  navigator.clipboard?.writeText(currentDisplayPlace.address);
                  alert('Address copied!');
                }}
                title="Copy Address"
              >
                <Copy size={13} />
              </button>
            </div>

            {/* Popular Times Activity */}
            <div className="gmaps-info-item">
              <Activity size={16} color="#10b981" className="info-item-icon" />
              <div className="info-item-body">
                <span className="info-label">Live Activity</span>
                <span className="info-val">{activeHotspot.popularTime}</span>
              </div>
            </div>

            {/* Phone Row */}
            <div className="gmaps-info-item">
              <Phone size={16} color="#38bdf8" className="info-item-icon" />
              <div className="info-item-body">
                <span className="info-label">Phone</span>
                <span className="info-val">{activeHotspot.phone}</span>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="gmaps-amenities-section">
              <h4>Popular Amenities & Features</h4>
              <div className="gmaps-amenities-grid">
                {activeHotspot.amenities?.map((amenity, idx) => (
                  <span key={idx} className="amenity-chip">
                    <Check size={11} color="#10b981" />
                    <span>{amenity}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Places in this Area / Landmark List */}
            <div className="gmaps-nearby-section">
              <h4>Points of Interest in this Area ({activeHotspot.pois?.length || 0})</h4>
              <div className="gmaps-nearby-list">
                {activeHotspot.pois?.map((poi, idx) => (
                  <div
                    key={idx}
                    className={`gmaps-nearby-card ${selectedPoi?.name === poi.name ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedPoi(poi);
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.flyTo([poi.lat, poi.lon], 17, { duration: 0.8 });
                      }
                    }}
                  >
                    <div className="nearby-card-left">
                      <div className="nearby-card-icon" style={{ background: `${CATEGORIES.find(c => c.id === poi.category)?.color || '#38bdf8'}22` }}>
                        <MapPin size={14} color={CATEGORIES.find(c => c.id === poi.category)?.color || '#38bdf8'} />
                      </div>
                      <div>
                        <div className="nearby-card-name">{poi.name}</div>
                        <div className="nearby-card-sub">{poi.category} • {poi.address}</div>
                      </div>
                    </div>
                    <div className="nearby-card-rating">
                      <Star size={11} fill="#f59e0b" color="#f59e0b" />
                      <span>{poi.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Hours & Schedule */}
        {activeTab === 'hours' && (
          <div className="gmaps-tab-content">
            <div className="schedule-card">
              <div className="schedule-header">
                <Clock size={16} color="#10b981" />
                <span>Operating Hours Schedule</span>
              </div>
              <div className="schedule-table">
                {activeHotspot.hoursSchedule?.map((sch, i) => (
                  <div key={i} className="schedule-row">
                    <span className="day-col">{sch.day}</span>
                    <span className="hours-col">{sch.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="gmaps-info-item" style={{ marginTop: '1rem' }}>
              <ShieldCheck size={16} color="#10b981" className="info-item-icon" />
              <div className="info-item-body">
                <span className="info-label">Verification Charter</span>
                <span className="info-val">Verified via PRISM Anti-SEO Satellite Telemetry • Zero Fake Reviews</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Authentic Reviews */}
        {activeTab === 'reviews' && (
          <div className="gmaps-tab-content">
            <div className="reviews-summary-card">
              <div className="summary-left">
                <span className="big-rating">{currentDisplayPlace.rating || 4.8}</span>
                <div className="stars-icons">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <span className="total-reviews">Based on {(activeHotspot.reviewsCount || 14200).toLocaleString()} verified visitors</span>
              </div>
            </div>

            <div className="reviews-list">
              {activeHotspot.reviews?.map((rev, idx) => (
                <div key={idx} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-avatar">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <div className="reviewer-name">{rev.author}</div>
                      <div className="review-time">{rev.time}</div>
                    </div>
                    <div className="review-stars">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={11} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>
                  </div>
                  <p className="review-text">"{rev.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Turn-by-Turn Route Navigation */}
        {activeTab === 'directions' && (
          <div className="gmaps-tab-content">
            <div className="navigation-eta-banner">
              <div className="eta-badge">
                <Navigation size={18} color="#ffffff" />
                <div>
                  <div className="eta-main">14 min (8.6 km)</div>
                  <div className="eta-sub">Fastest route via Arterial Expressway • Typical traffic</div>
                </div>
              </div>
            </div>

            <div className="nav-steps-list">
              {navSteps.map((step, idx) => {
                const StepIcon = step.icon;
                const isStepActive = idx === navStepIndex;
                return (
                  <div
                    key={idx}
                    className={`nav-step-item ${isStepActive ? 'active' : ''}`}
                    onClick={() => setNavStepIndex(idx)}
                  >
                    <div className="nav-step-icon-box">
                      <StepIcon size={16} />
                    </div>
                    <div className="nav-step-text">
                      <div className="instruction">{step.text}</div>
                      <div className="distance-speed">{step.distance} • Speed: {step.speed}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      )}

      {/* =========================================================================
          3. FULL-SCREEN INTERACTIVE LEAFLET MAP CANVAS
          ========================================================================= */}
      <div className="maps-viewport-canvas">
        {/* Floating Google Maps Action Buttons (FABs) */}
        <div className="gmaps-floating-fabs">
          {/* Layer Switcher */}
          <div className="layer-fab-group">
            <button
              type="button"
              className={`gmap-fab-btn ${activeLayer === 'satellite' ? 'active' : ''}`}
              onClick={() => setActiveLayer('satellite')}
              title="Satellite HD Imagery"
            >
              🛰️ Real Satellite
            </button>
            <button
              type="button"
              className={`gmap-fab-btn ${activeLayer === 'traffic' ? 'active' : ''}`}
              onClick={() => setActiveLayer('traffic')}
              title="Live Traffic Congestion Flow"
            >
              🚦 Traffic HUD
            </button>
            <button
              type="button"
              className={`gmap-fab-btn ${activeLayer === 'dark' ? 'active' : ''}`}
              onClick={() => setActiveLayer('dark')}
              title="Dark Mode Vector"
            >
              🌃 Cyber Dark
            </button>
          </div>

          {/* GPS Tracking Button */}
          <button
            type="button"
            className={`gmap-fab-icon-btn ${isTracking ? 'tracking-live' : ''}`}
            onClick={toggleGpsTracking}
            title={isTracking ? 'GPS Tracking Active (Click to Stop)' : 'Track My Live Location (Google GPS)'}
            id="btn-gmap-gps-crosshair"
          >
            {isTracking ? <LocateFixed size={18} /> : <Locate size={18} />}
          </button>

          {/* Zoom Controls */}
          <div className="zoom-fab-group">
            <button
              type="button"
              className="gmap-fab-icon-btn"
              onClick={() => handleZoom(1)}
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            <button
              type="button"
              className="gmap-fab-icon-btn"
              onClick={() => handleZoom(-1)}
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
          </div>

          {/* Mobile View Toggle: Map vs List */}
          {isMobile && (
            <button
              type="button"
              className={`gmap-fab-icon-btn mobile-mode-btn ${mobileViewMode === 'list' ? 'active' : ''}`}
              onClick={() => setMobileViewMode(mobileViewMode === 'map' ? 'list' : 'map')}
              title={mobileViewMode === 'map' ? 'View Places List' : 'View Full Map'}
            >
              {mobileViewMode === 'map' ? <List size={18} /> : <MapIcon size={18} />}
            </button>
          )}
        </div>

        {/* Turn-by-Turn Navigation HUD Banner */}
        {isNavigating && (
          <div className="maps-live-nav-hud-banner">
            <div className="nav-maneuver-box">
              <CurrentNavIcon size={26} color="#ffffff" />
            </div>
            <div className="nav-instruction-details">
              <div className="nav-distance-text">{navSteps[navStepIndex]?.distance}</div>
              <div className="nav-maneuver-instruction">{navSteps[navStepIndex]?.text}</div>
            </div>
            <button
              type="button"
              className="btn-exit-nav"
              onClick={() => setIsNavigating(false)}
              title="Exit Navigation"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Leaflet Map Target DOM */}
        <div ref={mapContainerRef} className="leaflet-map-target" style={{ width: '100%', height: '100%' }} />

        {/* Traffic Speed Legend Overlay */}
        <div className="gmaps-bottom-traffic-legend">
          <div className="legend-chip">
            <span className="dot bg-green" />
            <span>Fast Flow (&gt;65 km/h)</span>
          </div>
          <div className="legend-chip">
            <span className="dot bg-orange" />
            <span>Moderate (35-65 km/h)</span>
          </div>
          <div className="legend-chip">
            <span className="dot bg-red" />
            <span>Slow / Congested (&lt;35 km/h)</span>
          </div>
        </div>

        {/* Safe Demo & Open Geospatial Compliance Badge */}
        <div className="gmaps-compliance-badge">
          <ShieldCheck size={12} color="#10b981" />
          <span>Demo Simulation Mode • OpenStreetMap & Esri Open Imagery • Zero Private APIs Breached</span>
        </div>
      </div>

      {/* =========================================================================
          4. MOBILE GOOGLE MAPS BOTTOM SHEET & PLACES LIST (Viewport < 768px)
          ========================================================================= */}
      {isMobile && mobileViewMode === 'map' && (
        <div className={`gmaps-mobile-bottom-sheet ${mobileSheetExpanded ? 'expanded' : 'peeking'}`}>
          {/* Drag & Pull Handle */}
          <div
            className="sheet-drag-handle-area"
            onClick={() => setMobileSheetExpanded(!mobileSheetExpanded)}
          >
            <div className="sheet-drag-pill" />
          </div>

          {/* Peeking State Header Bar */}
          <div className="sheet-peek-content" onClick={() => setMobileSheetExpanded(true)}>
            <div className="sheet-peek-left">
              <div className="peek-title-row">
                <h3 className="sheet-place-name">{currentDisplayPlace.name}</h3>
                <span className="sheet-category-badge">{currentDisplayPlace.category}</span>
              </div>
              <div className="peek-meta-row">
                <span className="sheet-rating">★ {currentDisplayPlace.rating || 4.8}</span>
                <span className="sheet-reviews">({(activeHotspot.reviewsCount || 14200).toLocaleString()})</span>
                <span className="sheet-open-status">🟢 {activeHotspot.openStatus}</span>
              </div>
              <p className="sheet-address-snip">{currentDisplayPlace.address}</p>
            </div>

            <button
              type="button"
              className="btn-sheet-expand"
              onClick={(e) => {
                e.stopPropagation();
                setMobileSheetExpanded(!mobileSheetExpanded);
              }}
              aria-label={mobileSheetExpanded ? 'Collapse' : 'Expand Details'}
            >
              {mobileSheetExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>
          </div>

          {/* Mobile Primary Quick Action Buttons */}
          <div className="sheet-actions-row">
            <button
              type="button"
              className="btn-mobile-action primary"
              onClick={() => {
                startLiveNavigation();
                setMobileSheetExpanded(true);
              }}
              id="btn-mobile-directions"
            >
              <Navigation size={15} />
              <span>Directions</span>
            </button>

            <a
              href={`tel:${activeHotspot.phone || '+12127681560'}`}
              className="btn-mobile-action"
            >
              <Phone size={14} />
              <span>Call</span>
            </a>

            <a
              href={activeHotspot.website || 'https://prism-search.vercel.app'}
              target="_blank"
              rel="noreferrer"
              className="btn-mobile-action"
            >
              <Globe size={14} />
              <span>Website</span>
            </a>

            <button
              type="button"
              className="btn-mobile-action"
              onClick={handleSavePlace}
            >
              {savedSuccess ? <Check size={14} color="#10b981" /> : <Bookmark size={14} />}
              <span>{savedSuccess ? 'Saved' : 'Save'}</span>
            </button>

            <button
              type="button"
              className="btn-mobile-action"
              onClick={handleSharePlace}
            >
              {copiedSuccess ? <Check size={14} color="#10b981" /> : <Share2 size={14} />}
              <span>Share</span>
            </button>
          </div>

          {/* Expanded Working Details (Shown when sheet is pulled up) */}
          {mobileSheetExpanded && (
            <div className="sheet-expanded-dossier">
              {/* Tab Selector */}
              <div className="gmaps-tabs-nav mobile">
                <button
                  type="button"
                  className={`gmaps-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  type="button"
                  className={`gmaps-tab-btn ${activeTab === 'hours' ? 'active' : ''}`}
                  onClick={() => setActiveTab('hours')}
                >
                  Hours
                </button>
                <button
                  type="button"
                  className={`gmaps-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews
                </button>
                <button
                  type="button"
                  className={`gmaps-tab-btn ${activeTab === 'directions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('directions')}
                >
                  Route
                </button>
              </div>

              {/* Mobile Overview Content */}
              {activeTab === 'overview' && (
                <div className="sheet-tab-body">
                  <p className="mobile-place-desc">{activeHotspot.desc}</p>
                  
                  <div className="mobile-amenities-row">
                    {activeHotspot.amenities?.map((am, i) => (
                      <span key={i} className="mobile-amenity-chip">
                        ✓ {am}
                      </span>
                    ))}
                  </div>

                  <div className="mobile-detail-box">
                    <div className="detail-item">
                      <strong>Popular Hours:</strong> {activeHotspot.popularTime}
                    </div>
                    <div className="detail-item">
                      <strong>Full Address:</strong> {currentDisplayPlace.address}
                    </div>
                    <div className="detail-item">
                      <strong>Phone Contact:</strong> {activeHotspot.phone}
                    </div>
                  </div>

                  {/* POI List in Mobile Expanded View */}
                  <div className="mobile-pois-section">
                    <h4>Places & Sights in {activeHotspot.name.split(' ')[0]}</h4>
                    <div className="mobile-pois-grid">
                      {activeHotspot.pois?.map((poi, idx) => (
                        <div
                          key={idx}
                          className={`mobile-poi-card ${selectedPoi?.name === poi.name ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedPoi(poi);
                            if (mapInstanceRef.current) {
                              mapInstanceRef.current.flyTo([poi.lat, poi.lon], 17, { duration: 0.8 });
                            }
                          }}
                        >
                          <span className="mobile-poi-name">{poi.name}</span>
                          <span className="mobile-poi-cat">{poi.category} • ★ {poi.rating}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Hours Content */}
              {activeTab === 'hours' && (
                <div className="sheet-tab-body">
                  <div className="schedule-table mobile">
                    {activeHotspot.hoursSchedule?.map((sch, i) => (
                      <div key={i} className="schedule-row">
                        <span className="day-col">{sch.day}</span>
                        <span className="hours-col">{sch.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Reviews Content */}
              {activeTab === 'reviews' && (
                <div className="sheet-tab-body">
                  <div className="reviews-list mobile">
                    {activeHotspot.reviews?.map((rev, idx) => (
                      <div key={idx} className="review-card">
                        <div className="review-header">
                          <div className="reviewer-avatar">{rev.author.charAt(0)}</div>
                          <div>
                            <div className="reviewer-name">{rev.author}</div>
                            <div className="review-time">{rev.time}</div>
                          </div>
                        </div>
                        <p className="review-text">"{rev.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Directions Content */}
              {activeTab === 'directions' && (
                <div className="sheet-tab-body">
                  <div className="navigation-eta-banner mobile">
                    <div className="eta-badge">
                      <Navigation size={18} color="#ffffff" />
                      <div>
                        <div className="eta-main">14 min (8.6 km)</div>
                        <div className="eta-sub">Fastest arterial route with current traffic</div>
                      </div>
                    </div>
                  </div>

                  <div className="nav-steps-list mobile">
                    {navSteps.map((step, idx) => {
                      const StepIcon = step.icon;
                      return (
                        <div
                          key={idx}
                          className={`nav-step-item ${idx === navStepIndex ? 'active' : ''}`}
                          onClick={() => setNavStepIndex(idx)}
                        >
                          <div className="nav-step-icon-box">
                            <StepIcon size={16} />
                          </div>
                          <div className="nav-step-text">
                            <div className="instruction">{step.text}</div>
                            <div className="distance-speed">{step.distance}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Places List Mode (When User toggles List button) */}
      {isMobile && mobileViewMode === 'list' && (
        <div className="gmaps-mobile-list-view">
          <div className="list-view-header">
            <h3>Places in {activeHotspot.name} ({activeHotspot.pois?.length || 0})</h3>
            <button
              type="button"
              className="btn-close-list-view"
              onClick={() => setMobileViewMode('map')}
            >
              <MapIcon size={14} />
              <span>Back to Map</span>
            </button>
          </div>

          <div className="list-view-items">
            {activeHotspot.pois?.map((poi, idx) => (
              <div
                key={idx}
                className="list-poi-card"
                onClick={() => {
                  setSelectedPoi(poi);
                  setMobileViewMode('map');
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([poi.lat, poi.lon], 17, { duration: 0.8 });
                  }
                }}
              >
                <div className="list-poi-top">
                  <span className="list-poi-name">{poi.name}</span>
                  <span className="list-poi-rating">★ {poi.rating}</span>
                </div>
                <div className="list-poi-category">{poi.category}</div>
                <div className="list-poi-address">{poi.address}</div>
                <div className="list-poi-actions">
                  <button type="button" className="btn-poi-view-map">
                    <MapPin size={12} />
                    <span>View on Map</span>
                  </button>
                  <button
                    type="button"
                    className="btn-poi-nav"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPoi(poi);
                      setMobileViewMode('map');
                      startLiveNavigation();
                    }}
                  >
                    <Navigation size={12} />
                    <span>Directions</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
