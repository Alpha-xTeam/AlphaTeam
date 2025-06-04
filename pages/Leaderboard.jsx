{users.map((user, idx) => (
  <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <img
      src={
        user.avatar && user.avatar.startsWith('http') && user.avatar.includes('cloudinary')
          ? user.avatar
          : "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/insghjql3cf7hep1aidk.png"
      }
      alt="avatar"
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #eab308',
        background: '#222'
      }}
      onError={e => { e.target.src = "https://res.cloudinary.com/dmao2zbvt/image/upload/v1749047282/insghjql3cf7hep1aidk.png"; }}
    />
    <span>{user.name}</span>
  </div>
))}
