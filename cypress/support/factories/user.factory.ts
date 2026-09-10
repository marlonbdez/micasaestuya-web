export function buildNewUser(): SignUpUser {
  const timestamp = Date.now()

  return {
    firstName: 'Test',
    lastName: 'User',
    email: `test+${timestamp}@example.com`,
    password: 'Password123!'
  }
}
