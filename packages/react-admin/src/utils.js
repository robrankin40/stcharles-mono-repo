export const generateInviteCode = (
  length = 12,
  characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
) => {
  const inviteCode = [];
  for (let i = 0; i < length; i += 1) {
    const rand = Math.floor(Math.random()*characters.length);
    inviteCode.push(characters[rand]);
  }
  return inviteCode.join('');
}