import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { Vehicle, Review, User, Order, Inquiry, TestDrive, ChatMessage, ContactInfo } from './src/types';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const DB_FILE = path.join(process.cwd(), 'db.json');

// Initialize local seed data
const initialVehicles: Vehicle[] = [
  {
    id: 'car-1',
    make: 'Toyota',
    model: 'Hilux Double Cabin',
    year: 2023,
    price: 42000,
    mileage: 18000,
    fuelType: 'Diesel',
    transmission: 'Manual',
    condition: 'Used',
    availability: 'Available',
    imageUrls: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1622146914594-eaf59b09be0d?auto=format&fit=crop&q=80&w=800'
    ],
    specs: {
      engine: '2.8L GD-6 Turbo Diesel',
      horsepower: 201,
      fuelEconomy: '12.5 km/L',
      exteriorColor: 'Attitude Black Metallic',
      interiorColor: 'Black Premium Fabric',
      drivetrain: '4WD with Rear Differential Lock',
      acceleration: '10.1s (0-100 km/h)'
    },
    description: 'The absolute king of Tanzanian roads. Delivering unmatched cargo versatility, high torque outputs, and military-grade suspension systems built to handle rough terrain on standard safaris and urban commutes alike.',
    features: [
      'Rugged 4WD Selector',
      'Heavy Duty Cargo Liner',
      'Dual Zone Climate Control',
      'Reinforced Dual-Wishbone Suspension',
      '9-inch Touchscreen Infotainment',
      'Reverse Assist Camera Setup'
    ],
    ratingsSum: 24,
    ratingsCount: 5
  },
  {
    id: 'car-2',
    make: 'Toyota',
    model: 'Land Cruiser 300 ZX',
    year: 2024,
    price: 115005,
    mileage: 1200,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    condition: 'New',
    availability: 'Available',
    imageUrls: [
      'https://images.unsplash.com/photo-1594979185157-c1d7945c43d4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800'
    ],
    specs: {
      engine: '3.3L Twin-Turbo V6 Diesel',
      horsepower: 304,
      fuelEconomy: '11.2 km/L',
      exteriorColor: 'Precious White Pearl',
      interiorColor: 'Beige Premium Nappa Leather',
      drivetrain: 'Full-Time 4WD with Multi-Terrain Select',
      acceleration: '6.9s (0-100 km/h)'
    },
    description: 'The peak of off-road performance and prestige in East Africa. Combining a robust Twin-Turbo powertrain with standard luxury leather styling and active height damping control.',
    features: [
      'Multi-Terrain Monitor with Cameras',
      'Active Height Control Damping',
      'JBL 14-Speaker Premium Audio',
      'Fingerprint Starter Safeties',
      'Spacious Dual Row Ottoman Lounge',
      'Bi-LED Adaptive Beam headlights'
    ],
    ratingsSum: 19,
    ratingsCount: 4
  },
  {
    id: 'car-3',
    make: 'Nissan',
    model: 'Patrol Y62 Royale',
    year: 2023,
    price: 85002,
    mileage: 4500,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    condition: 'New',
    availability: 'Available',
    imageUrls: [
      'https://images.unsplash.com/photo-1622146914594-eaf59b09be0d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=800'
    ],
    specs: {
      engine: '5.6L V8 Petrol Mode',
      horsepower: 400,
      fuelEconomy: '8.5 km/L',
      exteriorColor: 'Metallic Star Silver',
      interiorColor: 'Tan Premium Full Grain Leather',
      drivetrain: 'All-Mode 4WD System',
      acceleration: '6.6s (0-100 km/h)'
    },
    description: 'An absolute luxury cruiser, offering high ground clearance, an intelligent state hydraulic body suspension system, and VIP seating for outstanding highway confidence.',
    features: [
      'Hydraulic Body Motion Control (HBMC)',
      'Premium Wooden Trim Paneling',
      'Rear Passenger Seat Displays',
      'Coolbox Center Console Compartment',
      'Intelligent Cruise Control',
      'Astounding Panoramic Skylight'
    ],
    ratingsSum: 10,
    ratingsCount: 2
  },
  {
    id: 'car-4',
    make: 'Suzuki',
    model: 'Jimny 5-Door GLX',
    year: 2024,
    price: 26000,
    mileage: 50,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    condition: 'New',
    availability: 'Available',
    imageUrls: [
      'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800'
    ],
    specs: {
      engine: '1.5L VVT K15B Engine',
      horsepower: 102,
      fuelEconomy: '14.8 km/L',
      exteriorColor: 'Kinetic Yellow & Black Roof',
      interiorColor: 'Charcoal Black Sport Fabric',
      drivetrain: 'ALLGRIP PRO 4WD (Low-range Gear)',
      acceleration: '12.5s (0-100 km/h)'
    },
    description: 'Combining retro heritage with 5-door passenger usability. Light footprint, robust off-road capability, and high fuel economy, perfect for urban maneuvers and rough trail treks alike.',
    features: [
      'AllGrip Pro mechanical 4x4 Selector',
      'Rigid Axle 3-link suspension setup',
      'Rugged Scratch Resistant Wheelarches',
      '9-inch Touch Link Navigation',
      'Compact spare wheel on tailgate',
      'High Ground-Clearance bumpers'
    ],
    ratingsSum: 15,
    ratingsCount: 3
  },
  {
    id: 'car-5',
    make: 'Mazda',
    model: 'CX-5 SkyActiv-D',
    year: 2022,
    price: 20500,
    mileage: 38000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    condition: 'Used',
    availability: 'Available',
    imageUrls: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'
    ],
    specs: {
      engine: '2.2L Twin-Turbo Diesel',
      horsepower: 187,
      fuelEconomy: '15.4 km/L',
      exteriorColor: 'Soul Red Crystal Metallic',
      interiorColor: 'Black Premium Perforated Leather',
      drivetrain: 'i-ACTIV Intel AWD',
      acceleration: '8.2s (0-100 km/h)'
    },
    description: 'Highly popular across Tanzania. Delivering premium cabin ergonomics, smart city brake assists, and incredible turbo-diesel efficiency in an athletic posture.',
    features: [
      'G-Vectoring Control System Plus',
      'Bose 10-speaker Audio Staging',
      'Heated Leather Steering Wheel',
      'Power liftgate with smart sensors',
      'Active Driving HUD projection',
      'Smart City Brake Support Option'
    ],
    ratingsSum: 5,
    ratingsCount: 1
  },
  {
    id: 'car-6',
    make: 'Honda',
    model: 'Fit Hybrid',
    year: 2021,
    price: 9800,
    mileage: 45000,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    condition: 'Used',
    availability: 'Available',
    imageUrls: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800'
    ],
    specs: {
      engine: '1.5L i-VTEC Hybrid e:HEV System',
      horsepower: 109,
      fuelEconomy: '28.6 km/L',
      exteriorColor: 'Platinum White Pearl',
      interiorColor: 'Charcoal Soft Knit Magic Fabric',
      drivetrain: 'Front-Wheel Drive',
      acceleration: '9.4s (0-100 km/h)'
    },
    description: 'The ultimate solution for daily city mobility in East Africa. Astonishing fuel efficiency combined with Honda\'s flexible magic seat cargo configurations.',
    features: [
      'Honda Magic Seat flexibility controls',
      'Smart Dual-Climate Eco Controls',
      'Adaptive Cruise Control Safety',
      'Dynamic Eco Mode Selector Panel',
      'Push Start ignition system',
      'Multi-Angle broad Assist Cam'
    ],
    ratingsSum: 20,
    ratingsCount: 4
  },
  // TVS Motor Company Motorcycles
  {
    id: 'bike-tvs-hlx-125',
    category: 'Motorcycle',
    make: 'TVS Motor Company',
    model: 'TVS HLX 125',
    year: 2024,
    price: 2800000,
    mileage: 0,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    condition: 'New',
    availability: 'Available',
    imageUrls: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800'],
    specs: {
      engine: '124.8cc Single Cylinder, 4-Stroke',
      horsepower: 11,
      fuelEconomy: '55 km/L',
      exteriorColor: 'Royal Blue',
      interiorColor: 'N/A',
      drivetrain: 'Chain Drive',
      acceleration: '6.5s (0-60 km/h)'
    },
    description: 'The supreme passenger and commercial workhorse of East Africa. Extremely durable chassis with heavy-duty dual rear suspensions and an integrated USB charger.',
    features: ['USB Phone Charging Port', 'Heavy Duty Rear Luggage Carrier', 'Dual Spring-in-Spring Suspensions', 'Engine Guard Plate', 'Wide Commuter Seat'],
    ratingsSum: 0,
    ratingsCount: 0
  },
  {
    id: 'bike-tvs-apache-160',
    category: 'Motorcycle',
    make: 'TVS Motor Company',
    model: 'TVS Apache RTR 160',
    year: 2024,
    price: 4500000,
    mileage: 50,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    condition: 'New',
    availability: 'Available',
    imageUrls: ['https://images.unsplash.com/photo-1615172282427-19e8738a8b8c?auto=format&fit=crop&q=80&w=800'],
    specs: {
      engine: '159.7cc RTR Over-Square Engine',
      horsepower: 16,
      fuelEconomy: '45 km/L',
      exteriorColor: 'Racing Red',
      interiorColor: 'N/A',
      drivetrain: 'Chain Drive',
      acceleration: '4.8s (0-60 km/h)'
    },
    description: 'Track-born performance commuter with fuel injection, Wave Bite keys, and best-in-class power-to-weight ratio.',
    features: ['Single-Channel Super-Spec ABS', 'Glide Through Technology', 'Fully Digital Speedometer Console', 'LED Headlamps and Tail-lights'],
    ratingsSum: 0,
    ratingsCount: 0
  },
  {
    id: 'bike-tvs-apache-200',
    category: 'Motorcycle',
    make: 'TVS Motor Company',
    model: 'TVS Apache RTR 200',
    year: 2024,
    price: 5800000,
    mileage: 10,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    condition: 'New',
    availability: 'Available',
    imageUrls: ['https://images.unsplash.com/photo-1615172282427-19e8738a8b8c?auto=format&fit=crop&q=80&w=800'],
    specs: {
      engine: '197.75cc SI, 4-Stroke, 4-Valve, Oil-Cooled',
      horsepower: 20.8,
      fuelEconomy: '38 km/L',
      exteriorColor: 'Matte Blue',
      interiorColor: 'N/A',
      drivetrain: 'Chain Drive',
      acceleration: '3.9s (0-60 km/h)'
    },
    description: 'High performance sports naked commuter featuring Showa adjustable suspensions, race-tuned slipper clutch, and SmartXonnect Bluetooth telematics system.',
    features: ['Showa High-End Adjustable Suspensions', 'RT Slipper Clutch', 'SmartXonnect Bluetooth Console', '3 Ride Modes (Rain, Urban, Sport)'],
    ratingsSum: 0,
    ratingsCount: 0
  },
  {
    id: 'bike-tvs-sport-100',
    category: 'Motorcycle',
    make: 'TVS Motor Company',
    model: 'TVS Sport 100',
    year: 2023,
    price: 2400000,
    mileage: 120,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    condition: 'Used',
    availability: 'Available',
    imageUrls: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800'],
    specs: {
      engine: '99.7cc Single cylinder Duralife engine',
      horsepower: 7.4,
      fuelEconomy: '65 km/L',
      exteriorColor: 'Active Black with Red Decals',
      interiorColor: 'N/A',
      drivetrain: 'Chain Drive',
      acceleration: '7.8s (0-60 km/h)'
    },
    description: 'Renowned for record-shattering fuel efficiency, the TVS Sport is an exceptional option for smart urban runabouts and reliable daily commuting.',
    features: ['Sporty graphics styling', 'All-Gear Electric Starter', 'Optimized Hydraulic Dampers', 'High Strength Alloy Wheels'],
    ratingsSum: 0,
    ratingsCount: 0
  },
  // Bajaj Auto Motorcycles
  {
    id: 'bike-bajaj-boxer-100',
    category: 'Motorcycle',
    make: 'Bajaj Auto',
    model: 'Bajaj Boxer 100 HD',
    year: 2024,
    price: 2750000,
    mileage: 0,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    condition: 'New',
    availability: 'Available',
    imageUrls: ['https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=800'],
    specs: {
      engine: '102cc air-cooled, single cylinder',
      horsepower: 8.2,
      fuelEconomy: '62 km/L',
      exteriorColor: 'Jet Black',
      interiorColor: 'N/A',
      drivetrain: 'Chain Drive',
      acceleration: '7.5s (0-60 km/h)'
    },
    description: 'The definitive king of heavy duty commercial hauling in local towns. Built like a submarine, sporting incredible fuel economics and solid steel parts.',
    features: ['SNS Heavy Duty SnS Double Spring Suspensions', 'Solid Steel Crash Guard', 'Extra-Wide Double Foam Seat', 'Long Wheelbase chassis'],
    ratingsSum: 0,
    ratingsCount: 0
  },
  {
    id: 'bike-bajaj-boxer-125',
    category: 'Motorcycle',
    make: 'Bajaj Auto',
    model: 'Bajaj Boxer 125 HD',
    year: 2024,
    price: 3100000,
    mileage: 0,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    condition: 'New',
    availability: 'Available',
    imageUrls: ['https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=800'],
    specs: {
      engine: '124.6cc air-cooled Spark Ignition',
      horsepower: 10,
      fuelEconomy: '54 km/L',
      exteriorColor: 'Cherry Red',
      interiorColor: 'N/A',
      drivetrain: 'Chain Drive',
      acceleration: '6.7s (0-60 km/h)'
    },
    description: 'Ideal combination of 125cc power and commercial durability. Fully optimized to handle any dirt roads or heavy-duty weights across local operating sectors.',
    features: ['Dual SnS Springs', 'Integrated Mudguards', 'Engine Sump Guard', 'All-alloy standard wheel rims'],
    ratingsSum: 0,
    ratingsCount: 0
  },
  {
    id: 'bike-bajaj-boxer-150',
    category: 'Motorcycle',
    make: 'Bajaj Auto',
    model: 'Bajaj Boxer 150 HD',
    year: 2024,
    price: 3400000,
    mileage: 0,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    condition: 'New',
    availability: 'Available',
    imageUrls: ['https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=800'],
    specs: {
      engine: '144.8cc Natural Air Cooled SI Engine',
      horsepower: 12,
      fuelEconomy: '48 km/L',
      exteriorColor: 'Sapphire Blue',
      interiorColor: 'N/A',
      drivetrain: 'Chain Drive',
      acceleration: '5.9s (0-60 km/h)'
    },
    description: 'A higher capacity workhorse with an operating manual 4-gear transmission block, tremendous low-end torque, and reliable electric start.',
    features: ['USB Mobile Charging Ports', 'Massive 150cc engine block', 'Rigid crossbar protection frames', 'Heavy duty rear luggage rack'],
    ratingsSum: 0,
    ratingsCount: 0
  },
  {
    id: 'bike-bajaj-boxer-150-x',
    category: 'Motorcycle',
    make: 'Bajaj Auto',
    model: 'Bajaj Boxer 150 X',
    year: 2024,
    price: 3650000,
    mileage: 0,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    condition: 'New',
    availability: 'Available',
    imageUrls: ['https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=800'],
    specs: {
      engine: '144.8cc Crossbar Offroad Engine',
      horsepower: 12,
      fuelEconomy: '46 km/L',
      exteriorColor: 'Forest Green',
      interiorColor: 'N/A',
      drivetrain: 'Chain Drive',
      acceleration: '5.8s (0-60 km/h)'
    },
    description: 'The ultimate rugged off-road variants of the classic Boxer. Includes knobby tyres, higher offroad mudguards, and dual fork boot gaiters.',
    features: ['Knobby Offroad Terrain Tyres', 'High-mount dirt mudguard', 'Dual Fork boot gaiters', 'Matte Black protective crash cages'],
    ratingsSum: 0,
    ratingsCount: 0
  },
  // Honda Motorcycles
  {
    id: 'bike-honda-ace-110',
    category: 'Motorcycle',
    make: 'Honda',
    model: 'Honda ACE 110',
    year: 2024,
    price: 2900000,
    mileage: 0,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    condition: 'New',
    availability: 'Available',
    imageUrls: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800'],
    specs: {
      engine: '109.1cc Single Cylinder, OHC, Air-cooled',
      horsepower: 8.4,
      fuelEconomy: '60 km/L',
      exteriorColor: 'Crimson Red',
      interiorColor: 'N/A',
      drivetrain: 'Chain Drive',
      acceleration: '7.2s (0-60 km/h)'
    },
    description: 'Honda\'s ultra-affordable daily commuter featuring original Japanese OHC legacy components and comfortable flat-bed seating options.',
    features: ['Honda OHC Engine technology', 'Large 10L Fuel Capacity Reservoir', 'Extra Cushion Flat-bed bench Seat', 'Standard kick & electric starters'],
    ratingsSum: 0,
    ratingsCount: 0
  },
  {
    id: 'bike-honda-ace-125',
    category: 'Motorcycle',
    make: 'Honda',
    model: 'Honda ACE 125',
    year: 2024,
    price: 3300000,
    mileage: 0,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    condition: 'New',
    availability: 'Available',
    imageUrls: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800'],
    specs: {
      engine: '124.7cc air-cooled single-cylinder',
      horsepower: 9.8,
      fuelEconomy: '52 km/L',
      exteriorColor: 'Pristine Black',
      interiorColor: 'N/A',
      drivetrain: 'Chain Drive',
      acceleration: '6.4s (0-60 km/h)'
    },
    description: 'A classic 125cc high-reliability model optimized for longer journeys and rural transports without maintenance headaches.',
    features: ['Refined 5-plate oil clutches', 'Extra long robust rear load plates', 'High-quality chrome silencerguards', 'Telescopic front absorbers'],
    ratingsSum: 0,
    ratingsCount: 0
  },
  {
    id: 'bike-honda-ace-150',
    category: 'Motorcycle',
    make: 'Honda',
    model: 'Honda ACE 150',
    year: 2024,
    price: 3800000,
    mileage: 0,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    condition: 'New',
    availability: 'Available',
    imageUrls: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800'],
    specs: {
      engine: '149.2cc solid single OHC cylinder',
      horsepower: 11.5,
      fuelEconomy: '48 km/L',
      exteriorColor: 'Deep Emerald Green',
      interiorColor: 'N/A',
      drivetrain: 'Chain Drive',
      acceleration: '5.5s (0-60 km/h)'
    },
    description: 'Tough premium 150cc delivery and transit options with high-durability rear load plates and reliable Honda hydraulic systems.',
    features: ['Massive Torsional Frame Stiffness', 'Front Disc Brake systems', 'Excellent Ground Clearance profile', 'Halogen front powerful reflector headlamps'],
    ratingsSum: 0,
    ratingsCount: 0
  },
  // Yamaha Motor Company Motorcycles
  {
    id: 'bike-yamaha-ybr-125',
    category: 'Motorcycle',
    make: 'Yamaha Motor Company',
    model: 'Yamaha YBR 125',
    year: 2024,
    price: 4200000,
    mileage: 0,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    condition: 'New',
    availability: 'Available',
    imageUrls: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800'],
    specs: {
      engine: '124cc air cooled, 4-stroke, SOHC, 2-valve',
      horsepower: 10,
      fuelEconomy: '55 km/L',
      exteriorColor: 'Candy Red',
      interiorColor: 'N/A',
      drivetrain: 'Chain Drive',
      acceleration: '6.2s (0-60 km/h)'
    },
    description: 'High-build elegance paired with absolute premium commuting performance, featuring alloy wheels, SOHC engine refinements, and high resale values.',
    features: ['Refined SOHC balance-shaft engine core', 'Slick 5-speed transmission gearbox', 'Front responsive disc brake calipers', 'Multifunction dial indicators'],
    ratingsSum: 0,
    ratingsCount: 0
  },
  {
    id: 'bike-yamaha-ybr-125g',
    category: 'Motorcycle',
    make: 'Yamaha Motor Company',
    model: 'Yamaha YBR 125G',
    year: 2024,
    price: 4800000,
    mileage: 5,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    condition: 'New',
    availability: 'Available',
    imageUrls: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800'],
    specs: {
      engine: '124cc rugged SOHC trail block',
      horsepower: 10,
      fuelEconomy: '52 km/L',
      exteriorColor: 'Matte Grey',
      interiorColor: 'N/A',
      drivetrain: 'Chain Drive',
      acceleration: '6.4s (0-60 km/h)'
    },
    description: 'The offroad scrambler edition of the YBR featuring high front mudguards, handguards, and dual-purpose knobby speed tyres.',
    features: ['Dual-purpose Scrambler mudguards', 'Premium Rubber hand protectors', 'Heavy duty engine crash bar guards', 'Premium front suspension shock boots'],
    ratingsSum: 0,
    ratingsCount: 0
  },
  {
    id: 'bike-yamaha-fz-25',
    category: 'Motorcycle',
    make: 'Yamaha Motor Company',
    model: 'Yamaha FZ 25',
    year: 2023,
    price: 7500000,
    mileage: 1800,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    condition: 'Used',
    availability: 'Available',
    imageUrls: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800'],
    specs: {
      engine: '249cc single-cylinder BlueCore engine',
      horsepower: 20.8,
      fuelEconomy: '40 km/L',
      exteriorColor: 'Racing Black',
      interiorColor: 'N/A',
      drivetrain: 'Chain Drive',
      acceleration: '8.8s (0-100 km/h)'
    },
    description: 'A muscle-styled 250cc hypernaked commuter offering massive low-end torque, dual-channel ABS, and LED projector headlights.',
    features: ['High strength dual-channel ABS brakes', 'Efficient BlueCore combustion engine', 'Modern LED projector headlamp array', 'Monoshock rear suspension dampers'],
    ratingsSum: 0,
    ratingsCount: 0
  },
  {
    id: 'bike-yamaha-r15m',
    category: 'Motorcycle',
    make: 'Yamaha Motor Company',
    model: 'Yamaha R15M',
    year: 2024,
    price: 9500000,
    mileage: 10,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    condition: 'New',
    availability: 'Available',
    imageUrls: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800'],
    specs: {
      engine: '155cc Liquid Cooled 4V SOHC VVA Engine',
      horsepower: 18.4,
      fuelEconomy: '45 km/L',
      exteriorColor: 'Metallic Silver R15M Spec',
      interiorColor: 'N/A',
      drivetrain: 'Chain Drive',
      acceleration: '10.1s (0-100 km/h)'
    },
    description: 'The peak of sub-200cc supersports engineering, complete with Traction Control, Quick Shifter, and assist-slipper clutches.',
    features: ['Precision Quick Shifter (Upshift)', 'Traction Control safety systems', 'Assist and slipper performance clutch', 'Variable Valve Actuation (VVA) power curves'],
    ratingsSum: 0,
    ratingsCount: 0
  },
  {
    id: 'bike-yamaha-xsr155',
    category: 'Motorcycle',
    make: 'Yamaha Motor Company',
    model: 'Yamaha XSR155',
    year: 2024,
    price: 8900000,
    mileage: 150,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    condition: 'Used',
    availability: 'Available',
    imageUrls: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800'],
    specs: {
      engine: '155cc VVA Liquid Cooled Single SOHC',
      horsepower: 19,
      fuelEconomy: '48 km/L',
      exteriorColor: 'Silver & Brown Heritage Leather Seat',
      interiorColor: 'N/A',
      drivetrain: 'Chain Drive',
      acceleration: '11.2s (0-100 km/h)'
    },
    description: 'Beautiful neo-retro heritage machine, fusing vintage custom cruiser aesthetics with premium Yamaha delta-box frames.',
    features: ['Authentic retro circle LED headlights', 'Custom brown tuck-and-roll seat', 'Deltabox Frame premium handling', 'LCD Digital retro console dial'],
    ratingsSum: 0,
    ratingsCount: 0
  },
  // Hero MotoCorp Motorcycles
  {
    id: 'bike-hero-hunk-150',
    category: 'Motorcycle',
    make: 'Hero MotoCorp',
    model: 'Hero Hunk 150',
    year: 2024,
    price: 3900000,
    mileage: 0,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    condition: 'New',
    availability: 'Available',
    imageUrls: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800'],
    specs: {
      engine: '149.2cc ATFT Single cylinder air-cooled',
      horsepower: 14.4,
      fuelEconomy: '50 km/L',
      exteriorColor: 'Tectonic Silver',
      interiorColor: 'N/A',
      drivetrain: 'Chain Drive',
      acceleration: '5.6s (0-60 km/h)'
    },
    description: 'Chiseled muscle tank aesthetics, advanced swirl-induction combustion, and highly comfortable commuter ergonomics.',
    features: ['ATFT swirl combustion engine', 'Rear gas-charged dual-reservoir absorbers', 'Front broad Braking discs', 'Sculpted muscular fuel tank guards'],
    ratingsSum: 0,
    ratingsCount: 0
  },
  {
    id: 'bike-hero-splendor-plus',
    category: 'Motorcycle',
    make: 'Hero MotoCorp',
    model: 'Hero Splendor Plus',
    year: 2024,
    price: 2500000,
    mileage: 0,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    condition: 'New',
    availability: 'Available',
    imageUrls: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800'],
    specs: {
      engine: '97.2cc APDV single cylinder engine',
      horsepower: 8,
      fuelEconomy: '72 km/L',
      exteriorColor: 'Slate Black',
      interiorColor: 'N/A',
      drivetrain: 'Chain Drive',
      acceleration: '8.4s (0-60 km/h)'
    },
    description: 'The world\'s most popular commuter bike family. Possessing legend-tier durability and unbelievable fuel savings ideal for any commercial setup.',
    features: ['i3S Smart Idle Start-Stop Technologies', 'APDV fuel efficiency engine block', 'Low maintenance maintenance curves', 'Tubeless long wearing tyres'],
    ratingsSum: 0,
    ratingsCount: 0
  },
  {
    id: 'bike-hero-hf-deluxe',
    category: 'Motorcycle',
    make: 'Hero MotoCorp',
    model: 'Hero HF Deluxe',
    year: 2023,
    price: 2300000,
    mileage: 400,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    condition: 'Used',
    availability: 'Available',
    imageUrls: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800'],
    specs: {
      engine: '97.2cc single air cooled OHC',
      horsepower: 8,
      fuelEconomy: '70 km/L',
      exteriorColor: 'Candy Red Accent',
      interiorColor: 'N/A',
      drivetrain: 'Chain Drive',
      acceleration: '8.6s (0-60 km/h)'
    },
    description: 'An affordable urban runabout, combining high payload stability with simple mechanics and lightweight frame maneuvering.',
    features: ['All-weather easy starter system', 'Strong lightweight alloy structures', 'Broad comfortable ride seats', 'Highly affordable standard spares'],
    ratingsSum: 0,
    ratingsCount: 0
  },
  // Suzuki Motorcycles
  {
    id: 'bike-suzuki-gd110',
    category: 'Motorcycle',
    make: 'Suzuki',
    model: 'Suzuki GD110',
    year: 2024,
    price: 3200000,
    mileage: 0,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    condition: 'New',
    availability: 'Available',
    imageUrls: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800'],
    specs: {
      engine: '113cc single cylinder, 4-stroke, SOHC',
      horsepower: 8.2,
      fuelEconomy: '58 km/L',
      exteriorColor: 'Titanium Blue',
      interiorColor: 'N/A',
      drivetrain: 'Chain Drive',
      acceleration: '7.0s (0-60 km/h)'
    },
    description: 'Refined Suzuki SOHC commuter engine, sporting a sporty elegant layout, highly responsive drum brakes, and low emission values.',
    features: ['High-torque SOHC engine setup', 'Chrome heavy protective heatshields', 'Broad rear passenger luggage carriers', 'Optimized multi-spoke wheel durability'],
    ratingsSum: 0,
    ratingsCount: 0
  },
  {
    id: 'bike-suzuki-gs150r',
    category: 'Motorcycle',
    make: 'Suzuki',
    model: 'Suzuki GS150R',
    year: 2024,
    price: 4300000,
    mileage: 0,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    condition: 'New',
    availability: 'Available',
    imageUrls: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800'],
    specs: {
      engine: '149.5cc SOHC high-transmission performance',
      horsepower: 13.8,
      fuelEconomy: '48 km/L',
      exteriorColor: 'Pearl Black',
      interiorColor: 'N/A',
      drivetrain: 'Chain Drive',
      acceleration: '5.2s (0-60 km/h)'
    },
    description: 'A 6-speed gear ratio pioneer, designed for longer highway journeys with an extremely balanced engine dynamic and robust stance.',
    features: ['Uncommon 6-speed sports gear ratios', 'High capacity fuel holding tank (15L)', 'Eco and Power ride mode meters', 'Front ventilated premium disc brakes'],
    ratingsSum: 0,
    ratingsCount: 0
  }
];

