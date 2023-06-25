import { Router } from 'express';
import { stopJob } from '../middlewares/process'

const router = Router();

router.post('/jobs/stop', stopJob);

export default router;
