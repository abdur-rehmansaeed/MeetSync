// src/services/api.js

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/* =========================
   MOCK DATABASE
========================= */

let USERS = [
  { id: 1, name: "Admin", email: "admin@test.com", password: "123", role: "admin" },
  { id: 2, name: "User", email: "user@test.com", password: "123", role: "member" },
];

let MEETINGS = [
  { id: 1, title: "Kickoff", date: "2026-04-01", createdBy: 1 },
  { id: 2, title: "Planning", date: "2026-04-05", createdBy: 2 },
];

let TASKS = [
  { id: 1, title: "Report", status: "Pending", userId: 1 },
  { id: 2, title: "Fix Bugs", status: "Completed", userId: 2 },
];

/* =========================
   CORE API
========================= */

const API = {
  get: async (url) => {
    await delay(200);

    const cleanUrl = url.split("?")[0].replace(/\/+$/, "");
    const parts = cleanUrl.split("/").filter(Boolean);

    if (cleanUrl.includes("/auth/profile")) return { data: USERS[0] };

    if (cleanUrl.includes("/users")) return { data: USERS };

    if (cleanUrl.includes("/dashboard")) {
      return {
        data: {
          totalUsers: USERS.length,
          totalMeetings: MEETINGS.length,
          totalTasks: TASKS.length,
        },
      };
    }

    if (cleanUrl.includes("/my-tasks")) {
      return { data: TASKS.filter((t) => t.userId === 1) };
    }

    if (cleanUrl.includes("/tasks")) {
      return { data: TASKS };
    }

    if (cleanUrl.includes("/meetings/user")) {
      const userId = parseInt(parts[2]);
      return { data: MEETINGS.filter((m) => m.createdBy === userId) };
    }

    if (cleanUrl.includes("/meetings")) {
      const id = parseInt(parts[1]);
      if (!isNaN(id)) {
        return {
          data: [MEETINGS.find((m) => m.id === id)].filter(Boolean),
        };
      }
      return { data: MEETINGS };
    }

    return { data: [] };
  },

  post: async (url, body) => {
    await delay(200);
    const cleanUrl = url.split("?")[0].replace(/\/+$/, "");

    if (cleanUrl.includes("/auth/login")) {
      const user = USERS.find(
        (u) => u.email === body.email && u.password === body.password
      );
      if (!user) throw new Error("Invalid credentials");
      return { data: { user, token: "fake-token" } };
    }

    if (cleanUrl.includes("/auth/register")) {
      const newUser = { id: Date.now(), ...body };
      USERS.push(newUser);
      return { data: newUser };
    }

    if (cleanUrl.includes("/meetings")) {
      const newMeeting = { id: Date.now(), ...body };
      MEETINGS.push(newMeeting);
      return { data: newMeeting };
    }

    if (cleanUrl.includes("/tasks")) {
      const newTask = { id: Date.now(), ...body };
      TASKS.push(newTask);
      return { data: newTask };
    }

    return { data: {} };
  },

  delete: async (url) => {
    await delay(200);
    const parts = url.split("/").filter(Boolean);

    if (url.includes("/meetings")) {
      const id = parseInt(parts[1]);
      MEETINGS = MEETINGS.filter((m) => m.id !== id);
      return { data: {} };
    }

    if (url.includes("/tasks")) {
      const id = parseInt(parts[1]);
      TASKS = TASKS.filter((t) => t.id !== id);
      return { data: {} };
    }

    return { data: {} };
  },
};

/* =========================
   NAMED EXPORTS (CRITICAL)
========================= */

// Dashboard
export const getDashboard = () => API.get("/dashboard");

// Users
export const getUsers = () => API.get("/users");

// Meetings
export const getMeetings = () => API.get("/meetings");
export const createMeeting = (data) => API.post("/meetings", data);
export const deleteMeeting = (id) => API.delete(`/meetings/${id}`);

// Tasks
export const getTasks = () => API.get("/tasks");
export const createTask = (data) => API.post("/tasks", data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

// My Tasks
export const getMyTasks = () => API.get("/my-tasks");

export default API;