const initialReviews: Review[] = [
  {
    id: 'rev-1',
    vehicleId: 'car-1',
    userName: 'Alexander Wright',
    rating: 5,
    comment: 'This car is from the future! Acceleration is absolute mind-blowing, and the technology handles everything gracefully. Best purchase of my life.',
    date: '2026-05-18'
  },
  {
    id: 'rev-2',
    vehicleId: 'car-1',
    userName: 'Sofia Martinez',
    rating: 5,
    comment: 'Incredibly quiet cabin, superb premium sound, and charging is so convenient. Zenjy made the delivery ultra fast and safe!',
    date: '2026-06-01'
  },
  {
    id: 'rev-3',
    vehicleId: 'car-2',
    userName: 'Marcus Sterling',
    rating: 4,
    comment: 'The track handling is insane. That Isle of Man Green metallic color gets compliments everywhere I drive. One star off only because of suspension stiffness on highway potholes.',
    date: '2026-05-24'
  }
];

const initialUsers: User[] = [
  {
    id: 'user-admin',
    name: 'Zenjy Administrator',
    email: 'admin@zenjy.com',
    role: 'admin',
    savedVehicles: ['car-3']
  },
  {
    id: 'user-guest',
    name: 'Valued Customer',
    email: 'monnrayyasin@gmail.com', // Filled from metadata
    role: 'user',
    savedVehicles: ['car-1', 'car-2']
  }
];

