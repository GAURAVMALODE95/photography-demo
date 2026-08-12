# Photography Studio Site (React + Vite)

## Run

```bash
cd /Users/gaurav/test
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Scripts

| Command | What it does |
|---------|----------------|
| `npm run dev` | Local React dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build |

## Structure

```
public/
  media/scrub.mp4 (+ mobile)   hero scroll video
  media/posters/01.jpg         hero poster
  images/                      gallery photos by category
src/
  components/                  UI sections
  data/site.js                 studio info, gallery, pricing
  data/content.jsx             hero chapter copy
  pages/                       Home, All Photos, All Videos
```

## Edit copy / prices / gallery

`src/data/site.js` and `src/data/content.jsx`
