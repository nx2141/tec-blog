import { z } from "zod";

const requiredMsg = "入力内容をご確認ください";

export const ContactFormSchema = z.object({
  name: z
    .string({ required_error: requiredMsg })
    .min(3, { message: requiredMsg })
    .max(50, { message: requiredMsg })
    .refine((val) => val.trim().length > 0, {
      message: "お名前を入力してください",
    }),

  mail: z
    .string({ required_error: requiredMsg })
    .email("正しいメールアドレスを入力してください"),

  phone_number: z
    .string({ required_error: requiredMsg })
    .min(10, { message: requiredMsg })
    .max(15, { message: requiredMsg })
    .regex(/^\d+$/, "正しい電話番号を入力してください"),

  budget: z
    .string({ required_error: requiredMsg })
    .min(3, { message: requiredMsg })
    .max(30, { message: requiredMsg })
    .refine((val) => val.trim().length > 0, {
      message: "ご予算を入力してください",
    }),

  message: z
    .string({ required_error: requiredMsg })
    .min(3, { message: requiredMsg })
    .max(1000, { message: requiredMsg })
    .refine((val) => val.trim().length > 0, {
      message: "お問い合わせ内容を入力してください",
    }),
});
