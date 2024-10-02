import { getProduct } from "@/lib/helper";
import { db } from "@/lib/prismadb";
import { error } from "console";
import { NextResponse } from "next/server";
type products = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        cart: true,
      },
    });
    if (!user) {
      return new Response("User not found", { status: 404 });
    }
    console.log(user.cart);
    const cart = await Promise.all(
      user.cart.map(async (item: number): Promise<products> => {
        const data = await getProduct(item);

        if (!data) {
          //throw erroe to the catch
          throw new Error("Error form getProduct");
        }

        return data;
      })
    );

    console.log(cart);
    return NextResponse.json(cart);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching cart" });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  const { productId } = await req.json();
  const id = productId * 1;

  try {
    const user = await db.user.update({
      where: { id: userId },
      data: {
        cart: { push: id as number }, // Append productId to cart array
      },
    });

    return NextResponse.json(user.cart, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error adding to cart" },
      { status: 500 }
    );
  }
}