const defaultContactInfo: ContactInfo = {
  address: '500 Luxury Boulevard, Suite A, Premium District, NY 10013',
  phone: '+1 (500) ZEN-CARS',
  phoneRaw: '+15009362277',
  email: 'contact@zenjy.com',
  whatsapp: '15009362277',
  hoursMonFri: '24 Hours / Always Open',
  hoursSat: '24 Hours / Always Open',
  hoursSun: '24 Hours / Always Open',
  hoursNote: 'Showroom, Support & Direct delivery dispatches occur 24/7/365.'
};

interface Database {
  vehicles: Vehicle[];
  reviews: Review[];
  users: User[];
  orders: Order[];
  inquiries: Inquiry[];
  testDrives: TestDrive[];
  contactInfo?: ContactInfo;
}

// Loads DB or seeds initial data
function loadDB(): Database {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const db: Database = JSON.parse(data);
      let modified = false;
      initialVehicles.forEach(iv => {
        if (!db.vehicles.some(v => v.id === iv.id)) {
          db.vehicles.push(iv);
          modified = true;
        }
      });
      if (!db.contactInfo) {
        db.contactInfo = defaultContactInfo;
        modified = true;
      }
      if (modified) {
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
      }
      return db;
    }
  } catch (err) {
    console.error('Error reading db.json:', err);
  }
  
  // Seed first
  const db: Database = {
    vehicles: initialVehicles,
    reviews: initialReviews,
    users: initialUsers,
    orders: [],
    inquiries: [
      {
        id: 'inq-1',
        customerName: 'Aisha Jordan',
        email: 'aisha@example.com',
        phone: '+1 (555) 321-9876',
        vehicleId: 'car-1',
        vehicleName: 'Tesla Model S Plaid',
        message: 'Hello, is this car available for instant custom finance plans? I would love to talk to an expert or have a quick inspection booking scheduled.',
        date: '2026-06-05T10:00:00Z',
        status: 'New'
      },
      {
        id: 'inq-2',
        customerName: 'Kenji Sato',
        email: 'kenji@example.com',
        phone: '+81 90 1234 5678',
        message: 'Could you import specific Japanese models with custom certifications? Please let me know your services regarding high-end sports imports.',
        date: '2026-06-07T14:30:00Z',
        status: 'Read'
      }
    ],
    testDrives: [
      {
        id: 'td-1',
        customerName: 'Marcus Sterling',
        email: 'marcus@example.com',
        phone: '+1 (555) 765-4321',
        vehicleId: 'car-2',
        vehicleName: 'BMW M4 Competition Coupe',
        dateTime: '2026-06-15T11:00:00.000Z',
        status: 'Confirmed',
        date: '2026-06-08'
      }
    ],
    contactInfo: defaultContactInfo
  };
  saveDB(db);
  return db;
}

