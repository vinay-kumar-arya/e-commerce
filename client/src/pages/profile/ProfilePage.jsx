import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./ProfilePage.css";

const ProfilePage = ({ loggedInUser }) => {
  const [showModal, setShowModal] = useState(false);
  const [emailForReset, setEmailForReset] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [receivedOtp, setReceivedOtp] = useState("");
  const [fieldsEnabled, setFieldsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  if (!loggedInUser) {
    return (
      <div className="profile-empty">
        <h3>Please log in to view your profile</h3>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner-border" />
        <p>Loading profile…</p>
      </div>
    );
  }

  const openModal = () => {
    setEmailForReset(loggedInUser.email);
    setShowModal(true);
    setFieldsEnabled(false);
    setReceivedOtp("");
    setNewPassword("");
  };

  const api = import.meta.env.VITE_REACT_APP_API;

  const handleOtpSend = async () => {
    try {
      const res = await fetch(`${api}/api/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailForReset }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("OTP sent");
        setFieldsEnabled(true);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handlePasswordReset = async () => {
    if (!receivedOtp || !newPassword) {
      toast.info("Enter OTP and new password");
      return;
    }

    try {
      const res = await fetch(`${api}/api/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailForReset,
          otp: receivedOtp,
          password: newPassword,
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Password updated");
        setShowModal(false);
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          <img src="https://avatar.iran.liara.run/public/" alt="avatar" />
        </div>

        <h2 className="profile-name">{loggedInUser.name}</h2>

        <div className="profile-info">
          <div className="profile-row">
            <span>Email</span>
            <span>{loggedInUser.email}</span>
          </div>

          <div className="profile-row">
            <span>Date of Birth</span>
            <span>
              {loggedInUser.dob
                ? new Date(loggedInUser.dob).toLocaleDateString("en-GB")
                : "Not provided"}
            </span>
          </div>

          <div className="profile-row">
            <span>Gender</span>
            <span>{loggedInUser.gender || "Not specified"}</span>
          </div>

          <div className="profile-row editable">
            <span>Password</span>
            <span className="profile-edit" onClick={openModal}>
              Change
            </span>
          </div>

          <div className="profile-row">
            <span>Role</span>
            <span>{loggedInUser.role || "User"}</span>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="profile-modal-backdrop">
          <div className="profile-modal">
            <div className="profile-modal-header">
              <h4>Update Password</h4>
              <button onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="profile-modal-body">
              <div className="form-group">
                <input value={emailForReset} disabled />
                <button onClick={handleOtpSend}>Send OTP</button>
              </div>

              <input
                placeholder="Enter OTP"
                value={receivedOtp}
                onChange={(e) => setReceivedOtp(e.target.value)}
                disabled={!fieldsEnabled}
              />

              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={!fieldsEnabled}
              />
            </div>

            <div className="profile-modal-footer">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={handlePasswordReset}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
