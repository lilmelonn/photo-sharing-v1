const BACKEND_URL = 'http://localhost:3000';

function fetchModel(url) {
  const fullUrl = `${BACKEND_URL}${url}`;
  return fetch(fullUrl, {
    credentials: 'include', // gửi cookie session
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => ({ data }));
}

export default fetchModel;