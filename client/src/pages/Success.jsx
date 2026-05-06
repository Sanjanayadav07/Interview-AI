
/*
import React, { useRef, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
//import { ServerUrl } from "../App";
const ServerUrl = import.meta.env.VITE_SERVER_URL;

const Success = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  const called = useRef(false);

  const sessionId = searchParams.get("session_id");

  console.log("SESSION_ID:", sessionId);

  if (!sessionId) {
    console.log("No sessionId found in URL");
    return;
  }

  useEffect(() => {
    if (called.current) return;
    called.current = true;
    /*
    const verify = async () => {
      const sessionId = searchParams.get("session_id");
      if (!sessionId) return;

      try {
        const token = localStorage.getItem("token");
        console.log("SESSION_ID:", sessionId);
        console.log("SERVER URL:", ServerUrl);
        console.log("FINAL URL:", `${ServerUrl}/api/payment/verify`);
        const res = await axios.post(
          //ServerUrl + "/api/payment/verify",
          `${ServerUrl}/api/payment/verify`,
          { sessionId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("VERIFY RESPONSE:", res.data);
      } catch (error) {
        console.log("VERIFY ERROR:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };*/
/*
  const verify = async () => {
    const token = localStorage.getItem("token");
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;

    try {
      console.log("SESSION_ID:", sessionId);
      console.log("SERVER URL:", ServerUrl);
      console.log("FINAL URL:", `${ServerUrl}/api/payment/verify`);

      const res = await axios.post(
        `${ServerUrl}/api/payment/verify`,
        { sessionId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ VERIFY SUCCESS:", res.data);
    } catch (error) {
      console.log("❌ VERIFY ERROR:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  verify();
}, [searchParams]);

return (
  <div className="min-h-screen flex items-center justify-center">
    {loading ? (
      <h1 className="text-xl">Verifying Payment...</h1>
    ) : (
      <h1 className="text-2xl font-bold text-green-600">
        Payment Successful 🎉
      </h1>
    )}
  </div>
);
};

export default Success;
*/

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const ServerUrl = import.meta.env.VITE_SERVER_URL;

const Success = () => {
  const [loading, setLoading] = useState(true);
  const called = useRef(false); // ✅ prevents double call (React Strict Mode)

  useEffect(() => {
    if (called.current) return; // ✅ stop second execution
    called.current = true;

    const sessionId = new URLSearchParams(window.location.search).get("session_id");

    if (!sessionId) {
      console.log("❌ No sessionId in URL");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const token = localStorage.getItem("token");

        console.log("🌐 URL:", window.location.href);
        console.log("🆔 Session:", sessionId);

        const res = await axios.post(
          `${ServerUrl}/api/payment/verify`,
          { sessionId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("✅ VERIFY SUCCESS:", res.data);

      } catch (error) {
        const msg = error.response?.data?.message;

        if (msg === "Already verified") {
          console.log("✅ Already verified (safe)");
        } else {
          console.log("❌ VERIFY ERROR:", msg || error.message);
        }
      } finally {
        setLoading(false); // ✅ always stop loader
      }
    };

    verify();

  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {loading ? (
        <h1 className="text-xl">Verifying Payment...</h1>
      ) : (
        <h1 className="text-2xl font-bold text-green-600">
          Payment Successful 🎉
        </h1>
      )}
    </div>
  );
};

export default Success;