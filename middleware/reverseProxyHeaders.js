const reverseProxyHeaders = (req, res, next) => {

  const userHeaderName = process.env.FLAME_RP_USER_HEADER || 'Remote-User'
  const groupHeaderName = process.env.FLAME_RP_GROUPS_HEADER || 'Remote-Groups'
  const groupSep = process.env.FLAME_RP_GROUPS_SEPARATOR || ','

  const user = req.header(userHeaderName.toLowerCase())
  const groups = req.header(groupHeaderName.toLowerCase())

  req.rpUser = user
  req.rpGroups = (!!groups ? groups.split(groupSep) : groups)

  next();
};

module.exports = reverseProxyHeaders;

