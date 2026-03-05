const prisma = require('../connections/prisma-client');
require('dotenv').config();

const getRandomRegularUser = async () => {
  const regularUsers = await prisma.user.findMany({ where: { role: 'USER' } });
  return regularUsers[Math.floor(Math.random() * regularUsers.length)];
};

const getRandomStaffUser = async () => {
  const staffUsers = await prisma.user.findMany({ where: { role: 'STAFF' } });
  return staffUsers[Math.floor(Math.random() * staffUsers.length)];
};

const getRandomAnimal = async () => {
  const animals = await prisma.animal.findMany({});
  return animals[Math.floor(Math.random() * animals.length)];
};

const getRandomAnimalAssignment = async () => {
  const assignments = await prisma.animalAssignment.findMany({});
  return assignments[Math.floor(Math.random() * assignments.length)];
};

const getRandomAnimalModification = async () => {
  const modifications = await prisma.animalModification.findMany({});
  return modifications[Math.floor(Math.random() * modifications.length)];
};

const getRandomInventory = async () => {
  const inventories = await prisma.inventory.findMany({});
  return inventories[Math.floor(Math.random() * inventories.length)];
};

const getRandomInventoryTransaction = async () => {
  const transactions = await prisma.inventoryTransaction.findMany({});
  return transactions[Math.floor(Math.random() * transactions.length)];
};

const getRandomItem = async () => {
  const items = await prisma.item.findMany({});
  return items[Math.floor(Math.random() * items.length)];
};

const getRandomCrate = async () => {
  const crates = await prisma.crate.findMany({});
  return crates[Math.floor(Math.random() * crates.length)];
};

const getRandomFood = async () => {
  const foods = await prisma.food.findMany({});
  return foods[Math.floor(Math.random() * foods.length)];
};

const getRandomMedication = async () => {
  const meds = await prisma.medication.findMany({});
  return meds[Math.floor(Math.random() * meds.length)];
};

const getRandomMedicalLog = async () => {
  const logs = await prisma.medicalLog.findMany({});
  return logs[Math.floor(Math.random() * logs.length)];
};

const getStaffUserToken = async () => {
  const response = await fetch(
    `https://tswvbykazoodrrqzfghs.supabase.co/auth/v1/token?grant_type=password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ email: 'staff@user.com', password: 'staffpassword' }),
    },
  );
  const data = await response.json();
  return data.access_token;
};

const getRegularUserToken = async () => {
  const response = await fetch(
    `https://tswvbykazoodrrqzfghs.supabase.co/auth/v1/token?grant_type=password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ email: 'regular@user.com', password: 'regularpassword' }),
    },
  );
  const data = await response.json();
  return data.access_token;
};

const runTests = async () => {
  try {
    const STAFF_TOKEN = await getStaffUserToken();
    const USER_TOKEN = await getRegularUserToken();
    const staffUser = await getRandomStaffUser();
    const regularUser = await getRandomRegularUser();
    const inventory = await prisma.inventory.findFirst({
      where: {
        inventory_transactions: { some: {} },
      },
      include: {
        inventory_transactions: { take: 1 },
      },
    });
    const transaction = inventory.inventory_transactions[0];
    const item = await getRandomItem();
    const animal = await getRandomAnimal();
    const PATH = `inventory/${inventory.id}`;
    const METHOD = 'PATCH';

    const response = await fetch(`http://localhost:8080/api/${PATH}`, {
      method: METHOD,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STAFF_TOKEN}`,
      },
      body: JSON.stringify({
        quantity: 47835623,
        expiration_date: '2026-12-30',
        item_id: item.id,
        foster_user: regularUser.id,
        type: 'INTAKE',
        status: 'COMPLETE',
        notes: 'transaction complete, paid in full',
        transaction_id: transaction.id,
      }),
    });
    const data = await response.json();
    console.log({ data });
  } catch (error) {
    console.log({ error });
  }
};

runTests();
