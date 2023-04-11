const visibility = require('../utils/visibility');

test('explicit user allow, on list', () => {
  expect(visibility.canViewApp({allowUsers: "joe,sam"}, "joe", [])).toBe(true);
});
test('explicit user allow, not on list', () => {
  expect(visibility.canViewApp({allowUsers: "joe,sam"}, "fred", [])).toBe(false);
});
test('explicit user deny, on list', () => {
  expect(visibility.canViewApp({denyUsers: "joe,sam"}, "joe", [])).toBe(false);
});
test('explicit user deny, not on list', () => {
  expect(visibility.canViewApp({denyUsers: "joe,sam"}, "fred", [])).toBe(true);
});
