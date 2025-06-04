import React, { useState } from 'react';

const avatarList = [
  "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047283/uchgfbvn93vankxi8ngt.png",
  "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047283/uemk18ecy4s9l5hkusfg.png",
  "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047283/ldf6gddraviuecktdv6r.png",
  "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047283/ypkhs51swkfc6dlwjvsw.png",
  "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047283/ezpug86k3gkypdx7u0bd.png",
  "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/mwqpkyy8mnhq5eybpxgr.png",
  "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/uivpymjbxjfpoiy0i659.png",
  "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/insghjql3cf7hep1aidk.png"
];

function RegisterForm() {
  const [selectedAvatar, setSelectedAvatar] = useState(avatarList[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      avatar: selectedAvatar,
    };
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>اختر الأفتار:</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            {avatarList.slice(0, Math.ceil(avatarList.length / 2)).map((avatar, idx) => (
              <img
                key={idx}
                src={avatar}
                alt="avatar"
                style={{
                  border: selectedAvatar === avatar ? '2px solid blue' : '2px solid transparent',
                  width: 60, height: 60, borderRadius: '50%', cursor: 'pointer'
                }}
                onClick={() => setSelectedAvatar(avatar)}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            {avatarList.slice(Math.ceil(avatarList.length / 2)).map((avatar, idx) => (
              <img
                key={idx + Math.ceil(avatarList.length / 2)}
                src={avatar}
                alt="avatar"
                style={{
                  border: selectedAvatar === avatar ? '2px solid blue' : '2px solid transparent',
                  width: 60, height: 60, borderRadius: '50%', cursor: 'pointer'
                }}
                onClick={() => setSelectedAvatar(avatar)}
              />
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}

export default RegisterForm;
