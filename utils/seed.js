const connection = require('../config/connection');
const { Users, Thoughts } = require('../models');
const { getRandomName, getRandomAssignments } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');
    // Delete the collections if they exist
    let UsersCheck = await connection.db.listCollections({ name: 'Users' }).toArray();
    if (UsersCheck.length) {
      await connection.dropCollection('Users');
    }

    let ThoughtsCheck = await connection.db.listCollections({ name: 'Thoughts' }).toArray();
    if (ThoughtsCheck.length) {
      await connection.dropCollection('Thoughts');
    }
  // Create empty array to hold the Thoughts
  const Thoughts = [];

  // Loop 20 times -- add Thoughts to the Thoughts array
  for (let i = 0; i < 20; i++) {
    // Get some random assignment objects using a helper function that we imported from ./data
    const assignments = getRandomAssignments(20);

    const fullName = getRandomName();
    const first = fullName.split(' ')[0];
    const last = fullName.split(' ')[1];
    const github = `${first}${Math.floor(Math.random() * (99 - 18 + 1) + 18)}`;

    Thoughts.push({
      first,
      last,
      github,
      assignments,
    });
  }

  // Add Thoughts to the collection and await the results
  await Thoughts.collection.insertMany(Thoughts);

  // Add Users to the collection and await the results
  await Users.collection.insertOne({
    UserName: 'UCLA',
    inPerson: false,
    Thoughts: [...Thoughts],
  });

  // Log out the seed data to indicate what should appear in the database
  console.table(Thoughts);
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
