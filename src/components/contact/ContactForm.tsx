import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { fetchCsrfToken, submitContactForm } from "./ContactApi";
import { ContactFormSchema } from "@/lib/contactSchema";

type Inputs = z.infer<typeof ContactFormSchema>;

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(ContactFormSchema),
  });

  const onSubmit = async (data: Inputs) => {
    try {
      const csrfToken = await fetchCsrfToken();
      await submitContactForm(data, csrfToken);
      window.location.href = "/contact/thanks";
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("予約の送信に失敗しました。");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="my-4 flex flex-col text-black max-w-2xl w-full"
    >
      {/* 以下のフォーム項目はそのままで OK。バリデーションはZod側で一括管理される */}
      {/* name */}
      <FormField
        label="お名前"
        register={register("name")}
        error={errors.name?.message}
      />

      {/* mail */}
      <FormField
        label="メールアドレス"
        register={register("mail")}
        error={errors.mail?.message}
      />

      {/* phone_number */}
      <FormField
        label="電話番号"
        register={register("phone_number")}
        error={errors.phone_number?.message}
      />

      {/* budget */}
      <FormField
        label="ご予算"
        register={register("budget")}
        error={errors.budget?.message}
      />

      {/* message */}
      <FormField
        label="お問い合わせ内容"
        register={register("message")}
        error={errors.message?.message}
        isTextArea
      />

      <p className="flex justify-center">
        <input
          type="submit"
          className="mx-auto mt-5 w-32 rounded-full bg-cyan-600 px-5 py-3 text-center text-white hover:cursor-pointer hover:bg-cyan-400"
        />
      </p>
    </form>
  );
};

export default ContactForm;

// 補助コンポーネント化して簡潔に
const FormField = ({
  label,
  register,
  error,
  isTextArea = false,
}: {
  label: string;
  register: any;
  error?: string;
  isTextArea?: boolean;
}) => (
  <div className="mb-5 w-full">
    <label className="block mb-2 font-semibold text-white">
      <i className="inline-block h-2 w-2 mr-2 rounded-full bg-red-700"></i>
      {label}
    </label>
    {isTextArea ? (
      <textarea
        {...register}
        className="w-full rounded-md p-2 px-3 bg-white"
        rows={4}
      />
    ) : (
      <input {...register} className="w-full rounded-md p-2 px-3 bg-white" />
    )}
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);