function saveDB(db: Database) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write to db.json:', err);
  }
}

// Load data immediately
let database = loadDB();

// Setup Shared AI Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Helper: authenticate user from token header
function authenticate(req: express.Request): User | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return null;
  // Simplified token system: token is the user.id
  const user = database.users.find(u => u.id === token);
  return user || null;
}

// Helper: isAdmin
function isAdmin(user: User | null): boolean {
  return !!user && user.role === 'admin';
}

// -----------------------------------------------------------------------------
// API Endpoints
// -----------------------------------------------------------------------------

// --- AUTHENTICATION ---
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required.' });
    return;
  }
  
  const existing = database.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.status(400).json({ error: 'User with this email already exists.' });
    return;
  }

  const isFirstAdmin = email.toLowerCase().includes('admin');
  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    role: isFirstAdmin ? 'admin' : 'user',
    savedVehicles: []
  };

  database.users.push(newUser);
  saveDB(database);

  res.json({ user: newUser, token: newUser.id });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required.' });
    return;
  }

  const user = database.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    // If guest clicks log-in with their email, auto-create a user to make it elegant or fail nicely
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
      savedVehicles: []
    };
    database.users.push(newUser);
    saveDB(database);
    res.json({ user: newUser, token: newUser.id });
    return;
  }

  res.json({ user, token: user.id });
});

