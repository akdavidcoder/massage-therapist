// Use require for CommonJS compatibility
require('dotenv').config({ path: './.env' }); // Make sure this path is correct relative to where you run the script

const clientPromise = require("../lib/mongodb").default // Access the default export
const bcrypt = require("bcryptjs") // Use require for bcryptjs as well

async function seedServices() {
  try {
    const client = await clientPromise
    const db = client.db("massage_therapy")

    // Check if services already exist
    const existingServices = await db.collection("services").countDocuments()
    if (existingServices > 0) {
      console.log("Services already exist, skipping service seed...")
    } else {
      const services = [
        {
          name: "Swedish Massage",
          description:
            "A gentle, relaxing massage using long strokes, kneading, and circular movements on topmost layers of muscles. Perfect for stress relief and overall relaxation.",
          benefits: [
            "Reduces stress and promotes relaxation",
            "Improves blood circulation",
            "Relieves muscle tension and stiffness",
            "Enhances flexibility and range of motion",
            "Boosts immune system function",
          ],
          duration: [30, 60, 90],
          prices: { 30: 80, 60: 120, 90: 180 },
          image: "/placeholder.svg?height=400&width=600",
          available: true,
          createdAt: new Date(),
        },
        {
          name: "Deep Tissue Massage",
          description:
            "A therapeutic massage technique that focuses on deeper layers of muscle tissue. Uses slow strokes and deep finger pressure to release chronic patterns of tension.",
          benefits: [
            "Relieves chronic muscle pain",
            "Reduces inflammation and swelling",
            "Breaks up scar tissue",
            "Rehabilitates injured muscles",
            "Improves posture and alignment",
          ],
          duration: [60, 90],
          prices: { 60: 140, 90: 200 },
          image: "/placeholder.svg?height=400&width=600",
          available: true,
          createdAt: new Date(),
        },
        {
          name: "Aromatherapy Massage",
          description:
            "Combines the therapeutic power of massage with the healing properties of essential oils. The oils are chosen specifically for your needs and applied during massage.",
          benefits: [
            "Reduces anxiety and stress",
            "Improves mood and emotional well-being",
            "Enhances relaxation response",
            "Supports better sleep quality",
            "Balances mind, body, and spirit",
          ],
          duration: [60, 90],
          prices: { 60: 150, 90: 220 },
          image: "/placeholder.svg?height=400&width=600",
          available: true,
          createdAt: new Date(),
        },
        {
          name: "Reflexology",
          description:
            "Based on the principle that there are reflexes in hands and feet corresponding to every part of the body. Pressure applied to these reflexes promotes healing.",
          benefits: [
            "Promotes deep relaxation",
            "Improves circulation",
            "Reduces pain and discomfort",
            "Enhances overall well-being",
            "Supports natural healing processes",
          ],
          duration: [45, 60],
          prices: { 45: 100, 60: 130 },
          image: "/placeholder.svg?height=400&width=600",
          available: true,
          createdAt: new Date(),
        },
        {
          name: "Hot Stone Massage",
          description:
            "Uses smooth, heated stones placed on specific points of the body. The heat helps relax muscles and allows for deeper pressure during massage.",
          benefits: [
            "Deeply relaxes muscles",
            "Improves blood flow",
            "Reduces stress and anxiety",
            "Relieves pain and tension",
            "Promotes better sleep",
          ],
          duration: [75, 90],
          prices: { 75: 160, 90: 200 },
          image: "/placeholder.svg?height=400&width=600",
          available: true,
          createdAt: new Date(),
        },
        {
          name: "Prenatal Massage",
          description:
            "Specially designed for expectant mothers, using techniques and positioning that ensure safety and comfort during pregnancy.",
          benefits: [
            "Reduces pregnancy-related discomfort",
            "Improves sleep quality",
            "Reduces swelling in hands and feet",
            "Relieves stress on weight-bearing joints",
            "Enhances overall well-being during pregnancy",
          ],
          duration: [60, 90],
          prices: { 60: 130, 90: 190 },
          image: "/placeholder.svg?height=400&width=600",
          available: true,
          createdAt: new Date(),
        },
      ]

      const result = await db.collection("services").insertMany(services)
      console.log(`Successfully seeded ${result.insertedCount} services`)
    }

    // Also create an admin user if it doesn't exist
    const adminExists = await db.collection("admins").countDocuments()
    if (adminExists === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10)

      await db.collection("admins").insertOne({
        email: "admin@massagetherapy.com",
        password: hashedPassword,
        name: "Sophia Admin",
        createdAt: new Date(),
      })
      console.log("Admin user created: admin@massagetherapy.com / admin123")
    } else {
      console.log("Admin user already exists, skipping admin seed...")
    }
  } catch (error) {
    console.error("Error seeding data:", error)
  } finally {
    // It's good practice to close the connection if this script is run standalone
    // However, if it's part of a larger process, you might manage connections differently.
    // For a simple seed script, you might not need to explicitly close if the process exits.
  }
}

seedServices()
