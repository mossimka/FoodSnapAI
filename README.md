# FoodSnapAI

FoodSnapAI is a modern web application that allows users to upload photos of dishes, discover new recipes, and share their culinary creations with a vibrant community. The project leverages React, Next.js, and a stylish, responsive UI to deliver a seamless food discovery and sharing experience.

---

## Features

- **Image Upload:** Effortlessly upload dish photos with drag-and-drop or file selection.
- **Recipe Discovery:** Browse and explore a variety of recipes from around the world.
- **Social Integration:** Connect with FoodSnapAI on Instagram, Twitter, TikTok, and LinkedIn.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.
- **Modern UI:** Smooth animations and a clean, user-friendly interface.
- **Newsletter Subscription:** Stay updated with the latest recipes and cooking tips (coming soon).

---

## Tech Stack

- **Frontend:** React, Next.js, TypeScript
- **Styling:** CSS Modules
- **Icons:** Lucide, React Icons
- **Image Handling:** next/image
- **Backend:** FastAPI, Google Cloud Storage
- **AI:** Gemini Multi Agent System

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/foodsnapai.git
   cd foodsnapai
   ```

2. **Install dependencies for frontend:**
   ```bash
   cd frontend
   npm install
   # or
   yarn install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## Backend

The backend is responsible for handling image uploads, recipe data, and user interactions.  
Stack: FastAPI

### Example Features

- **Image Upload API:** Receives and stores user-uploaded dish images.
- **Recipe API:** CRUD operations for recipes.
- **User Management:** (Optional) Authentication and user profiles.
- **Integration:** The frontend communicates with the backend via RESTful API endpoints.

### Running the Backend

1. Go to the backend directory:
   ```bash
   cd back
   ```

2. Install dependencies into your venv:
   ```bash
   pip install requirements/dev.txt
   ```

3. Start the backend server:
   ```bash
   uvicorn src.main:app --host 0.0.0.0 --port 8000
   ```

4. The backend will run on [http://localhost:8000](http://localhost:8000) (or your configured port).


---

## Customization

- **Colors & Theme:** Edit CSS variables in your global styles or module CSS files.
- **Social Links:** Update URLs in `Footer.tsx` to point to your own social profiles.
- **Images:** Place your logo and other images in `public/images/` and update imports as needed.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)

---

## Contact

- [Instagram](https://www.instagram.com/foodsnap_ai/)
- [Twitter](https://x.com/FoodSnapAI)
- [LinkedIn](https://www.linkedin.com/in/maxim-sarsekeyev-a133ba354/)

---