app.get('/api/auth/me', (req, res) => {
  const user = authenticate(req);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized profile retrieval.' });
    return;
  }
  res.json(user);
});

app.put('/api/auth/update', (req, res) => {
  const user = authenticate(req);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }
  const { name, email } = req.body;
  
  const found = database.users.find(u => u.id === user.id);
  if (found) {
    if (name) found.name = name;
    if (email) found.email = email;
    saveDB(database);
    res.json(found);
  } else {
    res.status(404).json({ error: 'User not found in DB.' });
  }
});

app.post('/api/auth/wishlist', (req, res) => {
  const user = authenticate(req);
  if (!user) {
    res.status(412).json({ error: 'Login required to add to saved vehicles.' });
    return;
  }
  const { vehicleId } = req.body;
  if (!vehicleId) {
    res.status(400).json({ error: 'Vehicle ID required.' });
    return;
  }

  const foundUser = database.users.find(u => u.id === user.id);
  if (!foundUser) {
    res.status(404).json({ error: 'User record missing.' });
    return;
  }

  const index = foundUser.savedVehicles.indexOf(vehicleId);
  let action: 'added' | 'removed' = 'added';
  if (index >= 0) {
    foundUser.savedVehicles.splice(index, 1);
    action = 'removed';
  } else {
    foundUser.savedVehicles.push(vehicleId);
  }

  saveDB(database);
  res.json({ savedVehicles: foundUser.savedVehicles, action });
});

