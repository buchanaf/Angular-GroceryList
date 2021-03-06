import express from 'express';
import * as FoodAPI from './food';
import * as ListAPI from './list';
import * as AuthAPI from './auth';
import path from 'path';
import passport from 'passport';

const router = express.Router();//eslint-disable-line

router.route('/api/user')
  .get(AuthAPI.currentUser);

router.route('/api/food')
  .get(FoodAPI.foodQuery)
  .post(FoodAPI.addToList);

router.route('/api/list')
  .get(ListAPI.getUserLists)
  .post(ListAPI.addNewList)
  .delete(ListAPI.deleteList)
  .put(ListAPI.updateList);

router.route('/api/list_relations')
  .put(ListAPI.updateFoodRelations);

router.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email', 'user_location'] }));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }), (req, res) => {
    res.redirect(req.session.returnTo || '/');
  });


router.use('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../index.html'));
});

export default router;
