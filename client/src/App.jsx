import { useEffect, useMemo, useState } from 'react';

const people = [
  { name: 'Maya Chen', handle: '@mayamakes', avatar: 'MC', color: 'coral', online: true },
  { name: 'Jordan Lee', handle: '@jordansays', avatar: 'JL', color: 'blue', online: true },
  { name: 'Amara Okafor', handle: '@amararose', avatar: 'AO', color: 'purple', online: false },
  { name: 'Theo Park', handle: '@theopark', avatar: 'TP', color: 'green', online: true },
  { name: 'Sofia Rivera', handle: '@sofiasun', avatar: 'SR', color: 'gold', online: false },
];
const initialPosts = [
  { id: 1, person: people[0], time: '12 min ago', text: 'Little reminder that you don’t have to have it all figured out to take the next step 🌱 What’s one tiny win you had today?', likes: 24, comments: 6, liked: false, tag: 'daily thoughts' },
  { id: 2, person: people[2], time: '38 min ago', text: 'Spent the afternoon at the farmers market and came home with approximately 14 kinds of cheese. No regrets whatsoever. 🧀', likes: 18, comments: 3, liked: false, tag: 'little joys' },
  { id: 3, person: people[3], time: '1 hr ago', text: 'Made a playlist for slow Sunday mornings. Coffee, an open window, and absolutely nowhere to be. That’s the whole plan.', likes: 31, comments: 8, liked: false, tag: 'music' },
];
const initialChats = [
  { id: 1, person: people[0], preview: 'You: that sounds like a perfect plan ✨', time: 'now', unread: 2, messages: [{ from: 'them', text: 'Hey! Are we still on for coffee this weekend?' }, { from: 'me', text: 'Absolutely! I found a lovely little place near the park.' }, { from: 'them', text: 'That sounds perfect ☕' }] },
  { id: 2, person: people[1], preview: 'Sent you the photos!', time: '8m', unread: 0, messages: [{ from: 'them', text: 'Sent you the photos from Saturday!' }] },
  { id: 3, person: people[4], preview: 'Haha, I know right 😂', time: '1h', unread: 0, messages: [{ from: 'me', text: 'That movie was so much fun.' }, { from: 'them', text: 'Haha, I know right 😂' }] },
  { id: 4, person: people[3], preview: 'See you there!', time: '3h', unread: 0, messages: [{ from: 'them', text: 'See you there!' }] },
];
const Icon = ({ children, size = 20 }) => <span className="icon" style={{ fontSize: size }} aria-hidden="true">{children}</span>;
const Avatar = ({ person, size = '' }) => <div className={`avatar ${person.color} ${size}`} aria-label={person.name}>{person.avatar}</div>;

