const habit_add_btn = document.getElementById("add-habit-btn");

const habit_input = document.getElementById("habit-input");

const habit_grid = document.getElementById("habit-grid");

const empty_state = document.getElementById("empty-state");

const prev_week_btn = document.getElementById("prev-week-btn");

const next_week_btn = document.getElementById("next-week-btn");

let habits = [];
let weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function saveDataToLocalStorage() {
  localStorage.setItem("habits", JSON.stringify(habits));
  return true;
}

function getDataFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem("habits"));

  return data || [];
}

function getRealDateTime(weekOffset = 0) {
  const dates = [];
  const today = new Date();
  const currentDay = today.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

  const monday = new Date(today);

  monday.setDate(today.getDate() + mondayOffset + weekOffset * 7);

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);

    date.setDate(date.getDate() + i);

    dates.push({
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      fullDate: date.toISOString().split("T")[0],
    });
  }

  return dates;
}

function renderHabits() {
  habit_grid.innerHTML = "";

  const weekDays = getRealDateTime();
  console.log(weekDays);
  const table = document.createElement("table");

  const thead = document.createElement("thead");

  const tr = document.createElement("tr");

  // HABIT HEADING
  const habitHeading = document.createElement("th");

  habitHeading.textContent = "Habits";

  tr.appendChild(habitHeading);

  // WEEK DAYS
  weekDays.forEach((day) => {
    const th = document.createElement("th");

    th.textContent = day.day;

    tr.appendChild(th);
  });

  // ACTION HEADING
  const actionHeading = document.createElement("th");

  actionHeading.textContent = "Action";

  tr.appendChild(actionHeading);
  const tbody = document.createElement("tbody");

  if (habits.length > 0) {
    empty_state.style.display = "None";
  } else {
    empty_state.style.display = "block";
  }

  habits.forEach((habit) => {
    console.log(habit);
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.textContent = habit.name;
    tr.appendChild(td);

    weekDays.forEach((day) => {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.setAttribute("type", "checkbox");
      if (habit.completedValue.includes(day.fullDate)) {
        input.checked = true;
      }

      input.addEventListener("change", (e) => {
        if (input.checked && !habit.completedValue.includes(day.fullDate)) {
          habit.completedValue.push(day.fullDate);
        } else {
          habit.completedValue = habit.completedValue.filter(
            (v) => v !== day.fullDate,
          );
        }
        saveDataToLocalStorage();
      });

      td.appendChild(input);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  thead.appendChild(tr);

  table.appendChild(thead);
  table.appendChild(tbody);

  habit_grid.appendChild(table);
}

habit_add_btn.addEventListener("click", (e) => {
  const value = habit_input.value;
  if (value.trim() === "") {
    return alert("Habit is required");
  }

  const isHabitAlreadyAvailable = habits.filter(
    (habit) => habit.name === value,
  );
  if (isHabitAlreadyAvailable.length > 0) {
    return alert("Habit already available");
  }

  habits.push({
    name: value,
    completedValue: [],
  });

  saveDataToLocalStorage();
  renderHabits();
});

function init() {
  habits = getDataFromLocalStorage();
  renderHabits();
}

init();
