import { ID, Models } from "react-native-appwrite";
import { databases, config } from "./appwrite";
import {
  agentImages,
  galleryImages,
  propertiesImages,
  reviewImages,
} from "./data";
import { faker } from "@faker-js/faker";

const COLLECTIONS = {
  AGENT: config.agentsCollectionId,
  REVIEWS: config.reviewsCollectionId,
  GALLERY: config.galleriesCollectionId,
  PROPERTY: config.propertiesCollectionId,
};

const propertyTypes = [
  "House",
  "TownHouse",
  "Condo",
  "Duplex",
  "Studio",
  "Villa",
  "Apartment",
  "Other",
];

const facilities = [
  "Laundry",
  "Parking",
  "Gym",
  "Swimming-pool",
  "WIFI",
  "Pet-Friendly",
];

function getRandomSubset<T>(
  array: T[],
  minItems: number,
  maxItems: number
): T[] {
  const subsetSize =
    Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;
  return [...array].sort(() => 0.5 - Math.random()).slice(0, subsetSize);
}

async function seed() {
  try {
    // Clear existing data
    for (const key in COLLECTIONS) {
      const collectionId = COLLECTIONS[key as keyof typeof COLLECTIONS];
      const documents = await databases.listDocuments(
        config.databaseId!,
        collectionId!
      );
      for (const doc of documents.documents) {
        await databases.deleteDocument(
          config.databaseId!,
          collectionId!,
          doc.$id
        );
      }
    }

    console.log("Cleared all existing data.");

    // Seed Agents
    const agents = [];
    for (let i = 0; i < 5; i++) {
      const agent = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.AGENT!,
        ID.unique(),
        {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          avatar: agentImages[Math.floor(Math.random() * agentImages.length)],
        }
      );
      agents.push(agent);
    }
    console.log(`Seeded ${agents.length} agents.`);

    // Seed Reviews
    const reviews = [];
    for (let i = 0; i < 20; i++) {
      const review = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.REVIEWS!,
        ID.unique(),
        {
          name: faker.person.fullName(),
          avatar: reviewImages[Math.floor(Math.random() * reviewImages.length)],
          review: faker.lorem.paragraph(),
          rating: faker.number.int({ min: 1, max: 5 }),
        }
      );
      reviews.push(review);
    }
    console.log(`Seeded ${reviews.length} reviews.`);

    // Seed Galleries
    const galleries: Models.Document[] = [];
    galleryImages.forEach(async (image) => {
      const gallery = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.GALLERY!,
        ID.unique(),
        { image }
      );
      galleries.push(gallery);
    });
    console.log(`Seeded ${galleries.length} galleries.`);

    // Seed Properties
    for (let i = 0; i < 20; i++) {
      const assignedAgent = faker.helpers.arrayElement(agents);
      const assignedReviews = getRandomSubset(reviews, 3, 5);
      const assignedGalleries = getRandomSubset(galleries, 3, 6);

      const property = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.PROPERTY!,
        ID.unique(),
        {
          name: `${faker.location.street()} ${faker.helpers.arrayElement(
            propertyTypes
          )}`,
          type: faker.helpers.arrayElement(propertyTypes),
          description: faker.lorem.paragraph(),
          address: `${faker.location.streetAddress()}, ${faker.location.city()}`,
          geolocation: `${faker.location.latitude()}, ${faker.location.longitude()}`,
          price: Math.floor(Math.random() * 9000) + 1000,
          area: faker.number.int({ min: 500, max: 3000 }),
          bedrooms: faker.number.int({ min: 1, max: 5 }),
          bathrooms: faker.number.int({ min: 1, max: 4 }),
          rating: faker.number.int({ min: 1, max: 5 }),
          facilities: getRandomSubset(facilities, 3, 6),
          image: faker.helpers.arrayElement(propertiesImages),
          agent: assignedAgent.$id,
          reviews: assignedReviews.map((review) => review.$id),
          gallery: assignedGalleries.map((gallery) => gallery.$id),
        }
      );
      console.log(`Seeded property: ${property.name}`);
    }

    console.log("Data seeding completed.");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

export default seed;
