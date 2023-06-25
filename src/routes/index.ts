import { Router } from 'express';
import v1Router from './v1.0';
import { response } from '../middlewares/utils/response';

const router = Router();

router.use('/v1.0', v1Router, response);

export default router;
