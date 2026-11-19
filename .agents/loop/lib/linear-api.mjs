const API = 'https://api.linear.app/graphql';

export async function linearGraphql(token, query, variables = {}) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Linear API ${res.status}: ${await res.text()}`);
  const body = await res.json();
  if (body.errors) throw new Error(`Linear API: ${JSON.stringify(body.errors)}`);
  return body.data;
}
