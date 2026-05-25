# ANSWERS.md

## 1. How to Run

1. Clone the repository

```bash
git clone <your-repo-url>
```

2. Open the project folder

```bash
cd habit-tracker
```

3. Open `index.html` in the browser.

No installation or dependencies are required.

---

## 2. Stack & Design Choices

I used Vanilla HTML, CSS, and JavaScript because the project requirements were small enough that a framework was not necessary. This helped keep the project lightweight and easy to run.

### Design Decision 1

I used a table layout for the weekly habit grid because habit tracking data is naturally tabular. It makes the relationship between habits and days easier to scan visually.

### Design Decision 2

I highlighted the current day column to help users quickly understand where they are in the current week. This improves usability and reduces confusion when tracking habits.

---

## 3. Responsive & Accessibility

The application works on both mobile and desktop screens.

On smaller screens:

- The form layout stacks vertically
- The navigation buttons stack vertically
- The table supports horizontal scrolling

Accessibility considerations:

- Buttons use clear labels
- Inputs are keyboard accessible
- Contrast between text and background was kept readable

One thing I did not fully implement was advanced screen reader support with ARIA labels because I prioritized core functionality first.

---

## 4. AI Usage

I used AI to:

- Discuss application architecture
- Improve streak calculation logic
- Refactor rendering logic
- Improve responsive styling
- Improve week navigation logic

One specific thing I changed from AI output:
The original suggestion stored only weekday names like "Mon" and "Tue". I changed the structure to store real ISO date strings like "2026-05-25" because it made streak calculation and week navigation more reliable.

---

## 5. Honest Gap

One thing that could still be improved is the overall UI polish and accessibility support.

Given more time, I would:

- Add better keyboard focus states
- Improve animations and transitions
- Add ARIA labels
- Improve mobile table interaction
- Add habit statistics and analytics
