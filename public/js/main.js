import { API } from './api.js';

const state = { user:null, posts:[], users:[], view:'landing', profile:null };

const root = document.getElementById('app');
init();

async function init() {
  const auth = await API.me();
  state.user = auth?.user || null;
  if (state.user) {
    state.view = 'feed';
    await Promise.all([loadPosts(), loadUsers()]);
  }
  render();
}

async function loadPosts(){ state.posts = await API.getPosts(); }
async function loadUsers(){ state.users = await API.getUsers(); }

function render(){
  if(!state.user && state.view==='landing'){ root.innerHTML = landing(); bindLanding(); return; }
  if(!state.user){ root.innerHTML = auth(); bindAuth(); return; }
  root.innerHTML = appLayout();
  bindApp();
}

function landing(){return `<main class="center"><section class="card hero"><h1>Post</h1><p>Share updates in a clean, simple feed.</p><div class="stack"><button id="go-signin" class="btn">Sign in</button><button id="go-signup" class="btn btn-secondary">Sign up</button><button id="go-guest" class="btn btn-ghost">Continue as guest</button></div></section></main>`}
function auth(){return `<main class="center"><section class="card"><h2 id="auth-title">${state.view==='signup'?'Create account':'Welcome back'}</h2><form id="auth-form"><input id="username" placeholder="Username" required/><input id="password" placeholder="Password" type="password" required/><button class="btn" type="submit">${state.view==='signup'?'Sign up':'Sign in'}</button></form><button id="switch-auth" class="link">${state.view==='signup'?'Already have an account? Sign in':'Need an account? Sign up'}</button><button id="guest-login" class="btn btn-ghost">Continue as guest</button><p id="msg"></p></section></main>`}
function appLayout(){return `<div class="shell"><aside><h2>Post</h2><nav><button data-v="feed">Home</button><button data-v="profiles">Profiles</button><button data-v="me">My Profile</button></nav><button id="logout" class="btn btn-ghost">Logout</button></aside><main><header><h3>${title()}</h3></header>${mainView()}</main></div>`}
function title(){return state.view==='profiles'?'Profiles':state.view==='me'?'My Profile':'Home'}
function mainView(){
  if(state.view==='profiles') return `<input id="user-search" placeholder="Search users"/>`+state.users.map(u=>`<article class="post"><b>${u.username}</b><button data-user="${u.id}" class="link">View profile</button></article>`).join('');
  if(state.view==='me') return profileView(state.user.id);
  if(state.view==='profile'&&state.profile) return profileDetail();
  return `<section class="composer"><form id="post-form"><textarea id="post-content" maxlength="280" placeholder="What’s happening?"></textarea><button class="btn" type="submit">Post</button></form></section>` + feed();
}
function feed(){ return state.posts.map(postCard).join(''); }
function postCard(p){return `<article class="post"><div><b>${p.username}</b> · ${new Date(p.created_at).toLocaleDateString()}</div><p>${p.content}</p><button data-like="${p.id}" class="link">❤ ${p.likes_count}</button></article>`}
function profileView(id){
  const posts = state.posts.filter(p=>p.user_id===id);
  return `<section class="card"><h4>${state.user.username}</h4><p>${posts.length} posts</p></section>${posts.map(postCard).join('')}`;
}
function profileDetail(){
  return `<section class="card"><h4>${state.profile.username}</h4><p>${state.profile.posts_count} posts</p></section>${state.profile.posts.map(postCard).join('')}`;
}

function bindLanding(){
  document.getElementById('go-signin').onclick=()=>{state.view='signin';render();};
  document.getElementById('go-signup').onclick=()=>{state.view='signup';render();};
  document.getElementById('go-guest').onclick=guestLogin;
}
function bindAuth(){
  document.getElementById('switch-auth').onclick=()=>{state.view = state.view==='signup'?'signin':'signup'; render();};
  document.getElementById('guest-login').onclick=guestLogin;
  document.getElementById('auth-form').onsubmit=async(e)=>{e.preventDefault();
    const u=username.value.trim(), p=password.value;
    const res = state.view==='signup' ? await API.register(u,p) : await API.login(u,p);
    if(res.error){msg.textContent=res.error; return;}
    state.user=res.user; state.view='feed'; await Promise.all([loadPosts(), loadUsers()]); render();
  };
}
async function guestLogin(){ const res = await API.guestLogin(); if(res.user){ state.user=res.user; state.view='feed'; await Promise.all([loadPosts(), loadUsers()]); render(); } }
function bindApp(){
  document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{state.view=b.dataset.v; render();});
  document.getElementById('logout').onclick=async()=>{await API.logout(); state.user=null; state.view='landing'; render();};
  document.getElementById('post-form')?.addEventListener('submit', async(e)=>{e.preventDefault(); const v=document.getElementById('post-content').value.trim(); if(!v) return; const res=await API.createPost(v); if(!res.error){await loadPosts(); render();}});
  document.querySelectorAll('[data-like]').forEach(b=>b.onclick=async()=>{await API.toggleLike(b.dataset.like); await loadPosts(); render();});
  document.querySelectorAll('[data-user]').forEach(b=>b.onclick=async()=>{state.profile=await API.getUser(b.dataset.user); state.view='profile'; render();});
  document.getElementById('user-search')?.addEventListener('input', async(e)=>{state.users=await API.getUsers(e.target.value); render();});
}
