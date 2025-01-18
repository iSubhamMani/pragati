"use client";

import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Notification = () => {
  useEffect(() => {
    async function pushNotification() {
      try {
        const res = await axios.get("/api/generate/fun-fact");
        const message = res.data.message;
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div>
                  <p className="text-base font-bold text-primary">
                    Did you know?
                  </p>
                  <p className="mt-1 text-sm text-black">{message}</p>
                </div>
              </div>
            </div>
          ),
          {
            duration: 5000,
            icon: "🌱",
            position: "bottom-right",
          }
        );
      } catch (error) {
        console.log("Error generating notification:", error);
      }
    }
    setInterval(() => {
      pushNotification();
    }, 60000 * 60 * 2);
  }, []);

  return null;
};

export default Notification;
