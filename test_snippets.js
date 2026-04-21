const fs = require('fs');

const html = fs.readFileSync('docs/async-javascript.html', 'utf8');
const snippets = [];
const regex = /<pre><code>([\s\S]*?)<\/code><\/pre>/g;
let match;
while ((match = regex.exec(html)) !== null) {
  let code = match[1]
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
  snippets.push(code);
}

const mocks = 
  global.window = global;
  window.fetchUser = (id, cb) => { const p = new Promise(r => setTimeout(() => r({ id: id || 1, name: 'John Doe', email: 'john@example.com' }), 10)); if(typeof cb === 'function') p.then(cb); return p; };
  window.fetchPosts = (id, cb) => { const p = new Promise(r => setTimeout(() => r([{ id: 101, title: 'Async JS is fun!', content: '...' }, { id: 102, title: 'Learn Fetch', content: '...' }]), 10)); if(typeof cb === 'function') p.then(cb); return p; };
  window.fetchComments = (id, cb) => { const p = new Promise(r => setTimeout(() => r([{ id: 201, text: 'Great post!' }]), 10)); if(typeof cb === 'function') p.then(cb); return p; };
  window.fetchReplies = (id, cb) => { const p = new Promise(r => setTimeout(() => r([{ id: 301, text: 'Thanks!' }]), 10)); if(typeof cb === 'function') p.then(cb); return p; };
  window.fetchUserData = window.fetchUser;
  window.fetchData = () => new Promise((resolve) => setTimeout(() => resolve({ data: 'Successfully fetched!' }), 10));
  window.promise = new Promise(r => setTimeout(() => r('Data fetched successfully!'), 10));
  window.getUserId = () => Promise.resolve(1);
  window.userId = 1;
  window.fetchOrders = () => Promise.resolve(['Order 1', 'Order 2']);
  window.processOrders = (o) => Promise.resolve('Processed ' + o.length + ' orders');
  window.someAsyncOperation = () => new Promise(r => setTimeout(() => r('Operation Success'), 10));
  window.showLoadingSpinner = () => {};
  window.hideLoadingSpinner = () => {};
  window.showErrorMessage = (msg) => {};
  window.processData = (d) => d;
  window.processItem = (i) => Promise.resolve(i);
  window.fetchUserStats = () => Promise.resolve({ views: 100, likes: 20 });
  window.fetchNotifications = () => Promise.resolve(['New login']);
  window.fetchMessages = () => Promise.resolve(['Hello']);
  window.fetchFriends = () => Promise.resolve(['Jane', 'Bob']);
  window.fetchSettings = () => Promise.resolve({ theme: 'dark' });
  window.displayUserProfile = (p) => {};
  window.renderDashboard = (d) => {};
  window.updateUI = (s) => {};
  
  // mock document
  window.document = {
    getElementById: (id) => ({
      style: { display: 'none' },
      textContent: ''
    })
  };
  
  // mock fetch
  window.fetch = (url) => new Promise(r => setTimeout(() => r({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ data: 'mock fetch' })
  }), 10));

;

async function runSnippets() {
  for (let i = 0; i < snippets.length; i++) {
    const code = snippets[i];
    try {
      // Create a function to evaluate code asynchronously
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const fn = new AsyncFunction(mocks + "\n" + code);
      await fn();
      console.log(\Snippet \: SUCCESS\);
    } catch (e) {
      console.log(\Snippet \: ERROR -> \\);
    }
  }
}

runSnippets();
