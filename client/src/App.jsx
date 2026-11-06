import { useEffect, useState } from 'react';

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    credentials: 'same-origin',
    headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
  });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Request failed.');
  return data;
}

function AuthScreen({ onSignedIn }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      const data = await api(`/api/auth/${mode === 'register' ? 'register' : 'login'}`, { method: 'POST', body: JSON.stringify({ name, email, password }) });
      onSignedIn(data.user);
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  return <main className="auth-wrap"><a className="brand auth-brand" href="#home"><span className="brand-mark">r</span><span>rasely</span></a><section className="auth-card"><span className="welcome-kicker">A LITTLE CORNER OF THE INTERNET</span><h1>{mode === 'login' ? 'Good to see you.' : 'Come on in.'}</h1><p>{mode === 'login' ? 'Sign in to catch up with your circle.' : 'Create an account and find your people.'}</p><form onSubmit={submit} className="auth-form">{mode === 'register' && <label>Your name<input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} minLength="2" maxLength="60" required /></label>}<label>Email address<input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength="254" required /></label><label>Password<input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)} minLength={mode === 'register' ? 10 : 1} maxLength="128" required />{mode === 'register' && <small>Use at least 10 characters.</small>}</label>{error && <div className="form-error" role="alert">{error}</div>}<button className="auth-submit" disabled={busy}>{busy ? 'One moment…' : mode === 'login' ? 'Sign in' : 'Create account'} <span>↗</span></button></form><div className="auth-switch">{mode === 'login' ? 'New to Rasely?' : 'Already have an account?'} <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}> {mode === 'login' ? 'Create an account' : 'Sign in'}</button></div></section><p className="auth-note">A kind space for conversations, thoughts, and little joys. ✳</p></main>;
}

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [posts, setPosts] = useState([]);
  const [people, setPeople] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activePerson, setActivePerson] = useState(null);
  const [section, setSection] = useState('Home');
  const [draft, setDraft] = useState('');
  const [messageDraft, setMessageDraft] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function loadPosts() { const data = await api('/api/posts'); setPosts(data.posts); }
  async function loadPeople(query = '') { const data = await api(`/api/people?q=${encodeURIComponent(query)}`); setPeople(data.people); }
  useEffect(() => { api('/api/auth/me').then((data) => setUser(data.user)).catch(() => {}).finally(() => setChecking(false)); }, []);
  useEffect(() => { if (!user) return; Promise.all([loadPosts(), loadPeople()]).catch((err) => setError(err.message)); }, [user]);

  async function signOut() { await api('/api/auth/logout', { method: 'POST' }).catch(() => {}); setUser(null); setPosts([]); setSection('Home'); }
  async function createPost(event) {
    event.preventDefault(); if (!draft.trim()) return; setBusy(true); setError('');
    try { await api('/api/posts', { method: 'POST', body: JSON.stringify({ text: draft }) }); setDraft(''); await loadPosts(); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  async function toggleLike(post) {
    try { const data = await api(`/api/posts/${post.id}/like`, { method: 'POST', body: '{}' }); setPosts((items) => items.map((item) => item.id === post.id ? { ...item, liked: data.liked, likes: data.likes } : item)); }
    catch (err) { setError(err.message); }
  }
  async function openConversation(person) {
    setActivePerson(person); setSection('Messages'); setError('');
    try { const data = await api(`/api/messages/${person.id}`); setMessages(data.messages); }
    catch (err) { setError(err.message); }
  }
  async function sendMessage(event) {
    event.preventDefault(); if (!messageDraft.trim() || !activePerson) return;
    try { const data = await api(`/api/messages/${activePerson.id}`, { method: 'POST', body: JSON.stringify({ text: messageDraft }) }); setMessages((items) => [...items, data.message]); setMessageDraft(''); }
    catch (err) { setError(err.message); }
  }
  async function searchPeople(value) { setSearch(value); try { await loadPeople(value); } catch (err) { setError(err.message); } }

  if (checking) return <div className="auth-loading">Opening your little corner…</div>;
  if (!user) return <AuthScreen onSignedIn={setUser} />;
  const nav = ['Home', 'Explore', 'Messages', 'Profile'];
  return <div className="app-shell"><aside className="sidebar"><a className="brand" href="#home" onClick={() => setSection('Home')}><span className="brand-mark">r</span><span>rasely</span></a><div className="sidebar-label">YOUR SPACE</div><nav className="main-nav">{nav.map((item) => <button key={item} className={`nav-item ${section === item ? 'active' : ''}`} onClick={() => { setSection(item); if (item === 'Messages') loadPeople(); }}><span className="icon">{({ Home: '⌂', Explore: '⌕', Messages: '▤', Profile: '◉' })[item]}</span><span>{item}</span></button>)}</nav><div className="sidebar-label circle-label">YOUR PEOPLE</div><div className="circle-list">{people.slice(0, 5).map((person) => <button className="circle-person" key={person.id} onClick={() => openConversation(person)}><span className="avatar small blue">{person.name.slice(0, 2).toUpperCase()}</span><span>{person.name.split(' ')[0]}</span></button>)}{people.length === 0 && <span className="no-people">Invite a friend to join you.</span>}</div><div className="sidebar-bottom"><button className="profile-chip" onClick={() => setSection('Profile')}><span className="avatar small pink">{user.name.slice(0, 2).toUpperCase()}</span><span className="profile-name"><b>{user.name}</b><small>@{user.handle}</small></span><span className="more">···</span></button><button className="signout-link" onClick={signOut}>Sign out</button></div></aside>
    <main className="main-column"><header className="topbar"><div><div className="eyebrow">A GOOD DAY TO SAY HI</div><h1>{section === 'Home' ? 'Your little corner' : section === 'Messages' ? 'Conversations' : section}</h1></div><span className="avatar small pink">{user.name.slice(0, 2).toUpperCase()}</span></header>{error && <div className="app-error" role="alert">{error}<button onClick={() => setError('')}>×</button></div>}
      {section === 'Home' ? <div className="feed-layout"><section className="feed"><div className="welcome-card"><div><span className="welcome-kicker">A GOOD DAY TO SAY HI</span><h2>Good things happen<br />when we’re <em>together.</em></h2><p>Share a thought and catch up with your circle.</p></div><div className="sun-art"><span>✦</span><i>☀</i></div></div><form className="compose-card" onSubmit={createPost}><span className="avatar pink">{user.name.slice(0, 2).toUpperCase()}</span><div className="compose-content"><textarea value={draft} maxLength="1000" onChange={(e) => setDraft(e.target.value)} placeholder="What’s on your mind?" rows="3" /><div className="compose-footer"><span>{draft.length}/1000</span><button className="post-button" disabled={busy || !draft.trim()}>{busy ? 'Sharing…' : 'Share a thought ↗'}</button></div></div></form><div className="feed-label">FROM YOUR COMMUNITY ✳</div>{posts.map((post) => <article className="post-card" key={post.id}><div className="post-head"><span className="avatar small blue">{post.author.name.slice(0, 2).toUpperCase()}</span><div className="post-author"><b>{post.author.name}</b><small>@{post.author.handle} · {new Date(post.createdAt).toLocaleString()}</small></div></div><p className="post-text">{post.text}</p><div className="post-actions"><button className={post.liked ? 'liked' : ''} onClick={() => toggleLike(post)}><span>{post.liked ? '♥' : '♡'}</span> {post.likes} likes</button></div></article>)}{posts.length === 0 && <div className="empty-section"><span className="empty-icon">✳</span><h2>It’s quiet here (for now).</h2><p>Share the first thought with your community.</p></div>}</section><aside className="right-rail"><label className="rail-search"><span>⌕</span><input placeholder="Find your people" value={search} onChange={(e) => searchPeople(e.target.value)} /></label><section className="rail-card"><div className="rail-title"><h3>Your community</h3></div><p className="rail-subtitle">People who make your day.</p>{people.slice(0, 5).map((person) => <div className="suggestion" key={person.id}><span className="avatar small purple">{person.name.slice(0, 2).toUpperCase()}</span><span><b>{person.name}</b><small>@{person.handle}</small></span><button onClick={() => openConversation(person)}>↗</button></div>)}{people.length === 0 && <p className="rail-subtitle">When friends join Rasely, you’ll find them here.</p>}</section></aside></div> : section === 'Messages' ? <div className="messages-page real-messages"><section className="chat-list-panel"><div className="section-heading"><div><h2>People</h2><p>Start a conversation.</p></div></div><label className="search-box"><span>⌕</span><input placeholder="Search people" value={search} onChange={(e) => searchPeople(e.target.value)} /></label><div className="chat-list">{people.map((person) => <button className={`chat-preview ${activePerson?.id === person.id ? 'chosen' : ''}`} key={person.id} onClick={() => openConversation(person)}><span className="avatar small blue">{person.name.slice(0, 2).toUpperCase()}</span><span className="chat-preview-copy"><b>{person.name}</b><small>@{person.handle}</small></span></button>)}</div></section><section className="conversation">{activePerson ? <><div className="conversation-head"><span className="avatar small blue">{activePerson.name.slice(0, 2).toUpperCase()}</span><div><b>{activePerson.name}</b><small>@{activePerson.handle}</small></div></div><div className="messages-body">{messages.map((message) => <div className={`message-row ${message.from === 'me' ? 'mine' : ''}`} key={message.id}><div className="message-bubble">{message.text}</div></div>)}{messages.length === 0 && <p className="rail-subtitle">Say hello and start the conversation.</p>}</div><form className="message-composer" onSubmit={sendMessage}><input value={messageDraft} maxLength="2000" onChange={(e) => setMessageDraft(e.target.value)} placeholder={`Message ${activePerson.name}…`} /><button className="send-button" disabled={!messageDraft.trim()}>➤</button></form></> : <div className="empty-section"><span className="empty-icon">✳</span><h2>Good conversations start here.</h2><p>Choose someone from the list to say hello.</p></div>}</section></div> : <section className="profile-panel"><span className="avatar profile-large pink">{user.name.slice(0, 2).toUpperCase()}</span><h2>{user.name}</h2><p>@{user.handle}</p><label>Email<input value={user.email || ''} readOnly /></label><p className="rail-subtitle">Your account is ready. More profile settings are on the way.</p><button className="post-button" onClick={signOut}>Sign out</button></section>}</main>
  </div>;
}

export default App;
