import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';
import Order from '../models/Order.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nanugujar');
    console.log(`Seeder Connected to: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Seeder connection error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    // 1. Clean database
    await Order.deleteMany();
    await Review.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('Database collections cleared...');

    // 2. Seed Categories
    const tshirtsCat = await Category.create({
      name: 'T-Shirts',
      slug: 't-shirts',
      description: 'Premium cotton and comfortable graphic t-shirts and polos.',
    });

    const pantsCat = await Category.create({
      name: 'Pants',
      slug: 'pants',
      description: 'Stylish, fitted trousers, chinos, denim, and sweatpants.',
    });

    console.log('Categories seeded...');

    // 3. Seed Users
    // Admin user: nanugujar / nanu@123
    const adminUser = await User.create({
      name: 'Nanu Gujar',
      email: 'nanugujar@nanugujar.com', // Will map to "nanugujar" login ID in credentials
      password: 'nanu@123',
      isAdmin: true,
    });

    // Test Customer
    const testCustomer = await User.create({
      name: 'John Doe',
      email: 'customer@customer.com',
      password: 'customer123',
      isAdmin: false,
    });

    console.log('Users seeded (Admin & Test Customer)...');

    // 4. Seed Products
    const products = [
      {
        name: 'NanuGujar Signature Black Tee',
        description: 'Crafted from 100% premium combed cotton. Features a crew neck, ribbed collar, and our signature tagless comfort design. Perfect for everyday luxury streetwear.',
        category: 'T-Shirts',
        price: 499,
        discountPrice: 399,
        stockQuantity: 50,
        images: [
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop'
        ],
        ratings: 4.8,
        numReviews: 2,
      },
      {
        name: 'Summer Pastel Linen Tee',
        description: 'Made from organic lightweight linen. Exceptionally breathable, moisture-wicking, and tailored for a smart-casual summer beach look.',
        category: 'T-Shirts',
        price: 799,
        discountPrice: 0,
        stockQuantity: 30,
        images: [
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop'
        ],
        ratings: 4.2,
        numReviews: 1,
      },
      {
        name: 'Retro Graphic Oversized Tee',
        description: 'Heavyweight 240 GSM pre-shrunk cotton. Embellished with high-density vintage screen prints. Offers an authentic 90s streetwear boxy silhouette.',
        category: 'T-Shirts',
        price: 699,
        discountPrice: 549,
        stockQuantity: 40,
        images: [
          'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop'
        ],
        ratings: 4.5,
        numReviews: 0,
      },
      {
        name: 'Athletic Slim Fit Polo',
        description: 'Flexible waffle knit material. Engineered for high performance, featuring ribbed armbands and a classic three-button placket. Fits snugly on the chest and arms.',
        category: 'T-Shirts',
        price: 899,
        discountPrice: 749,
        stockQuantity: 25,
        images: [
          'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop'
        ],
        ratings: 4.0,
        numReviews: 0,
      },
      {
        name: 'Urban Comfort Slim-Fit Chinos',
        description: 'Elegant cotton-twill chinos blended with elastane for flexibility. Finished with functional slash pockets and a clean waistline for work or play.',
        category: 'Pants',
        price: 1299,
        discountPrice: 999,
        stockQuantity: 35,
        images: [
          'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800&auto=format&fit=crop'
        ],
        ratings: 4.6,
        numReviews: 1,
      },
      {
        name: 'Premium Washed Denim Jeans',
        description: 'Traditional indigo-dyed Japanese denim. Mid-rise waist, straight-leg cut, and copper hardware detailing. Designed to age beautifully with use.',
        category: 'Pants',
        price: 1599,
        discountPrice: 1299,
        stockQuantity: 45,
        images: [
          'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop'
        ],
        ratings: 4.7,
        numReviews: 2,
      },
      {
        name: 'Adventure Tech Cargo Pants',
        description: 'Reinforced ripstop cargo pants with water-repellent coating. Complete with spacious zip-secured side pockets and adjustable ankle cuffs.',
        category: 'Pants',
        price: 1499,
        discountPrice: 0,
        stockQuantity: 20,
        images: [
          'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?w=800&auto=format&fit=crop'
        ],
        ratings: 4.4,
        numReviews: 0,
      },
      {
        name: 'Essential Fleece Lounge Joggers',
        description: 'Ultra-soft fleece joggers featuring an elastic waistband and chunky drawstrings. Tapered legs with ribbed cuffs for optimal loungewear comfort.',
        category: 'Pants',
        price: 999,
        discountPrice: 799,
        stockQuantity: 60,
        images: [
          'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=800&auto=format&fit=crop'
        ],
        ratings: 4.9,
        numReviews: 1,
      },
    ];

    const seededProducts = await Product.insertMany(products);
    console.log('Starter products seeded...');

    // 5. Seed some sample reviews
    await Review.create([
      {
        product: seededProducts[0]._id,
        user: testCustomer._id,
        name: testCustomer.name,
        rating: 5,
        comment: 'Amazing shirt! The fabric feels incredibly soft and fits perfectly.',
      },
      {
        product: seededProducts[0]._id,
        user: adminUser._id,
        name: adminUser.name,
        rating: 4.6,
        comment: 'High quality print. Looks exactly like the pictures.',
      },
      {
        product: seededProducts[1]._id,
        user: testCustomer._id,
        name: testCustomer.name,
        rating: 4.2,
        comment: 'Very lightweight and perfect for hot summer days.',
      },
      {
        product: seededProducts[4]._id,
        user: testCustomer._id,
        name: testCustomer.name,
        rating: 4.6,
        comment: 'Good fit and has a bit of stretch, very comfortable.',
      },
      {
        product: seededProducts[5]._id,
        user: testCustomer._id,
        name: testCustomer.name,
        rating: 5,
        comment: 'Excellent heavy denim. Worth every rupee!',
      },
      {
        product: seededProducts[7]._id,
        user: testCustomer._id,
        name: testCustomer.name,
        rating: 5,
        comment: 'The softest joggers I have ever owned. Highly recommended.',
      },
    ]);

    console.log('Sample reviews seeded...');
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
