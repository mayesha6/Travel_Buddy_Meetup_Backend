/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import { Payment } from "./payment.model";
import { PAYMENT_STATUS, IPayment } from "./payment.interface";
import { IUser } from "../user/user.interface";
import { uploadBufferToCloudinary } from "../../config/cloudinary.config";
import { sendEmail } from "../../utils/sendEmail";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import AppError from "../../errorHelpers/AppErrors";
import { generatePdf, IInvoiceData } from "../../utils/invoice";

const createPaymentIntent = async (userId: string, subscriptionId: string, amount: number) => {
  const transactionId = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const payment = await Payment.create({
    user: userId,
    subscriptionId,
    transactionId,
    amount,
    status: PAYMENT_STATUS.UNPAID,
  });

  // Fetch user details
  const user = await Payment.findById(payment._id).populate("user", "name email phone").exec();
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  const sslPayload = {
    name: (user.user as unknown as IUser).name,
    email: (user.user as unknown as IUser).email,
    phoneNumber: (user.user as unknown as IUser).phone || "",
    address: (user.user as unknown as IUser).address || "",
    amount: payment.amount,
    transactionId: payment.transactionId,
  };

  const sslPayment = await SSLService.sslPaymentInit(sslPayload);

  return {
    paymentUrl: sslPayment.GatewayPageURL,
    transactionId: payment.transactionId,
  };
};

const paymentSuccess = async (query: Record<string, string>) => {
  const payment = await Payment.findOneAndUpdate(
    { transactionId: query.transactionId },
    { status: PAYMENT_STATUS.PAID, paymentGatewayData: query },
    { new: true }
  );

  if (!payment) throw new AppError(httpStatus.NOT_FOUND, "Payment not found");

  // Generate invoice
  const invoiceData: IInvoiceData = {
    bookingDate: payment.createdAt as Date,
    totalAmount: payment.amount,
    transactionId: payment.transactionId,
    userName: (payment.user as unknown as IUser).name,
    tourTitle: "Subscription Payment",
    guestCount: 1,
  };

  const pdfBuffer = await generatePdf(invoiceData);
  const cloudResult = await uploadBufferToCloudinary(pdfBuffer, "invoice");
  if (!cloudResult) {
  throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to upload invoice to Cloudinary");
}
  await Payment.findByIdAndUpdate(payment._id, { invoiceUrl: cloudResult.secure_url });

  await sendEmail({
    to: (payment.user as unknown as IUser).email,
    subject: "Your Payment Invoice",
    templateName: "invoice",
    templateData: invoiceData,
    attachments: [{ filename: "invoice.pdf", content: pdfBuffer, contentType: "application/pdf" }],
  });

  return { success: true, message: "Payment completed successfully" };
};

const paymentFail = async (query: Record<string, string>) => {
  await Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: PAYMENT_STATUS.FAILED, paymentGatewayData: query });
  return { success: false, message: "Payment failed" };
};

const paymentCancel = async (query: Record<string, string>) => {
  await Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: PAYMENT_STATUS.CANCELLED, paymentGatewayData: query });
  return { success: false, message: "Payment cancelled" };
};

const downloadInvoice = async (paymentId: string) => {
  const payment = await Payment.findById(paymentId).select("invoiceUrl");
  if (!payment) throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  if (!payment.invoiceUrl) throw new AppError(httpStatus.NOT_FOUND, "Invoice not found");
  return payment.invoiceUrl;
};

const validatePayment = async (body: any) => {
  return await SSLService.validatePayment(body);
};

export const PaymentService = {
  createPaymentIntent,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  downloadInvoice,
  validatePayment,
};
