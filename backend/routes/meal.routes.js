const router = require('express').Router();
const auth   = require('../middleware/auth');
const {
  listPlans, getPlan, renamePlan, toggleFavorite, deletePlan,
  generate, swap, getRecipe, getTemplates, getTemplateById, useTemplate, sharePlan, createCustom
} = require('../controllers/meal.controller');

router.use(auth);
router.get('/templates',         getTemplates);
router.get('/templates/:id',     getTemplateById);
router.post('/templates/:id',    useTemplate);
router.get('/',                  listPlans);
router.get('/:id',               getPlan);
router.put('/:id/name',          renamePlan);
router.put('/:id/favorite',      toggleFavorite);
router.delete('/:id',            deletePlan);
router.post('/:id/share',        sharePlan);
router.post('/custom',           createCustom);
router.post('/generate',         generate);
router.post('/swap',             swap);
router.post('/recipe',           getRecipe);
module.exports = router;
