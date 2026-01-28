import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./ProfilePage.css";
import axios from "axios";

const ProfilePage = ({ loggedInUser }) => {
  const [showModal, setShowModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [emailForReset, setEmailForReset] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [receivedOtp, setReceivedOtp] = useState("");
  const [fieldsEnabled, setFieldsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addressList, setAddressList] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);

  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    isDefault: false,
  });

  const api = import.meta.env.VITE_REACT_APP_API;

  useEffect(() => {
    getAddress();
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const getAddress = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${api}/api/user/getAddress`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAddressList(res.data.addressList || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch address");
    }
  };

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

  const openAddressModal = (addr = null) => {
    setEditingAddress(addr);

    if (addr) {
      setForm({
        street: addr.street || "",
        city: addr.city || "",
        state: addr.state || "",
        postalCode: addr.postalCode || "",
        country: addr.country || "",
        isDefault: !!addr.isDefault,
      });
    } else {
      setForm({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        isDefault: false,
      });
    }

    setShowAddressModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveAddress = async () => {
    const token = localStorage.getItem("token");

    try {
      if (editingAddress) {
        // UPDATE
        await axios.put(
          `${api}/api/user/updateAddress`,
          {
            addressId: editingAddress.addressId,
            ...form,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        toast.success("Address updated");
      } else {
        // CREATE
        await axios.post(
          `${api}/api/user/createAddress`,
          {
            addresses: [form],
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        toast.success("Address added");
      }

      setShowAddressModal(false);
      getAddress();
    } catch (err) {
      toast.error(err.response?.data?.message || "Address save failed");
    }
  };

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

  const setDefaultAddress = async (addressId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `${api}/api/user/setDefaultAddress/${addressId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Default address updated");
      getAddress();
    } catch (err) {
      toast.error("Failed to update default address");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          <img src={loggedInUser.profileImage} alt="avatar" />
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
          <div className="profile-row">
            <span>Address</span>
            <div className="address-list">
              {addressList.length === 0 && (
                <span className="muted">No address added</span>
              )}

              {addressList.map((addr) => (
                <div
                  key={addr.addressId}
                  className={`address-item ${addr.isDefault ? "default" : ""}`}
                >
                  <div className="address-text">
                    {addr.street}, {addr.city}, {addr.state} {addr.postalCode}
                    {addr.isDefault && (
                      <span className="default-badge">Default</span>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "6px" }}>
                    {!addr.isDefault && (
                      <button
                        className="address-edit"
                        onClick={() => setDefaultAddress(addr.addressId)}
                      >
                        Make Default
                      </button>
                    )}

                    <button
                      className="address-edit"
                      onClick={() => openAddressModal(addr)}
                    >
                      ✎
                    </button>
                  </div>
                </div>
              ))}

              {addressList && addressList.length < 2 && (
                <button
                  className="add-address-btn"
                  onClick={() => openAddressModal()}
                >
                  + Add New Address
                </button>
              )}
            </div>
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

      {showAddressModal && (
        <div className="profile-modal-backdrop">
          <div className="profile-modal">
            <div className="profile-modal-header">
              <h4>{editingAddress ? "Update Address" : "Add Address"}</h4>
              <button onClick={() => setShowAddressModal(false)}>×</button>
            </div>

            <div className="profile-modal-body">
              {["street", "city", "state", "postalCode", "country"].map(
                (field) => (
                  <input
                    key={field}
                    name={field}
                    placeholder={field}
                    value={form[field]}
                    onChange={handleChange}
                  />
                ),
              )}
              <div className="default-address-toggle">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={form.isDefault}
                  onChange={(e) =>
                    setForm({ ...form, isDefault: e.target.checked })
                  }
                />
                <label htmlFor="isDefault">Set as default address</label>
              </div>
            </div>

            <div className="profile-modal-footer">
              <button onClick={() => setShowAddressModal(false)}>Cancel</button>
              <button onClick={saveAddress}>
                {editingAddress ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
