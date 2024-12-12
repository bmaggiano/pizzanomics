import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Pizzanomics";
  const description = "Add a little pizza to your life!";

  const pizzaImageUrl = "https://pizzanomics.vercel.app/pizzaClipart.png";
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <div
            style={{ display: "flex", fontSize: "80px", marginRight: "20px" }}
          >
            <img
              tw="flex h-35 w-35 mr-4"
              src={pizzaImageUrl}
              alt="Pizza emoji"
            />
          </div>
          <div tw="flex flex-col">
            <h1
              style={{
                fontSize: "120px",
                fontWeight: "bold",
                color: "black",
                margin: "0",
              }}
            >
              {title}
            </h1>
          </div>
        </div>
        <p
          style={{
            fontSize: "60px",
            textAlign: "center",
            maxWidth: "800px",
            color: "gray",
          }}
        >
          {description}
        </p>
        <p>Powered by Vercel and Brandon Maggiano</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
