import calculatorImg from '../assets/calculator.jpg';
import cycleImg from '../assets/cycle.jpg';
import laptopImg from '../assets/laptop.jpg';
import studyTableImg from '../assets/studytablesandchair.jpg';
import minifridgeImg from '../assets/minifridge.jpg';

export const mockItems = [
    {
        id: 1,
        title: "Casio Scientific Calculator FX-991EX",
        description: "Advanced scientific calculator, perfect for engineering exams. Allowed in university centers.",
        pricePerDay: 30,
        category: "Stationery",
        status: "AVAILABLE",
        imageUrl: calculatorImg,
        owner: { name: "Rahul Verma" },
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        title: "Hero Mountain Bike",
        description: "Rugged mountain bike with 21 gears. Great for campus commute or weekend rides.",
        pricePerDay: 100,
        category: "Bicycles",
        status: "AVAILABLE",
        imageUrl: cycleImg,
        owner: { name: "Amit Kumar" },
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        title: "HP Laptop 15s",
        description: "Lightweight HP laptop, i5 processor. Good for assignments and browsing. Comes with charger.",
        pricePerDay: 500,
        category: "Electronics",
        status: "AVAILABLE",
        imageUrl: laptopImg,
        owner: { name: "Sneha Patel" },
        createdAt: new Date().toISOString()
    },
    {
        id: 4,
        title: "Wooden Study Table & Chair",
        description: "Ergonomic study set. Solid wood table with comfortable chair. Must pick up.",
        pricePerDay: 40,
        category: "Furniture",
        status: "AVAILABLE",
        imageUrl: studyTableImg,
        owner: { name: "Rohan Gupta" },
        createdAt: new Date().toISOString()
    },
    {
        id: 5,
        title: "Portable Mini Fridge",
        description: "Compact fridge, perfect for keeping drinks and snacks cool in your hostel room.",
        pricePerDay: 150,
        category: "Hostel Essentials",
        status: "AVAILABLE",
        imageUrl: minifridgeImg,
        owner: { name: "Priya Singh" },
        createdAt: new Date().toISOString()
    }
];

export const mockBookings = [
    {
        id: 101,
        item: {
            id: 1,
            name: "MacBook Pro M2 2023",
            pricePerDay: 450,
            imageName: null,
            imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        startDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        endDate: new Date(Date.now() + 86400000 * 5).toISOString(),   // 5 days from now
        status: "ACTIVE",
        totalAmount: 3150,
        depositStatus: "HELD",
        securityDeposit: 5000
    },
    {
        id: 102,
        item: {
            id: 3,
            name: "DSLR Camera",
            pricePerDay: 350,
            imageName: null,
            imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        startDate: new Date(Date.now() + 86400000 * 10).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 12).toISOString(),
        status: "UPCOMING",
        totalAmount: 1050,
        depositStatus: "PENDING",
        securityDeposit: 2000
    },
    {
        id: 103,
        item: {
            id: 2,
            name: "Ergonomic Chair",
            pricePerDay: 50,
            imageName: null,
            imageUrl: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        startDate: new Date(Date.now() - 86400000 * 20).toISOString(),
        endDate: new Date(Date.now() - 86400000 * 15).toISOString(),
        status: "COMPLETED",
        totalAmount: 300,
        depositStatus: "REFUNDED",
        securityDeposit: 500
    }
];

export const mockMyListings = [
    {
        id: 11,
        title: "Bluetooth Speaker JBL",
        description: "Portable speaker with great bass.",
        pricePerDay: 60,
        category: "Electronics",
        status: "AVAILABLE",
        imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        owner: { name: "You" },
        createdAt: new Date().toISOString()
    },
    {
        id: 12,
        title: "Marketing Textbook",
        description: "Kotler's Marketing Management. Latest edition.",
        pricePerDay: 25,
        category: "Books",
        status: "BOOKED",
        imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        owner: { name: "You" },
        createdAt: new Date().toISOString()
    }
];
