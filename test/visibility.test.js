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
test('explicit user allow and deny ', () => {
  expect(visibility.canViewApp({allowUsers: "joe", denyUsers: "joe,sam"}, "joe", [])).toBe(true);
});
test('deny group with allow user, not in list', () => {
  expect(visibility.canViewApp({allowUsers: "joe", denyGroups: "people"}, "fred", [])).toBe(false);
});
test('deny group with allow user, user in list', () => {
  expect(visibility.canViewApp({allowUsers: "joe", denyGroups: "people"}, "joe", [])).toBe(true);
});
test('deny group with allow user, user and group in list', () => {
  expect(visibility.canViewApp({allowUsers: "joe", denyGroups: "people"}, "joe", ["people"])).toBe(true);
});
