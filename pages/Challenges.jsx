{challenges.map((challenge) => (
  <div key={challenge.id}>
    <img
      src={challenge.user.avatar?.startsWith('/assets/') ? challenge.user.avatar : "/assets/avatars/boy1.png"}
      alt="avatar"
      style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', background: '#222' }}
      onError={e => { e.target.src = "/assets/avatars/boy1.png"; }}
    />
    <span>{challenge.user.name}</span>
    {/* ...existing code... */}
  </div>
))}
