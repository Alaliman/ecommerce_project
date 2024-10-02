// app/api/user/[id]/addRecommendation/route.ts
import { getCategoryProduct, getProducts, shuffleArray } from "@/lib/helper";
import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET request handler for fetching user recommendations
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { recommendations: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(user);

    if (user.recommendations.length === 0) {
      // If the user has no recommendations, fetch some from the database
      const products = await getProducts();

      // throw err if product is null
      if (!products) {
        return NextResponse.json(
          { error: "No products found" },
          { status: 404 }
        );
      }
      // shuffle the products
      const shuffledProducts = shuffleArray(products);
      // select four at randon from the shuffled array and assign to updatedRecommendations
      const updatedRecommendations = shuffledProducts.slice(0, 4);

      return NextResponse.json(updatedRecommendations, { status: 200 });
    }

    const recommendations = await Promise.all(
      user.recommendations.map(async (category: string) => {
        const rec = await getCategoryProduct(category);
        //throw error if rec is null
        if (!rec) {
          // throw the error to the catch block
          throw new Error("Error fetching the Products");
        }
        const arr = shuffleArray(rec);
        const onlyTwo = arr.slice(0, 2);
        return onlyTwo;
      })
    );

    console.log(recommendations.length);

    if (recommendations.length === 1) {
      const [first] = recommendations;

      const updatedRecommendations = [...first];

      return NextResponse.json(updatedRecommendations, { status: 200 });
    }

    if (recommendations.length > 1) {
      const [first, second] = recommendations;

      const updatedRecommendations = [...first, ...second];

      return NextResponse.json(updatedRecommendations, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error retrieving recommendations" },
      { status: 500 }
    );
  }
}

// POST request handler for adding a recommendation
export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  const { recommendation } = (await req.json()) as { recommendation: string };

  try {
    // Fetch the current recommendations for the user
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { recommendations: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check the length of the recommendations array
    let updatedRecommendations = user.recommendations;

    if (updatedRecommendations.length >= 2) {
      // If length is 2 or more, remove the last recommendation (FIFO)
      updatedRecommendations.shift();
    }

    // Add the new recommendation
    updatedRecommendations.push(recommendation);

    // Update the user's recommendations with the new array
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { recommendations: updatedRecommendations },
    });

    // Return the updated recommendations in the response
    return NextResponse.json(updatedUser.recommendations, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error adding recommendation" },
      { status: 500 }
    );
  }
}
