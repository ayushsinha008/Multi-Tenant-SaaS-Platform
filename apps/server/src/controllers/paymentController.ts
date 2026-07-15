import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { Organization } from '../models/Organization';
import { ActivityLogService } from '../services/ActivityLogService';

export const generateHash = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY || '';
    const PAYU_MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT || '';
    const { amount, productinfo, firstname, email, phone, udf1 } = req.body;
    
    // Generate unique transaction ID
    const txnid = 'txn' + Math.round(new Date().getTime() / 1000) + Math.floor(Math.random() * 100);

    // sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt)
    // We send organization ID in udf1
    const hashString = `${PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1 || ''}||||||||||${PAYU_MERCHANT_SALT}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    res.status(200).json({
      key: PAYU_MERCHANT_KEY,
      txnid,
      hash,
      surl: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/payu/success`,
      furl: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/payu/failure`,
    });
  } catch (error) {
    next(error);
  }
};

export const paymentSuccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const PAYU_MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT || '';
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
    const { txnid, amount, productinfo, firstname, email, status, hash, key, udf1 } = req.body;

    // Verify hash
    // Reverse hash formula: sha512(salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
    const reverseHashString = `${PAYU_MERCHANT_SALT}|${status}||||||||||${udf1 || ''}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
    const generatedHash = crypto.createHash('sha512').update(reverseHashString).digest('hex');

    if (hash !== generatedHash) {
      // Hash mismatch, invalid transaction
      return res.redirect(`${FRONTEND_URL}/dashboard/settings?payment=hash_mismatch`);
    }

    // Determine the plan based on productinfo
    let newPlan = 'FREE';
    if (productinfo === 'PRO_PLAN') newPlan = 'PRO';
    else if (productinfo === 'BUSINESS_PLAN') newPlan = 'BUSINESS';

    let orgIdToUpdate = udf1;
    if (!orgIdToUpdate) {
      return res.redirect(`${FRONTEND_URL}/dashboard/settings?payment=invalid_org`);
    }

    const org = await Organization.findById(orgIdToUpdate);
    if (!org) {
      return res.redirect(`${FRONTEND_URL}/dashboard/settings?payment=org_not_found`);
    }

    org.plan = newPlan as any;
    org.billingCycle = 'MONTHLY'; // default for this implementation
    await org.save();

    await ActivityLogService.log({
      organizationId: orgIdToUpdate,
      userId: org.ownerId, 
      action: 'UPDATE_WORKSPACE',
      entityType: 'Organization',
      entityId: orgIdToUpdate,
      details: { details: `Upgraded to ${newPlan} plan via PayU` },
      req
    });

    res.redirect(`${FRONTEND_URL}/dashboard/settings?payment=success&plan=${newPlan}`);
  } catch (error) {
    console.error('Payment success error:', error);
    res.redirect(`${FRONTEND_URL}/dashboard/settings?payment=error`);
  }
};

export const paymentFailure = async (req: Request, res: Response, next: NextFunction) => {
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.redirect(`${FRONTEND_URL}/dashboard/settings?payment=failure`);
};
