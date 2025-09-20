import axios from "axios";

const BASE_URL = "http://localhost:5000/trips"; // Backend URL

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // important if using cookies
});

// Attach token from localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Trip types
export interface Trip {
  _id: string;
  tripName: string;
  location: string;
  creator: { _id: string; username: string };
  participants: { _id: string; username: string }[];
  guestParticipants: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TripPayload {
  tripName: string;
  location: string;
  participants?: string[];
  guestParticipants?: string[];
}

export interface TripResponse {
  success: boolean;
  message?: string;
  trip?: Trip;
  trips?: Trip[];
}

// Trip APIs
export const tripApi = {
  createTrip: async (trip: TripPayload): Promise<TripResponse> => {
    const { data } = await apiClient.post("/", trip);
    return data;
  },

  getTrips: async (): Promise<TripResponse> => {
    const { data } = await apiClient.get("/");
    return data;
  },

  getRecentTrips: async (): Promise<TripResponse> => {
    const { data } = await apiClient.get("/recent");
    return data;
  },

  updateTrip: async (id: string, trip: TripPayload): Promise<TripResponse> => {
    const { data } = await apiClient.put(`/${id}`, trip);
    return data;
  },

  deleteTrip: async (id: string): Promise<TripResponse> => {
    const { data } = await apiClient.delete(`/${id}`);
    return data;
  },
};