function App() {
  const [section, setSection] = useState('Home');
  const [posts, setPosts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rasely-posts')) || initialPosts; } catch { return initialPosts; }
  });
  const [chats, setChats] = useState(initialChats);
  const [activeChat, setActiveChat] = useState(1);
  const [draft, setDraft] = useState('');
  const [postDraft, setPostDraft] = useState('');
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { localStorage.setItem('rasely-posts', JSON.stringify(posts)); }, [posts]);
  const selectedChat = chats.find((chat) => chat.id === activeChat) || chats[0];
  const filteredChats = useMemo(() => chats.filter((chat) => `${chat.person.name} ${chat.preview}`.toLowerCase().includes(query.toLowerCase())), [chats, query]);
  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2400); };
  const toggleLike = (id) => setPosts((items) => items.map((post) => post.id === id ? { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) } : post));
  const publishPost = (event) => {
    event.preventDefault();
    if (!postDraft.trim()) return;
    setPosts((items) => [{ id: Date.now(), person: { name: 'Alex Morgan', handle: '@alexmorgan', avatar: 'AM', color: 'pink' }, time: 'just now', text: postDraft.trim(), likes: 0, comments: 0, liked: false, tag: 'your circle' }, ...items]);
    setPostDraft(''); notify('Your post is live!');
  };
  const sendMessage = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    setChats((items) => items.map((chat) => chat.id === activeChat ? { ...chat, preview: `You: ${draft.trim()}`, time: 'now', messages: [...chat.messages, { from: 'me', text: draft.trim() }] } : chat));
    setDraft('');
  };
  const nav = [{ label: 'Home', icon: '⌂' }, { label: 'Explore', icon: '⌕' }, { label: 'Messages', icon: '▤', badge: 2 }, { label: 'Bookmarks', icon: '♧' }];

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#home" onClick={() => setSection('Home')}><span className="brand-mark">r</span><span>rasely</span></a>
      <div className="sidebar-label">YOUR SPACE</div>
      <nav className="main-nav">{nav.map((item) => <button key={item.label} className={`nav-item ${section === item.label ? 'active' : ''}`} onClick={() => { setSection(item.label); if (item.label === 'Messages') setActiveChat(1); }}><Icon>{item.icon}</Icon><span>{item.label}</span>{item.badge && <span className="nav-badge">{item.badge}</span>}</button>)}</nav>
      <div className="sidebar-label circle-label">YOUR CIRCLE <button className="tiny-add" onClick={() => notify('Invite link copied!')}>＋</button></div>
      <div className="circle-list">{people.slice(0, 4).map((person) => <button className="circle-person" key={person.name} onClick={() => { setSection('Messages'); setActiveChat(chats.find((c) => c.person.name === person.name)?.id || 1); }}><span className="avatar-wrap"><Avatar person={person} size="small" />{person.online && <i className="online-dot" />}</span><span>{person.name.split(' ')[0]}</span></button>)}</div>
      <div className="sidebar-bottom"><button className="profile-chip" onClick={() => setSection('Profile')}><Avatar person={{ avatar: 'AM', color: 'pink' }} size="small" /><span className="profile-name"><b>Alex Morgan</b><small>@alexmorgan</small></span><span className="more">···</span></button></div>
    </aside>

    <main className="main-column">
      <header className="topbar"><div><div className="eyebrow">THURSDAY, MAY 21</div><h1>{section === 'Home' ? 'Your little corner' : section === 'Messages' ? 'Conversations' : section}</h1></div><div className="top-actions"><button className="round-button" aria-label="Notifications" onClick={() => setShowNotifications(!showNotifications)}><Icon>♧</Icon><i className="notification-dot" /></button>{showNotifications && <div className="notification-pop"><b>You’re all caught up ✨</b><span>We’ll let you know when something happens.</span></div>}<button className="top-avatar" onClick={() => setSection('Profile')}>AM</button></div></header>
      {section === 'Messages' ? <div className="messages-page"><section className="chat-list-panel"><div className="section-heading"><div><h2>Messages</h2><p>Your people, one tap away.</p></div><button className="soft-icon" onClick={() => notify('New message coming right up!')}>＋</button></div><label className="search-box"><Icon>⌕</Icon><input placeholder="Find a conversation" value={query} onChange={(e) => setQuery(e.target.value)} /></label><div className="chat-list">{filteredChats.map((chat) => <button className={`chat-preview ${activeChat === chat.id ? 'chosen' : ''}`} key={chat.id} onClick={() => setActiveChat(chat.id)}><Avatar person={chat.person} /><span className="chat-preview-copy"><b>{chat.person.name}</b><small>{chat.preview}</small></span><span className="chat-meta"><small>{chat.time}</small>{chat.unread > 0 && <i>{chat.unread}</i>}</span></button>)}</div></section><section className="conversation"><div className="conversation-head"><Avatar person={selectedChat.person} /><div><b>{selectedChat.person.name}</b><small><i className="status-dot" />{selectedChat.person.online ? 'Online now' : 'Usually replies in a bit'}</small></div><button className="soft-icon conversation-more" onClick={() => notify('Conversation options')}>···</button></div><div className="messages-body"><div className="day-separator"><span>Today</span></div>{selectedChat.messages.map((message, index) => <div className={`message-row ${message.from === 'me' ? 'mine' : ''}`} key={`${index}-${message.text}`}>{message.from !== 'me' && <Avatar person={selectedChat.person} size="tiny" />}<div className="message-bubble">{message.text}</div></div>)}</div><form className="message-composer" onSubmit={sendMessage}><button type="button" className="attach-button" onClick={() => notify('File sharing is coming soon')}>＋</button><input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={`Message ${selectedChat.person.name.split(' ')[0]}…`} /><button className="send-button" aria-label="Send message" disabled={!draft.trim()}>➤</button></form></section></div> : section === 'Home' || section === 'Explore' ? <div className="feed-layout"><section className="feed"><div className="welcome-card"><div><span className="welcome-kicker">A GOOD DAY TO SAY HI</span><h2>Good things happen<br />when we’re <em>together.</em></h2><p>Share a thought, catch up with your circle, and make today a little brighter.</p></div><div className="sun-art"><span>✦</span><i>☀</i></div></div><div className="feed-tabs"><button className="selected">For you <span>•</span></button><button onClick={() => notify('You’re viewing the latest from your circle')}>Following</button><button className="feed-more" onClick={() => notify('More ways to explore, soon')}>•••</button></div><form className="compose-card" onSubmit={publishPost}><Avatar person={{ avatar: 'AM', color: 'pink' }} /><div className="compose-content"><textarea value={postDraft} onChange={(e) => setPostDraft(e.target.value)} placeholder="What’s on your mind, Alex?" rows="2" /><div className="compose-footer"><span><button type="button" onClick={() => notify('Photo sharing is coming soon')}>▧ <span>Photo</span></button><button type="button" onClick={() => notify('Add a mood — coming soon')}>☺ <span>Mood</span></button></span><button className="post-button" disabled={!postDraft.trim()}>Share a thought <b>↗</b></button></div></div></form><div className="feed-label">A LITTLE OF EVERYTHING <span>✳</span></div>{posts.map((post) => <article className="post-card" key={post.id}><div className="post-head"><Avatar person={post.person} /><div className="post-author"><b>{post.person.name}</b><small>{post.person.handle} <span>·</span> {post.time}</small></div><button className="post-menu" onClick={() => { setSaved(!saved); notify(saved ? 'Removed from saved posts' : 'Post saved for later'); }}>•••</button></div><p className="post-text">{post.text}</p><div className="post-tag">✳ &nbsp;{post.tag}</div><div className="post-actions"><button className={post.liked ? 'liked' : ''} onClick={() => toggleLike(post.id)}><span>{post.liked ? '♥' : '♡'}</span> {post.likes} <small>likes</small></button><button onClick={() => notify('Comments are coming soon')}><span>▢</span> {post.comments} <small>replies</small></button><button onClick={() => notify('Link copied to clipboard')}><span>↗</span> Share</button><button className="bookmark-action" onClick={() => notify('Post saved for later')}><span>♧</span></button></div></article>)}</section><aside className="right-rail"><div className="rail-search"><Icon>⌕</Icon><input placeholder="Search Rasely" onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { setSection('Messages'); } }} /></div><section className="rail-card"><div className="rail-title"><h3>Your circle</h3><button onClick={() => notify('Invite link copied!')}>See all</button></div><p className="rail-subtitle">People who make your day.</p>{people.slice(0, 3).map((person) => <div className="suggestion" key={person.name}><Avatar person={person} size="small" /><span><b>{person.name}</b><small>{person.handle}</small></span><button aria-label={`Message ${person.name}`} onClick={() => { setSection('Messages'); setActiveChat(chats.find((c) => c.person.name === person.name)?.id || 1); }}>↗</button></div>)}<button className="invite-link" onClick={() => notify('Invite link copied!')}>＋ Invite someone to your circle</button></section><section className="prompt-card"><span className="prompt-icon">✳</span><span className="prompt-label">A LITTLE PROMPT</span><h3>What’s something<br />that made you smile<br />this week?</h3><button onClick={() => document.querySelector('.compose-card textarea')?.focus()}>Share your answer <span>↗</span></button></section><footer className="rail-footer">About &nbsp;·&nbsp; Guidelines &nbsp;·&nbsp; Privacy<br />Made for the moments in between. <span>♥</span></footer></aside></div> : <div className="empty-section"><span className="empty-icon">✳</span><h2>{section === 'Bookmarks' ? 'Your saved little things' : section === 'Profile' ? 'A space that’s all yours' : 'Find your people'}</h2><p>{section === 'Bookmarks' ? 'Posts you save will be waiting here.' : section === 'Profile' ? 'Your profile is taking shape. More ways to make it yours are coming soon.' : 'Explore new conversations and find people who make your day.'}</p><button className="post-button" onClick={() => setSection('Home')}>Back to your corner ↗</button></div>}
    </main>
    {toast && <div className="toast" role="status">✳ &nbsp;{toast}</div>}
  </div>;
}

export default App;
