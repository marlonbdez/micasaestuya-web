export function deepMerge(a: any, b: any) {
  if (Array.isArray(a)) {
    return [...a, ...b]
  }

  if (typeof a === 'string') {
    throw new TypeError('Cannot merge strings')
  }
  return Object.assign(a, b)
}

export function greeting(name: string) {
  console.log(`Hello ${name}`)
}

export async function getPostBody() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1')
  const json = await response.json()
  return json.body
}