// --- DYNAMIC FRONTEND /api/users ENDPOINTS (Direct User Return mappings) ---
app.post('/api/users/login', (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required.' });
    return;
  }

  let user = database.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    // If guest clicks log-in with their email, auto-create a user
    user = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
      savedVehicles: []
    };
    database.users.push(user);
    saveDB(database);
  }
  res.json(user);
});

app.post('/api/users/register', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required.' });
    return;
  }
  
  const existing = database.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.status(400).json({ error: 'User with this email already exists.' });
    return;
  }

  const isFirstAdmin = email.toLowerCase().includes('admin');
  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    role: isFirstAdmin ? 'admin' : 'user',
    savedVehicles: []
  };

  database.users.push(newUser);
  saveDB(database);

  res.json(newUser);
});

app.put('/api/users/:id', (req, res) => {
  const targetId = req.params.id;
  const { name, email } = req.body;
  
  const found = database.users.find(u => u.id === targetId);
  if (found) {
    if (name) found.name = name;
    if (email) found.email = email;
    saveDB(database);
    res.json(found);
  } else {
    res.status(404).json({ error: 'User not found in DB.' });
  }
});

app.post('/api/users/:id/wishlist', (req, res) => {
  const targetId = req.params.id;
  const { savedVehicles } = req.body;
  if (!savedVehicles || !Array.isArray(savedVehicles)) {
    res.status(400).json({ error: 'savedVehicles array is required.' });
    return;
  }

  const foundUser = database.users.find(u => u.id === targetId);
  if (!foundUser) {
    res.status(404).json({ error: 'User record missing.' });
    return;
  }

  foundUser.savedVehicles = savedVehicles;
  saveDB(database);
  res.json(foundUser);
});

// --- ADMIN CONTROL & SPECIAL LOGIN ---
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required.' });
    return;
  }

  if (username === 'YASIN' && password === 'OMAR') {
    // Retrieve or create primary administrative account
    let adminUser = database.users.find(u => u.role === 'admin');
    if (!adminUser) {
      adminUser = {
        id: 'user-admin',
        name: 'YASIN',
        email: 'yasin@example.com',
        role: 'admin',
        savedVehicles: []
      };
      database.users.push(adminUser);
      saveDB(database);
    } else {
      // Ensure the name is aligned with the username requested
      adminUser.name = 'YASIN';
      saveDB(database);
    }
    res.json({ user: adminUser, token: adminUser.id });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials. Please enter "YASIN" and "OMAR" as username and password.' });
  }
});

// Admin endpoint to list all joined users
app.get('/api/admin/users', (req, res) => {
  const user = authenticate(req);
  if (!isAdmin(user)) {
    res.status(403).json({ error: 'Access forbidden. Administrative privileges required.' });
    return;
  }
  res.json(database.users);
});

// Admin endpoint to update user roles/details
app.put('/api/admin/users/:id', (req, res) => {
  const user = authenticate(req);
  if (!isAdmin(user)) {
    res.status(403).json({ error: 'Access forbidden.' });
    return;
  }
  const targetUser = database.users.find(u => u.id === req.params.id);
  if (!targetUser) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }
  const { name, email, role } = req.body;
  if (name) targetUser.name = name;
  if (email) targetUser.email = email;
  if (role) targetUser.role = role;
  saveDB(database);
  res.json(targetUser);
});

// Admin endpoint to delete or revoke a user's membership
app.delete('/api/admin/users/:id', (req, res) => {
  const user = authenticate(req);
  if (!isAdmin(user)) {
    res.status(403).json({ error: 'Access forbidden.' });
    return;
  }
  const targetId = req.params.id;
  if (targetId === user.id || targetId === 'user-admin') {
    res.status(400).json({ error: 'Cannot delete the currently authenticated administrator.' });
    return;
  }
  const idx = database.users.findIndex(u => u.id === targetId);
  if (idx < 0) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }
  const deleted = database.users.splice(idx, 1);
  saveDB(database);
  res.json({ message: 'User removed from joined system database.', deleted: deleted[0] });
});

// --- VEHICLES (INVENTORY) ---
app.get('/api/vehicles', (req, res) => {
  let list = [...database.vehicles];
  const { make, model, year, minPrice, maxPrice, fuelType, transmission, condition, search } = req.query;

  if (make) {
    list = list.filter(c => c.make.toLowerCase() === (make as string).toLowerCase());
  }
  if (model) {
    list = list.filter(c => c.model.toLowerCase().includes((model as string).toLowerCase()));
  }
  if (year) {
    list = list.filter(c => c.year === parseInt(year as string));
  }
  if (minPrice) {
    list = list.filter(c => c.price >= parseInt(minPrice as string));
  }
  if (maxPrice) {
    list = list.filter(c => c.price <= parseInt(maxPrice as string));
  }
  if (fuelType) {
    list = list.filter(c => c.fuelType.toLowerCase() === (fuelType as string).toLowerCase());
  }
  if (transmission) {
    list = list.filter(c => c.transmission.toLowerCase() === (transmission as string).toLowerCase());
  }
  if (condition) {
    list = list.filter(c => c.condition.toLowerCase() === (condition as string).toLowerCase());
  }
  if (search) {
    const q = (search as string).toLowerCase();
    list = list.filter(c => 
      c.make.toLowerCase().includes(q) || 
      c.model.toLowerCase().includes(q) || 
      c.description.toLowerCase().includes(q) ||
      c.specs.exteriorColor.toLowerCase().includes(q)
    );
  }

  res.json(list);
});

app.get('/api/vehicles/:id', (req, res) => {
  const car = database.vehicles.find(c => c.id === req.params.id);
  if (!car) {
    res.status(404).json({ error: 'Vehicle not found.' });
    return;
  }
  res.json(car);
});

app.post('/api/vehicles', (req, res) => {
  const user = authenticate(req);
  if (!isAdmin(user)) {
    res.status(403).json({ error: 'Access forbidden. Administrator permissions required.' });
    return;
  }

  const newCar: Vehicle = {
    id: `car-${Date.now()}`,
    ...req.body,
    ratingsSum: 0,
    ratingsCount: 0,
    availability: 'Available'
  };

  database.vehicles.push(newCar);
  saveDB(database);
  res.status(201).json(newCar);
});

app.put('/api/vehicles/:id', (req, res) => {
  const user = authenticate(req);
  if (!isAdmin(user)) {
    res.status(403).json({ error: 'Forbidden.' });
    return;
  }

  const idx = database.vehicles.findIndex(c => c.id === req.params.id);
  if (idx < 0) {
    res.status(404).json({ error: 'Vehicle not found.' });
    return;
  }

  database.vehicles[idx] = {
    ...database.vehicles[idx],
    ...req.body
  };

  saveDB(database);
  res.json(database.vehicles[idx]);
});

