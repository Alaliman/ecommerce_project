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

export const getProducts = async (): Promise<products[] | null> => {
  try {
    const res = await fetch("https://fakestoreapi.com/products");

    // Check if the response is OK (status in the range 200-299)
    if (!res.ok) {
      throw new Error(`Error: ${res.status} ${res.statusText}`);
    }

    // Simulate a delay for 6 seconds
    await new Promise((resolve) => setTimeout(resolve, 6000));

    return res.json();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    // Return null if there's an error
    return null;
  }
};

export const getProduct = async (
  productId: number
): Promise<products | null> => {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${productId}`);

    // Check if the response is OK (status in the range 200-299)
    if (!res.ok) {
      throw new Error(`Error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error(`Failed to fetch product with ID ${productId}:`, error);
    // You can choose to return null, throw the error, or return a default value
    return null;
  }
};

export const getCategoryProduct = async (
  category: string
): Promise<products[] | null> => {
  try {
    const res = await fetch(
      `https://fakestoreapi.com/products/category/${category}`
    );

    // Check if the response is OK (status in the range 200-299)
    if (!res.ok) {
      throw new Error(`Error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error(
      `Failed to fetch products for category "${category}":`,
      error
    );
    // Return null or handle as per your requirement
    return null;
  }
};

export function shuffleArray(array: products[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    // Swap the elements at the current index (i) with the random index
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
}

export const getCart = async (userId: string): Promise<products[] | null> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/cart/${userId}`);
    // Check if the response is OK (status in the range 200-299)
    if (!res.ok) {
      throw new Error(`Error: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as products[];
    return data;
  } catch (err) {
    console.error(`Failed to fetch cart products for user:`, err);
    // Return null or handle as per your requirement
    return null;
  }
};

export const removeFromCart = async (
  userId: string,
  productId: number
): Promise<void> => {
  // Trim and sanitize the userId
  const sanitizedUserId = userId.trim();

  // Construct the API URL
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const res = await fetch(
    `${baseUrl}/api/cart/${encodeURIComponent(sanitizedUserId)}/remove`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    }
  );

  // Error handling
  if (!res.ok) {
    throw new Error("Failed to remove item from cart");
  }

  // No return value is necessary as the operation is complete
};

export const addToCart = async (
  userId: string,
  productId: number
): Promise<void> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/cart/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId }),
  });

  if (!res.ok) {
    throw new Error("Failed to remove item from cart");
  }
};

export const addReccommendation = async (
  userId: string,
  productCategory: string
): Promise<void> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/recommendations/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ recommendation: productCategory }),
  });

  if (!res.ok) {
    throw new Error("Failed to add item from recommendation");
  }
};

export const getReccommdations = async (
  userId: string
): Promise<products[] | null> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/recommendations/${userId}`);
    // Check if the response is OK (status in the range 200-299)
    if (!res.ok) {
      throw new Error(`Error: ${res.status} ${res.statusText}`);
    }
    const data = (await res.json()) as products[];
    return data;
  } catch (error) {
    console.error(`Failed to fetch recommended products for user:`, error);
    // Return null or handle as per your requirement
    return null;
  }
};

export const getViewedProducts = async (
  userId: String
): Promise<products[] | null> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/viewed/${userId}`);
    // Check if the response is OK (status in the range 200-299)
    if (!res.ok) {
      throw new Error(`Error: ${res.status} ${res.statusText}`);
    }
    const data = (await res.json()) as products[];
    return data;
  } catch (error) {
    console.error(`Failed to fetch products for user:`, error);
    // Return null or handle as per your requirement
    return null;
  }
};

export const addViewedProduct = async (
  userId: String,
  productId: number
): Promise<void> => {
  console.log("i am here", productId);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/viewed/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId: productId }),
  });

  if (!res.ok) {
    throw new Error("Failed to add item to viewed");
  }
};
