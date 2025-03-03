# Dota 2 Ward Tracker

A web application that visualizes ward placement patterns in Dota 2 matches. This tool helps players analyze warding habits and identify common ward spots by creating a heatmap overlay on the Dota 2 minimap.

## Features

- Visualize Observer and Sentry ward placements on the Dota 2 minimap
- Toggle between Observer and Sentry ward displays
- Color-coded visualization (Yellow for Observers, Blue for Sentries)
- Intensity-based heatmap showing frequency of ward placements
- Numerical indicators for heavily warded spots
- Filter by number of games
- Filter by team (Radiant/Dire)

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Nicolas-Zink/dota-ward-tracker.git
cd dota-ward-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Add a Dota 2 minimap image:
- Get a Dota 2 minimap image (400x400 pixels)
- Save it as `minimap.jpg` in the `public` folder

4. Start the development server:
```bash
npm run dev
```

## Usage

1. Enter a Dota 2 Account ID
2. Set the number of games to analyze
3. Select team filter (optional)
4. Click "Generate Heatmap"
5. Use the checkboxes to toggle between Observer and Sentry ward displays

## Technologies Used

- React
- Vite
- Tailwind CSS
- OpenDota API
- HTML Canvas

## API Reference

This project uses the [OpenDota API](https://docs.opendota.com/) to fetch ward placement data. Specifically, it uses the following endpoint:

```
GET /players/{account_id}/wardmap
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)

## Acknowledgments

- Data provided by OpenDota API
- Inspired by the Dota 2 community's need for warding analysis tools