app.delete('/api/vehicles/:id', (req, res) => {
  const user = authenticate(req);
  if (!isAdmin(user)) {
    res.status(403).json({ error: 'Forbidden.' });
    return;
  }

  const idx = database.vehicles.findIndex(c => c.id === req.params.id);
  if (idx < 0) {
    res.status(404).json({ error: 'Vehicle not found.' });
    return;
  }

  const deleted = database.vehicles.splice(idx, 1);
  saveDB(database);
  res.json({ message: 'Vehicle deleted successfully', deleted: deleted[0] });
});

// --- ORDERS ---
app.post('/api/orders', (req, res) => {
  const user = authenticate(req);
  const { customerName, email, phone, address, items, paymentMethod } = req.body;
  
  if (!customerName || !email || !items || !items.length) {
    res.status(400).json({ error: 'Missing required order details.' });
    return;
  }

  const orderItems: Vehicle[] = [];
  let totalAmount = 0;

  for (const item of items) {
    const realCar = database.vehicles.find(c => c.id === item.id);
    if (realCar) {
      if (realCar.availability === 'Sold') {
        res.status(400).json({ error: `Vehicle ${realCar.make} ${realCar.model} is already sold.` });
        return;
      }
      orderItems.push(realCar);
      totalAmount += realCar.price;
      
      // Update inventory status
      realCar.availability = 'Sold';
    }
  }

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    userId: user ? user.id : 'guest',
    customerName,
    email,
    phone,
    address,
    items: orderItems,
    totalAmount,
    paymentMethod,
    paymentStatus: paymentMethod === 'CreditCard' || paymentMethod === 'PayPal' ? 'Paid' : 'Pending',
    orderStatus: 'Processing',
    date: new Date().toISOString()
  };

  database.orders.push(newOrder);
  saveDB(database);
  res.status(201).json(newOrder);
});

app.get('/api/orders', (req, res) => {
  const user = authenticate(req);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  if (isAdmin(user)) {
    res.json(database.orders);
  } else {
    // Only return user's orders
    const history = database.orders.filter(o => o.userId === user.id);
    res.json(history);
  }
});

app.put('/api/orders/:id/status', (req, res) => {
  const user = authenticate(req);
  if (!isAdmin(user)) {
    res.status(403).json({ error: 'Forbidden.' });
    return;
  }

  const found = database.orders.find(o => o.id === req.params.id);
  if (!found) {
    res.status(404).json({ error: 'Order not found.' });
    return;
  }

  const { orderStatus, paymentStatus } = req.body;
  if (orderStatus) found.orderStatus = orderStatus;
  if (paymentStatus) found.paymentStatus = paymentStatus;

  saveDB(database);
  res.json(found);
});

// --- INQUIRIES ---
app.post('/api/inquiries', (req, res) => {
  const { customerName, email, phone, vehicleId, message } = req.body;
  if (!customerName || !email || !message) {
    res.status(400).json({ error: 'Name, email and message are required.' });
    return;
  }

  let vehicleName = undefined;
  if (vehicleId) {
    const vc = database.vehicles.find(v => v.id === vehicleId);
    if (vc) vehicleName = `${vc.make} ${vc.model}`;
  }

  const newInquiry: Inquiry = {
    id: `inq-${Date.now()}`,
    customerName,
    email,
    phone: phone || '',
    vehicleId,
    vehicleName,
    message,
    date: new Date().toISOString(),
    status: 'New'
  };

  database.inquiries.push(newInquiry);
  saveDB(database);
  res.status(201).json(newInquiry);
});

app.get('/api/inquiries', (req, res) => {
  const user = authenticate(req);
  if (!isAdmin(user)) {
    res.status(403).json({ error: 'Forbidden.' });
    return;
  }
  res.json(database.inquiries);
});

app.put('/api/inquiries/:id', (req, res) => {
  const user = authenticate(req);
  if (!isAdmin(user)) {
    res.status(403).json({ error: 'Forbidden.' });
    return;
  }

  const inq = database.inquiries.find(i => i.id === req.params.id);
  if (!inq) {
    res.status(404).json({ error: 'Inquiry not found.' });
    return;
  }

  const { status } = req.body;
  if (status) inq.status = status;

  saveDB(database);
  res.json(inq);
});

// --- TEST DRIVE BOOKINGS ---
app.post('/api/test-drives', (req, res) => {
  const { customerName, email, phone, vehicleId, dateTime } = req.body;
  if (!customerName || !email || !vehicleId || !dateTime) {
    res.status(400).json({ error: 'Missing contact, vehicle, or timing details.' });
    return;
  }

  const vc = database.vehicles.find(v => v.id === vehicleId);
  if (!vc) {
    res.status(404).json({ error: 'Car not found for test ride.' });
    return;
  }

  const newBooking: TestDrive = {
    id: `td-${Date.now()}`,
    customerName,
    email,
    phone: phone || '',
    vehicleId,
    vehicleName: `${vc.make} ${vc.model}`,
    dateTime,
    status: 'Pending',
    date: new Date().toISOString().split('T')[0]
  };

  database.testDrives.push(newBooking);
  saveDB(database);
  res.status(201).json(newBooking);
});

app.get('/api/test-drives', (req, res) => {
  const user = authenticate(req);
  if (!isAdmin(user)) {
    res.status(403).json({ error: 'Forbidden.' });
    return;
  }
  res.json(database.testDrives);
});

app.put('/api/test-drives/:id', (req, res) => {
  const user = authenticate(req);
  if (!isAdmin(user)) {
    res.status(403).json({ error: 'Forbidden.' });
    return;
  }

  const td = database.testDrives.find(t => t.id === req.params.id);
  if (!td) {
    res.status(404).json({ error: 'Booking not found.' });
    return;
  }

  const { status } = req.body;
  if (status) td.status = status;

  saveDB(database);
  res.json(td);
});

// --- REVIEWS ---
app.get('/api/reviews/:vehicleId', (req, res) => {
  const filtered = database.reviews.filter(r => r.vehicleId === req.params.vehicleId);
  res.json(filtered);
});

app.post('/api/reviews', (req, res) => {
  const { vehicleId, userName, rating, comment } = req.body;
  if (!vehicleId || !rating || !comment || !userName) {
    res.status(400).json({ error: 'Missing rating details.' });
    return;
  }

  const car = database.vehicles.find(c => c.id === vehicleId);
  if (!car) {
    res.status(404).json({ error: 'Vehicle not found.' });
    return;
  }

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    vehicleId,
    userName,
    rating: parseInt(rating),
    comment,
    date: new Date().toISOString().split('T')[0]
  };

  database.reviews.push(newReview);
  
  // Update vehicle aggregate ratings
  car.ratingsSum += parseInt(rating);
  car.ratingsCount += 1;

  saveDB(database);
  res.status(201).json(newReview);
});

// --- CONTACT INFORMATION ---
app.get('/api/contact', (req, res) => {
  res.json(database.contactInfo || defaultContactInfo);
});

