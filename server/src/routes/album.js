const router = require('express').Router();
const AlbumController = require('../app/controllers/AlbumController');
const AuthoMiddleware = require('../app/middlewares/AuthMiddleware');

const { isAuth } = AuthoMiddleware;

router.get('/:id/medias', isAuth, AlbumController.getMediaOfAlbum);
router.get('/:id', isAuth, AlbumController.getAlbumById);

router.post('/', isAuth, AlbumController.createAlbum);

router.put('/:id', isAuth, AlbumController.updateAlbum);

router.delete('/:id', isAuth, AlbumController.deleteAlbum);

module.exports = router;
