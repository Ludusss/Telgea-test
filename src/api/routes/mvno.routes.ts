import { Router } from 'express';
import { mvnoController } from '../controllers/mvno.controller';

const router = Router();

/**
 * @route GET /api/mvno/usage/:userId
 * @description Get normalized usage data for a user from MVNO provider
 * @access Private
 */
router
  .route('/usage/:userId')
  .get(mvnoController.getNormalizedUsageData);

/**
 * @route GET /api/mvno/sms/:userId
 * @description Get normalized SMS charging data for a user from MVNO provider
 * @access Private
 */
router
  .route('/sms/:userId')
  .get(mvnoController.getNormalizedSmsData);

/**
 * @route GET /api/mvno/aggregated/:userId
 * @description Get combined normalized data for a user from MVNO provider
 * @access Private
 */
router
  .route('/aggregated/:userId')
  .get(mvnoController.getAggregatedUserData);

export default router;
