const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./src/config/database.js');
const seedAdmin = require('./src/seed/adminSeed.js');
const app = require('./app.js');

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    await seedAdmin(); // ensures ADMIN seeded
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
};

start();
