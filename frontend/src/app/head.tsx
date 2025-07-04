// app/head.tsx

export default function Head() {
  return (
    <>
      <title>FoodSnap AI</title>
      <meta name="description" content="AI-powered app to recognize food and generate recipes." />

      <meta property="og:title" content="FoodSnap AI" />
      <meta property="og:description" content="AI-powered app to recognize food and generate recipes." />
      <meta property="og:image" content="https://foodsnapai.food/og-image.jpg" />
      <meta property="og:url" content="https://foodsnapai.food/" />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="FoodSnap AI" />
      <meta name="twitter:description" content="AI-powered app to recognize food and generate recipes." />
      <meta name="twitter:image" content="https://foodsnapai.food/og-image.jpg" />

      <link rel="icon" href="/favicon.ico" />
    </>
  );
}
