const habit_add_btn = document.getElementById("add-habit-btn");

const habit_input = document.getElementById("habit-input");

const habit_grid = document.getElementById("habit-grid");

const empty_state = document.getElementById("empty-state");

const prev_week_btn = document.getElementById("prev-week-btn");

const next_week_btn = document.getElementById("next-week-btn");

let habits = [];

let currentWeekOffset = 0;

// Save data to local storage
function saveDataToLocalStorage() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

// Get data from local storage
function getDataFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem("habits"));

  return data || [];
}

// Generate current week dates
function getRealDateTime() {
  const dates = [];

  const today = new Date();

  const currentDay = today.getDay();

  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

  const monday = new Date(today);

  monday.setDate(today.getDate() + mondayOffset + currentWeekOffset * 7);

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);

    date.setDate(monday.getDate() + i);

    dates.push({
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),

      fullDate: date.toISOString().split("T")[0],
    });
  }

  return dates;
}

// Calculate streak
function getStreak(completedDates) {
  if (completedDates.length === 0) {
    return 0;
  }

  let streak = 0;

  const sortedDates = [...completedDates].sort();

  let currentDate = new Date();

  while (true) {
    const formattedDate = currentDate.toISOString().split("T")[0];

    if (sortedDates.includes(formattedDate)) {
      streak++;

      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

// Render habits
function renderHabits() {
  habit_grid.innerHTML = "";

  const weekDays = getRealDateTime();

  const todayDate = new Date().toISOString().split("T")[0];

  // Show empty state
  if (habits.length > 0) {
    empty_state.style.display = "none";
  } else {
    empty_state.style.display = "block";
  }

  // Create table
  const table = document.createElement("table");

  const thead = document.createElement("thead");

  const headerRow = document.createElement("tr");

  // Habit heading
  const habitHeading = document.createElement("th");

  habitHeading.textContent = "Habits";

  headerRow.appendChild(habitHeading);

  // Render days heading
  weekDays.forEach((day) => {
    const th = document.createElement("th");

    th.innerHTML = `
      ${day.day}
      <br>
      ${day.fullDate.slice(8)}
    `;

    // Highlight current day
    if (day.fullDate === todayDate) {
      th.classList.add("today-header");
    }

    headerRow.appendChild(th);
  });

  // Streak heading
  const streakHeading = document.createElement("th");

  streakHeading.textContent = "Streak";

  headerRow.appendChild(streakHeading);

  // Action heading
  const actionHeading = document.createElement("th");

  actionHeading.textContent = "Action";

  headerRow.appendChild(actionHeading);

  thead.appendChild(headerRow);

  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement("tbody");

  // Render habits
  habits.forEach((habit, index) => {
    const row = document.createElement("tr");

    // Habit name cell
    const habitNameCell = document.createElement("td");

    habitNameCell.textContent = habit.name;

    row.appendChild(habitNameCell);

    // Render checkboxes
    weekDays.forEach((day) => {
      const td = document.createElement("td");

      // Highlight current day
      if (day.fullDate === todayDate) {
        td.classList.add("today-column");
      }

      const input = document.createElement("input");

      input.type = "checkbox";

      // Restore checked state
      input.checked = habit.completedValue.includes(day.fullDate);

      // Toggle checkbox
      input.addEventListener("change", () => {
        if (input.checked && !habit.completedValue.includes(day.fullDate)) {
          habit.completedValue.push(day.fullDate);
        } else {
          habit.completedValue = habit.completedValue.filter(
            (value) => value !== day.fullDate,
          );
        }

        saveDataToLocalStorage();

        renderHabits();
      });

      td.appendChild(input);

      row.appendChild(td);
    });

    // Render streak
    const streakCell = document.createElement("td");

    const streak = getStreak(habit.completedValue);

    streakCell.textContent = `${streak} Days`;

    row.appendChild(streakCell);

    // Create action cell
    const actionCell = document.createElement("td");

    // Edit button
    const editBtn = document.createElement("button");

    editBtn.textContent = "Edit";

    editBtn.classList.add("edit-btn");

    // Edit habit
    editBtn.addEventListener("click", () => {
      const updatedHabit = prompt("Edit habit name", habit.name);

      if (!updatedHabit || updatedHabit.trim() === "") {
        return;
      }

      const isAlreadyExist = habits.some(
        (h, i) =>
          h.name.toLowerCase() === updatedHabit.toLowerCase() && i !== index,
      );

      if (isAlreadyExist) {
        return alert("Habit already exists");
      }

      habit.name = updatedHabit;

      saveDataToLocalStorage();

      renderHabits();
    });

    // Delete button
    const deleteBtn = document.createElement("button");

    deleteBtn.textContent = "Delete";

    deleteBtn.classList.add("delete-btn");

    // Delete habit
    deleteBtn.addEventListener("click", () => {
      const confirmDelete = confirm(
        "Are you sure you want to delete this habit?",
      );

      if (!confirmDelete) {
        return;
      }

      habits = habits.filter((_, i) => i !== index);

      saveDataToLocalStorage();

      renderHabits();
    });

    actionCell.appendChild(editBtn);

    actionCell.appendChild(deleteBtn);

    row.appendChild(actionCell);

    tbody.appendChild(row);
  });

  table.appendChild(tbody);

  habit_grid.appendChild(table);
}

// Add habit
habit_add_btn.addEventListener("click", () => {
  const value = habit_input.value.trim();

  // Validate empty input
  if (value === "") {
    return alert("Habit is required");
  }

  // Check duplicate habit
  const isHabitAlreadyAvailable = habits.some(
    (habit) => habit.name.toLowerCase() === value.toLowerCase(),
  );

  if (isHabitAlreadyAvailable) {
    return alert("Habit already available");
  }

  // Add new habit
  habits.push({
    name: value,

    completedValue: [],
  });

  // Save and render
  saveDataToLocalStorage();

  renderHabits();

  // Clear input
  habit_input.value = "";
});

// Previous week
prev_week_btn.addEventListener("click", () => {
  currentWeekOffset--;

  renderHabits();
});

// Next week
next_week_btn.addEventListener("click", () => {
  currentWeekOffset++;

  renderHabits();
});

// Initialize app
function init() {
  habits = getDataFromLocalStorage();

  renderHabits();
}

init();
