// app/api/user/[id]/removeFromCart/route.ts
import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// POST request handler for removing a product from the cart
export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  const { productId } = await req.json();

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { cart: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Filter out the product to remove it from the cart
    const updatedCart = user.cart.filter((id) => id !== productId);

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { cart: updatedCart },
    });

    return NextResponse.json(updatedUser.cart, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error removing product from cart" },
      { status: 500 }
    );
  }
}
