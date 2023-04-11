const asyncWrapper = require('../../middleware/asyncWrapper');
const Category = require('../../models/Category');
const App = require('../../models/App');
const Bookmark = require('../../models/Bookmark');
const { Sequelize } = require('sequelize');
const loadConfig = require('../../utils/loadConfig');
const initIntegrationsApps = require('../../utils/init/initIntegrationsApps');
const visibility = require('../../utils/visibility');

// @desc      Get all categories
// @route     GET /api/categories
// @access    Public
const getAllCategories = asyncWrapper(async (req, res, next) => {
  const { useOrdering: orderType } = await loadConfig();

  // Load apps to create/update apps from integrations (Docker, Kubernetes, etc.)
  await initIntegrationsApps();

  let categories;
  let output;

  // categories visibility
  const where = req.isAuthenticated ? {} : { isPublic: true };

  const order =
    orderType == 'name'
      ? [
          [Sequelize.fn('lower', Sequelize.col('Category.name')), 'ASC'],
          [Sequelize.fn('lower', Sequelize.col('apps.name')), 'ASC'],
          [Sequelize.fn('lower', Sequelize.col('bookmarks.name')), 'ASC'],
        ]
      : [
          [orderType, 'ASC'],
          [{ model: App, as: 'apps' }, orderType, 'ASC'],
          [{ model: Bookmark, as: 'bookmarks' }, orderType, 'ASC'],
        ];

  categories = await Category.findAll({
    include: [
      {
        model: App,
        as: 'apps',
      },
      {
        model: Bookmark,
        as: 'bookmarks',
      },
    ],
    order,
    where,
  });

  let appsPredicate;
  let bookmarksPredicate;
  if (req.isAuthenticated) {
    appsPredicate = (app) => visibility.canViewApp(app, req.rpUser, req.rpGroups);
    bookmarksPredicate = (b) => b;
  } else {
    appsPredicate = (b) => b.isPublic;
    bookmarksPredicate = (b) => b.isPublic;
  }

  output = categories.map((c) => c.get({ plain: true }));
  output = output.map((c) => ({
    ...c,
    apps: c.apps.filter(appsPredicate),
    bookmarks: c.bookmarks.filter(bookmarksPredicate),
  }));

  res.status(200).json({
    success: true,
    data: output,
  });
});

module.exports = getAllCategories;
