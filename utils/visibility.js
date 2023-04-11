const UNKNOWN = 1;
const ALLOW = 2;
const DENY= 3;

const canViewApp = (app, user, groups) => {
  const allowUsers = app.allowUsers?.split(",") || []
  const denyUsers = app.denyUsers?.split(",") || []
  const allowGroups = app.allowGroups?.split(",") || []
  const denyGroups = app.denyGroups?.split(",") || []

  const hasUserAcl = !!allowUsers.length || !!denyUsers.length
  const hasGroupAcl = !!allowGroups.length || !!denyGroups.length

  // group allowed, user denied -> denied
  // group denied, user allowed -> allowed

  if (!hasUserAcl && !hasGroupAcl) {
    return true;
  } else {
    const cvUser = canView(allowUsers, denyUsers, [user]);
    const cvGroup = canView(allowGroups, denyGroups, groups);

    if (cvUser != UNKNOWN) {
      return cvUser == ALLOW;
    } else if (cvGroup != UNKNOWN) {
      return cvGroup == ALLOW;
    } else {
      return true;
    }
  }
};

const canView = (allow, deny, inputs) => {
  // no allow, no deny -> indeterminite
  if (!allow.length && !deny.length) { 
    return UNKNOWN;
    // if no allow, then DENY if deny matches inputs, UNKNOWN otherwise
  } else if (!allow) {
    return (intersects(deny, inputs) ? DENY : UNKNOWN);
  } else {
    // if allow provided, then inputs are required to match allow list
    return (intersects(allow, inputs) ? ALLOW : DENY);
  }
}

// expects bs to be smaller, expects both to exist
const intersects = (as, bs) => {
  console.log(as)
  console.log(bs)
  for (const b of bs) {
    if (as.includes(b)) {
      return true;
    }
  }
  return false;
}

module.exports = {
  canViewApp
};
