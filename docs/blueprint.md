# **App Name**: AniStream

## Core Features:

- Home Page Display: Implement a home page with trending, recent, top airing, popular, favorites, newly added, and a “Continue Watching” row (based on local storage or user profile).
- Anime Details Page: Show anime details with poster, description, genres, rating, and episode list with 'Watch Now' button.
- Watch Page: Stream anime episodes with next/previous episode navigation and recommended anime.
- Search Functionality: Allow searching anime via Zoro provider's search. Add debounced live search suggestions (show titles while typing). Option to filter search results by type (TV, Movie, OVA, etc.).
- Genre Pages: Implement pages listing genres as clickable options. Add multi-genre filter (e.g., Action + Romance).
- Category Pages: Create pages for movies, TV shows, OVAs, ONAs, specials, and completed anime.
- Personalized Anime Lists: Manage a 'My List' page for users to organize anime in Watch Later, Watching, Completed, and Dropped categories. Add custom lists (e.g., “Favorite Romance” or “Rewatch List”). Add progress tracking (episode count synced per anime).
- AI Recommendations: Use AI to provide recommendations based on user viewing history and preferences. This tool determines if there is enough information to make the recommendation.

## Style Guidelines:

- Primary Background: #0B0C10
- Secondary Background: #1F2833
- Primary Text: #FFFFFF
- Secondary Text: #C5C6C7
- Accent Main – Buttons/Highlights: #E50914
- Accent Hover/Alternative: #FF8C00
- Success/Completed: #21E6C1
- Active/Tab Highlight: #45A29E
- Font: 'Inter' is perfect. Maybe pair with “Outfit” or “Poppins” for headings to create hierarchy.
- Card-based anime grid layout with hover effects and skeleton loaders. Make grids responsive with masonry or flexible rows for better use of space.
- Smooth transitions and animations for navigation and UI elements. Use Framer Motion for smooth page transitions & modal popups. Add subtle hover tilt effect on anime cards.
- Minimalist, consistent icons (Lucide is fine). Add custom anime-themed icons for fun (katana for “watching”, star for “favorite”).