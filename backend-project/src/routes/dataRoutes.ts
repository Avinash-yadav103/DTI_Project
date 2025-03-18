import { Router } from 'express';
import DataController from '../controllers/dataController';

const router = Router();
const dataController = new DataController();

router.post('/data', dataController.saveData);
router.get('/data', dataController.getData);
router.delete('/data/:id', dataController.deleteData);

export default router;