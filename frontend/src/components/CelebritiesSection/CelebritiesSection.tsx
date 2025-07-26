import React from 'react';

const celebritiesData = [
  {
    "image": "https://example.com/image1.jpg",
    "name": "Celebrity One",
    "description": "Favorite meal: Spaghetti Carbonara"
  },
  {
    "image": "https://example.com/image2.jpg",
    "name": "Celebrity Two",
    "description": "Favorite meal: Sushi"
  },
  {
    "image": "https://example.com/image3.jpg",
    "name": "Celebrity Three",
    "description": "Favorite meal: Tacos"
  }
];

const CelebritiesSection = () => {
  return (
    <div>
      <h2>Celebrities Meal</h2>
      <p>Discover the favorite meals of your favorite celebrities!</p>
      <div>
        {celebritiesData.map((celebrity: { image: string; name: string; description: string }, index: number) => (
          <div key={index}>
            <Image src={celebrity.image} alt={celebrity.name} />
            <h3>{celebrity.name}</h3>
            <p>{celebrity.description}</p>
          </div>
        ))} 
      </div>
    </div>
  )
}

export default CelebritiesSection