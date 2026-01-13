import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ProfilePage = ({ loggedInUser }) => {
  const [showModal, setShowModal] = useState(false);
  const [emailForReset, setEmailForReset] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [receivedOtp, setReceivedOtp] = useState("");
  const [fieldsEnabled, setFieldsEnabled] = useState(false);
  const [loading, setLoading] = useState(true); // 👈 loading state

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // ⏳ simulate loading delay

    return () => clearTimeout(timer);
  }, []);

  // console.log("loggedInUser", loggedInUser);

  if (!loggedInUser) {
    return (
      <div className="container text-center mt-5">
        <h3>Please log in to view your profile.</h3>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary mb-3" role="status" />
        <p>Loading your profile...</p>
      </div>
    );
  }

  const handleOpenModal = () => {
    setEmailForReset(loggedInUser.email);
    setShowModal(true);
    setFieldsEnabled(false);
    setReceivedOtp("");
    setNewPassword("");
  };

  const handleOtpSend = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/user/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailForReset }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // alert("OTP has been sent successfully.");
        toast.success("OTP has been sent successfully.");
        setFieldsEnabled(true);
      } else {
        // alert(data.message || "Failed to send OTP.");
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      console.error("OTP send error:", err);
      // alert("An error occurred while sending OTP.");
      toast.error("An error occurred while sending OTP.");
    }
  };

  const handlePasswordReset = async () => {
    if (!receivedOtp.trim() || !newPassword.trim()) {
      // alert("Please enter OTP and new password.");
      toast.info("Please enter OTP and new password.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/user/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailForReset,
            otp: receivedOtp.trim(),
            password: newPassword.trim(),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // alert("Password updated successfully.");
        toast.success("Password updated successfully.");
        setShowModal(false);
      } else {
        // alert(data.message || "Failed to update password.");
        toast.error(data.message || "Failed to update password.");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      // alert("An error occurred while updating password.");
      toast.error("An error occurred while updating password.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <img
            src={`https://avatar.iran.liara.run/public/`}
            alt="Profile"
            className="rounded-circle"
            width="120"
            height="120"
          />
        </div>
        <h4 className="text-center mb-3">{loggedInUser.name}</h4>
        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex justify-content-between">
            <span>
              <strong>Email:</strong> {loggedInUser.email}
            </span>
          </li>

          <li className="list-group-item d-flex justify-content-between">
            <span>
              <strong>Date of Birth:</strong>{" "}
              {loggedInUser.dob
                ? new Date(loggedInUser.dob).toLocaleDateString("en-GB")
                : "Not provided"}
            </span>
          </li>

          <li className="list-group-item d-flex justify-content-between">
            <span>
              <strong>Gender:</strong> {loggedInUser.gender || "Not specified"}
            </span>
          </li>

          <li className="list-group-item d-flex justify-content-between">
            <span>
              <strong>Reset my password:</strong> **********
            </span>
            <span
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={handleOpenModal}
            >
              <i className="fa-regular fa-pen-to-square"></i>
            </span>
          </li>

          <li className="list-group-item">
            <strong>Role:</strong> {loggedInUser.role || "User"}
          </li>
        </ul>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">Update Password</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Your Email</label>
                  <div className="d-flex gap-2">
                    <input
                      type="email"
                      className="form-control"
                      value={emailForReset}
                      disabled
                    />
                    <button className="btn btn-primary" onClick={handleOtpSend}>
                      Send OTP
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Enter OTP</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter OTP"
                    value={receivedOtp}
                    onChange={(e) => setReceivedOtp(e.target.value)}
                    disabled={!fieldsEnabled}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={!fieldsEnabled}
                  />
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handlePasswordReset}
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

// ====================================

// import React, { useEffect, useState } from "react";

// const ProfilePage = ({ loggedInUser }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [emailForReset, setEmailForReset] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [receivedOtp, setReceivedOtp] = useState("");
//   const [fieldsEnabled, setFieldsEnabled] = useState(false);
//   const [imageLoaded, setImageLoaded] = useState(false);

//   const profileImageUrl = "https://avatar.iran.liara.run/public/";

//   useEffect(() => {
//     const img = new Image();
//     img.src = profileImageUrl;

//     img.onload = () => setImageLoaded(true);
//     img.onerror = () => setImageLoaded(true); // fallback if image fails
//   }, []);

//   if (!loggedInUser) {
//     return (
//       <div className="container text-center mt-5">
//         <h3>Please log in to view your profile.</h3>
//       </div>
//     );
//   }

//   if (!imageLoaded) {
//     return (
//       <div className="container text-center mt-5">
//         <div className="spinner-border text-primary mb-3" role="status" />
//         <p>Loading profile...</p>
//       </div>
//     );
//   }

//   const handleOpenModal = () => {
//     setEmailForReset(loggedInUser.email);
//     setShowModal(true);
//     setFieldsEnabled(false);
//     setReceivedOtp("");
//     setNewPassword("");
//   };

//   const handleOtpSend = async () => {
//     try {
//       const response = await fetch(
//         "http://localhost:8000/api/user/forgot-password",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: emailForReset }),
//         }
//       );

//       const data = await response.json();

//       if (data.success) {
//         alert("OTP has been sent successfully.");
//         setFieldsEnabled(true);
//       } else {
//         alert(data.message || "Failed to send OTP.");
//       }
//     } catch (err) {
//       console.error("OTP send error:", err);
//       alert("An error occurred while sending OTP.");
//     }
//   };

//   const handlePasswordReset = async () => {
//     if (!receivedOtp.trim() || !newPassword.trim()) {
//       alert("Please enter OTP and new password.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "http://localhost:8000/api/user/reset-password",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             email: emailForReset,
//             otp: receivedOtp.trim(),
//             password: newPassword.trim(),
//           }),
//         }
//       );

//       const data = await response.json();

//       if (data.success) {
//         alert("Password updated successfully.");
//         setShowModal(false);
//       } else {
//         alert(data.message || "Failed to update password.");
//       }
//     } catch (err) {
//       console.error("Password reset error:", err);
//       alert("An error occurred while updating password.");
//     }
//   };

//   return (
//     <div className="container d-flex justify-content-center align-items-center min-vh-100">
//       <div
//         className="card shadow p-4"
//         style={{ maxWidth: "500px", width: "100%" }}
//       >
//         <div className="text-center mb-4">
//           <img
//             src={profileImageUrl}
//             alt="Profile"
//             className="rounded-circle"
//             width="120"
//             height="120"
//           />
//         </div>
//         <h4 className="text-center mb-3">{loggedInUser.name}</h4>
//         <ul className="list-group list-group-flush">
//           <li className="list-group-item d-flex justify-content-between">
//             <span>
//               <strong>Email:</strong> {loggedInUser.email}
//             </span>
//           </li>
//           <li className="list-group-item d-flex justify-content-between">
//             <span>
//               <strong>Reset my password:</strong> **********
//             </span>
//             <span
//               className="text-primary"
//               style={{ cursor: "pointer" }}
//               onClick={handleOpenModal}
//             >
//               <i className="fa-regular fa-pen-to-square"></i>
//             </span>
//           </li>
//           <li className="list-group-item">
//             <strong>Role:</strong> {loggedInUser.role || "User"}
//           </li>
//         </ul>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div
//           className="modal fade show d-block"
//           tabIndex="-1"
//           role="dialog"
//           aria-modal="true"
//           style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
//         >
//           <div className="modal-dialog modal-dialog-centered" role="document">
//             <div className="modal-content shadow">
//               <div className="modal-header">
//                 <h5 className="modal-title">Update Password</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setShowModal(false)}
//                   aria-label="Close"
//                 />
//               </div>
//               <div className="modal-body">
//                 <div className="mb-3">
//                   <label className="form-label">Your Email</label>
//                   <div className="d-flex gap-2">
//                     <input
//                       type="email"
//                       className="form-control"
//                       value={emailForReset}
//                       disabled
//                     />
//                     <button className="btn btn-primary" onClick={handleOtpSend}>
//                       Send OTP
//                     </button>
//                   </div>
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">Enter OTP</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Enter OTP"
//                     value={receivedOtp}
//                     onChange={(e) => setReceivedOtp(e.target.value)}
//                     disabled={!fieldsEnabled}
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">New Password</label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     placeholder="Enter new password"
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                     disabled={!fieldsEnabled}
//                   />
//                 </div>
//               </div>
//               <div className="modal-footer d-flex justify-content-center">
//                 <button
//                   className="btn btn-secondary"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="btn btn-primary"
//                   onClick={handlePasswordReset}
//                 >
//                   Update Password
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;
