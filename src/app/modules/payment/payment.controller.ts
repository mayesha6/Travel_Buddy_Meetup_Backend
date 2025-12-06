import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const userId = decodedToken.userId;
  const subscriptionId = req.params.subscriptionId;
  const { amount } = req.body;

  const result = await PaymentService.createPaymentIntent(
    userId,
    subscriptionId,
    amount
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Payment intent created",
    data: result,
  });
});

const paymentSuccess = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  const result = await PaymentService.paymentSuccess(query);

  if (result.success) {
        res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
});

const paymentFail = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  const result = await PaymentService.paymentFail(query);

  if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
});

const paymentCancel = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  const result = await PaymentService.paymentCancel(query);

   if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
});

const downloadInvoice = catchAsync(async (req: Request, res: Response) => {
  const { paymentId } = req.params;
  const invoiceUrl = await PaymentService.downloadInvoice(paymentId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Invoice URL retrieved",
    data: invoiceUrl,
  });
});

const validatePayment = catchAsync(async (req: Request, res: Response) => {
  await PaymentService.validatePayment(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment validated",
    data: null,
  });
});

export const PaymentController = {
  createPaymentIntent,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  downloadInvoice,
  validatePayment,
};
