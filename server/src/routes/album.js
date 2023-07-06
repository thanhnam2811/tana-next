const router = require('express').Router();
const AlbumController = require('../app/controllers/AlbumController');
const AuthoMiddleware = require('../app/middlewares/AuthMiddleware');

const { isAuth } = AuthoMiddleware;
const { getUserFromToken } = AuthoMiddleware;

router.get('/:id/medias', getUserFromToken, AlbumController.getMediaOfAlbum);
router.get('/:id', getUserFromToken, AlbumController.getAlbumById);

router.post('/:id/medias', isAuth, AlbumController.addMediaToAlbum);
router.post('/', isAuth, AlbumController.createAlbum);

router.put('/:id/medias/:mid', isAuth, AlbumController.updateItemMediaOfAlbum);
router.put('/:id', isAuth, AlbumController.updateAlbum);

router.delete('/:id/medias/:mid', isAuth, AlbumController.deleteItemMediaOfAlbum);
router.delete('/:id', isAuth, AlbumController.deleteAlbum);

module.exports = router;
