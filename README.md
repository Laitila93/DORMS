# DORMS Water Consumption Dashboard

A Vue 3 web application for visualizing and tracking water consumption statistics, including XP progress, feedback, and unlockable items.
Part of a bachebachelor's project with the report available at: https://www.diva-portal.org/smash/record.jsf?pid=diva2:1964288

## Features

- View water consumption stats (hourly, daily, weekly, monthly)
- Interactive graphs and progress bars
- XP and feedback tracking
- Unlockable items (fish, hats, etc.)
- Responsive design

## Tech Stack

- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Chart.js](https://www.chartjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/dorms-dashboard.git
   cd dorms-dashboard
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Run the development server:**
   ```sh
   npm run dev
   ```

4. **Build for production:**
   ```sh
   npm run build
   ```

## Usage

- Select a time range (hourly, daily, weekly, monthly) to view stats.
- View XP progress and feedback bars.
- Unlock new items as you gain XP.

## Folder Structure

- `src/views/StatsView.vue` — Main statistics dashboard
- `src/components/ProgressBarComponent.vue` — XP and feedback progress bars
- `src/components/NavComponent.vue` — Navigation menu
- `src/views/TankView.vue` — Main view

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

For questions or feedback, please contact [joakim.kilbo@gmail.com](mailto:joakim.kilbo@gmail.com).