app.put('/api/contact', (req, res) => {
  const user = authenticate(req);
  if (!isAdmin(user)) {
    res.status(403).json({ error: 'Access forbidden. Administrative privileges required.' });
    return;
  }

  const { address, phone, phoneRaw, email, whatsapp, hoursMonFri, hoursSat, hoursSun, hoursNote } = req.body;
  
  const updatedInfo: ContactInfo = {
    address: address || '',
    phone: phone || '',
    phoneRaw: phoneRaw || '',
    email: email || '',
    whatsapp: whatsapp || '',
    hoursMonFri: hoursMonFri || '',
    hoursSat: hoursSat || '',
    hoursSun: hoursSun || '',
    hoursNote: hoursNote || ''
  };

  database.contactInfo = updatedInfo;
  saveDB(database);
  res.json(updatedInfo);
});

// --- STATS / ANALYTICS ---
app.get('/api/stats', (req, res) => {
  const user = authenticate(req);
  if (!isAdmin(user)) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  const totalSales = database.orders.length;
  const totalRevenue = database.orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalVehicles = database.vehicles.length;
  const totalUsers = database.users.length;
  const inquiriesCount = database.inquiries.length;

  // Group revenue by Month
  const revenueHistory = database.orders.map(o => ({
    date: o.date,
    amount: o.totalAmount,
    method: o.paymentMethod
  }));

  // Vehicles status breakdown
  const statusBreakdown = {
    Available: database.vehicles.filter(v => v.availability === 'Available').length,
    Sold: database.vehicles.filter(v => v.availability === 'Sold').length
  };

  res.json({
    totalSales,
    totalRevenue,
    totalVehicles,
    totalUsers,
    inquiriesCount,
    revenueHistory,
    statusBreakdown
  });
});

// --- AI SALES CHAT ---
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: 'Messages history are required.' });
    return;
  }

  const latestMessage = messages[messages.length - 1]?.text || '';
  
  if (!ai) {
    // Elegant, witty fallback in case GEMINI_API_KEY is not defined yet
    let fallbackText = "Habari! I am Zenjy's premium AI Concierge at Zenjy Motors Dealership. How can I assist you with our Tanzanian vehicle inventory today?";
    const query = latestMessage.toLowerCase();
    
    if (query.includes('hilux') || query.includes('pickup') || query.includes('double cabin')) {
      fallbackText = "Our Attitude Black Toyota Hilux Double Cabin (2023, Diesel, TZS 109,200,000) is the ultimate king of Tanzanian roads. It has a robust 2.8L GD-6 engine and the strength to handle standard safari trails. Would you like me to book a physical inspection?";
    } else if (query.includes('land cruiser') || query.includes('lc300') || query.includes('prado')) {
      fallbackText = "Our majestic Precious White Toyota Land Cruiser 300 ZX (2024, Twin-Turbo V6 Diesel, TZS 299,013,000) is the pinnacle of offroad luxury and status. It is fully available for executive transit. I can schedule a premium showroom viewing and physical inspection for you this week.";
    } else if (query.includes('patrol') || query.includes('nissan')) {
      fallbackText = "We have an incredible Metallic Star Silver Nissan Patrol Y62 Royale (2023, V8 Petrol Engine, TZS 221,005,000) in showroom condition. Backed by its state Hydraulic Body Motion Control (HBMC) suspension, it conquered all rough terrains easily. Let know if you would like to arrange a finance estimate.";
    } else if (query.includes('jimny') || query.includes('suzuki')) {
      fallbackText = "The highly sought-after Suzuki Jimny 5-Door GLX (2024, Kinetic Yellow, TZS 67,600,000) with AllGrip Pro 4WD is a fantastic compact explorer, perfect for Zanzibar tours or Dar es Salaam city commutes. Extremely fuel efficient and versatile!";
    } else if (query.includes('price') || query.includes('cost') || query.includes('finance')) {
      fallbackText = "We offer flexible transaction options! You can pay using Credit Card, PayPal, Mobile Money, or Bank Transfer. Our inventory ranges from TZS 25,480,000 for the reliable Honda Fit Hybrid to TZS 299,013,000 for the absolute premium Land Cruiser 300 ZX. Which model fits your budget framework?";
    } else if (query.includes('test drive') || query.includes('book') || query.includes('schedule') || query.includes('appointment')) {
      fallbackText = "We would love to coordinate your showroom visit and physical inspection! Simply request details on any vehicle page, or let me know which brand (Toyota, Suzuki, Nissan, Mitsubishi, BMW, Isuzu) you are targeting.";
    } else if (query.includes('where') || query.includes('address') || query.includes('store') || query.includes('location')) {
      fallbackText = "ZENJY MOTORS DEALERSHIP is conveniently situated in Dar es Salaam, Tanzania. We are open and at your service 24 hours a day, 7 days a week, 365 days a year.";
    } else {
      fallbackText = "Welcome to ZENJY MOTORS DEALERSHIP! I can assist you with specs, pricing tables, convenient financing options, and custom inquiries for our popular Tanzanian inventory (Toyota, Nissan, Suzuki, Mazda, Honda, Mitsubishi, Subaru, Isuzu, Tata, BMW). What can I help you find today?";
    }

    res.json({ text: fallbackText });
    return;
  }

  try {
    const formattedPrompt = `You are "Zenjy AI Dealer", a hyper-competent, elegantly spoken, premium automotive concierge at ZENJY MOTORS DEALERSHIP in Tanzania.
We sell premium, durable, and highly capable vehicles optimized for Tanzanian roads, including:
- Toyota Hilux Double Cabin (2023, 2.8L GD-6 Diesel, TZS 109,200,000)
- Toyota Land Cruiser 300 ZX (2024, Twin-Turbo V6 Diesel, TZS 299,013,000)
- Nissan Patrol Y62 Royale (2023, 5.6L V8 Petrol, TZS 221,005,000)
- Suzuki Jimny 5-Door GLX (2024, 1.5L Petrol, TZS 67,600,000)
- Mazda CX-5 SkyActiv-D (2022, 2.2L Twin-Turbo Diesel, TZS 53,300,000)
- Honda Fit Hybrid (2021, 1.5L e:HEV Hybrid, TZS 25,480,000)

Our services: Direct shopping cart checkout with Credit Card, PayPal, Mobile Money, or Bank Transfer, custom showroom viewing scheduling, high-integrity client reviews list, and custom vehicle inquiries.
Dealership Hours: Available 24 Hours / 7 Days a week / 365 Days a year.
Contact: +255 ZENJY-CARS, Email: contact@zenjy.com

Maintain a highly polished, helpful, luxury brand agent voice. Do not state you are an AI-language model; stay completely in character. Answer the user's inquiry professionally, referencing relevant car models from our fleet and offering them a physical inspection or to build an inquiry!

Here is the conversation history:
${messages.map(m => `${m.sender === 'user' ? 'Client' : 'Assistant'}: ${m.text}`).join('\n')}
Client: ${latestMessage}
Assistant:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedPrompt,
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error('Gemini call error:', err);
    res.status(500).json({ error: 'AI Concierge temporarily in detailed inspection. Fallback to physical dealer.' });
  }
});

// -----------------------------------------------------------------------------
// Vite Middleware / SPA Fallback Serving
// -----------------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ZENJY MOTORS DEALERSHIP server running on http://localhost:${PORT}`);
  });
}

startServer();
