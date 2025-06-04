function Profile({ user }) {
  return (
    <div>
      <img
        src={
          user.avatar && user.avatar.startsWith('https://res.cloudinary.com')
            ? user.avatar
            : "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/insghjql3cf7hep1aidk.png"
        }
        alt="avatar"
        style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', background: '#222' }}
        onError={e => { e.target.src = "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/insghjql3cf7hep1aidk.png"; }}
      />
    </div>
  );
}
