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
    console.log("computing user")
    const cvUser = canView(allowUsers, denyUsers, [user]);
    console.log("computing group")
    const cvGroup = canView(allowGroups, denyGroups, groups);

    if (cvUser != UNKNOWN) {
      console.log("known state for user")
      return cvUser == ALLOW;
    } else if (cvGroup != UNKNOWN) {
      console.log("known state for group")
      return cvGroup == ALLOW;
    } else {
      console.log("default")
      return true;
    }
  }
};

const canView = (allow, deny, inputs) => {
  // no allow, no deny -> indeterminite
  if (!allow.length && !deny.length) { 
    console.log("no allow or deny")
    return UNKNOWN;
    // if no allow, then DENY if deny matches inputs, UNKNOWN otherwise
  } else if (!allow.length) {
    console.log("deny " + deny + " intersect " + inputs + " " + intersects(deny, inputs))
    return (intersects(deny, inputs) ? DENY : UNKNOWN);
  } else {
    // if allow provided, then inputs are required to match allow list
    console.log("allow " + allow + " intersect " + inputs + " " + intersects(allow, inputs))
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
