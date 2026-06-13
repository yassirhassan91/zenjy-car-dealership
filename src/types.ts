export interface Vehicle {
  id: string;
  category?: 'Car' | 'Motorcycle';
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Automatic' | 'Manual';
  condition: 'New' | 'Used';
  availability: 'Available' | 'Sold';
  imageUrls: string[];
  specs: {
    engine: string;
    horsepower: number;
    fuelEconomy: string;
    exteriorColor: string;
    interiorColor: string;
    drivetrain: string;
    acceleration: string;
  };
  description: string;
  features: string[];
  ratingsSum: number;
  ratingsCount: number;
}

export interface Review {
  id: string;
  vehicleId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  savedVehicles: string[]; // vehicleId List
  token?: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: Vehicle[];
  totalAmount: number;
  paymentMethod: 'CreditCard' | 'PayPal' | 'MobileMoney' | 'BankTransfer';
  paymentStatus: 'Pending' | 'Paid';
  orderStatus: 'Processing' | 'Shipped' | 'Completed' | 'Cancelled';
  date: string;
}

export interface Inquiry {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  vehicleId?: string;
  vehicleName?: string;
  message: string;
  date: string;
  status: 'New' | 'Read' | 'Resolved';
}

export interface TestDrive {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  vehicleId: string;
  vehicleName: string;
  dateTime: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  date: string;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  phoneRaw: string;
  email: string;
  whatsapp: string;
  hoursMonFri: string;
  hoursSat: string;
  hoursSun: string;
  hoursNote: string;
}

