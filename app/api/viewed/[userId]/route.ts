import { getProduct } from "@/lib/helper";
import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET request handler for fetching viewed products
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { views: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const viewed = await Promise.all(
      user.views.map(async (item) => {
        return await getProduct(item);
      })
    );

    console.log(viewed);

    return NextResponse.json(viewed, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error retrieving viewed products" },
      { status: 500 }
    );
  }
}

// POST request handler for adding a viewed product
export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  const { productId } = (await req.json()) as { productId: number };

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.views.includes(productId as number)) {
      return NextResponse.json(
        { error: "Product already viewed" },
        { status: 400 }
      );
    }
    // Add the product to the user's viewed products array
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        views: { push: productId as number },
      },
    });

    console.log(updatedUser);

    return NextResponse.json(updatedUser.views, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error adding viewed product" },
      { status: 500 }
    );
  }
}
