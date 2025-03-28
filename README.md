# Kimji TransformWeek

A Kimji-powered habit-tracking and mindfulness app focused on executing a structured 21-day self-improvement plan, with nudges, progress analytics, and extensibility.

## Features

### Daily Task Management
- Structured 21-day program with daily tasks
- Interactive task checklist system
- Expandable task cards with details and tracking
- Automatic or manual day progression

### Trackers & Logging
- Hydration tracking (water intake)
- Workout duration tracking
- Expense monitoring
- Gratitude journaling
- Emotion/mood tracking

### Progress Analytics
- Visual progress summaries
- Completion statistics
- Habit streaks
- Week-in-review insights

### Reflection Tools
- Daily self-reflection journaling
- Gratitude exercises
- Insights capture

### Customization
- Profile settings
- Notification preferences
- Dark/light mode
- Data export

## Getting Started

### Prerequisites
- Node.js 14.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/transform-week.git
cd transform-week
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will be available at http://localhost:3000.

## Project Structure

```
transform-week/
├── public/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── trackers/     # Task-specific trackers
│   ├── context/          # Global state management
│   ├── pages/            # Main application pages
│   ├── utils/            # Helper functions
│   ├── App.js            # Main application component
│   └── index.js          # Application entry point
└── package.json
```

## Extending the App

### Adding New Task Types
1. Define the task type in the weekly template in `context/AppContext.js`
2. Create a new tracker component in `components/trackers/`
3. Add the tracker to the `renderTracker` function in `TaskCard.js`

### Adding New Days
1. Modify the week template array in `context/AppContext.js`
2. Update the day selector in `components/DaySelector.js`

## Technologies Used

- React
- React Router
- Styled Components
- LocalForage (for data persistence)
- React Icons

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Icons provided by [React Icons](https://react-icons.github.io/react-icons/)
- Inspiration from various habit tracking and mindfulness apps
- Developed by Kimji

## Development Tools

### Automatic PR Description Generator
This project uses an automatic PR description generator to create consistent and informative pull request descriptions.

#### Features
- Automatically runs when you create a PR to the main branch
- Categorizes changes based on commit types (features, fixes, etc.)
- Creates a structured description with links to commits
- Works with conventional commit format

#### How It Works
- When you submit a PR to the main branch, a GitHub workflow automatically runs
- The workflow analyzes your commits and generates a formatted description
- The description is automatically applied to your PR

No manual action is required - the PR description is generated for you!
