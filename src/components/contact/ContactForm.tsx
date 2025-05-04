import { useForm, type SubmitHandler } from "react-hook-form";
import { fetchCsrfToken, submitContactForm } from "./ContactApi";

type Inputs = {
  name: string;
  mail: string;
  phone_number: string;
  budget: string;
  message: string;
};

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
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
    <div className="flex flex-col gap-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="my-4 flex flex-col gap-4 md:gap-8 text-black max-w-2xl w-full"
      >
        <div className="mb-2 flex flex-col items-center gap-4 sm:mb-0 sm:flex-row">
          <p className="flex w-full items-center gap-2 font-semibold text-white sm:w-52">
            <i className="block h-2 w-2 rounded-full bg-red-700"></i>
            <span>お名前</span>
          </p>
          <input
            {...register("name", { required: "お名前は必須項目です" })}
            className="w-full rounded-md p-2 px-3 bg-white"
          />
        </div>
        {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )}

        <div className="mb-2 flex flex-col items-center gap-4 sm:mb-0 sm:flex-row">
          <p className="flex w-full items-center gap-2 font-semibold text-white sm:w-52">
            <i className="block h-2 w-2 rounded-full bg-red-700"></i>
            <span>メールアドレス</span>
          </p>
          <input
            {...register("mail", {
              required: "メールアドレスは必須項目です",
              pattern: {
                value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                message: "正しいメールアドレスを入力してください",
              },
            })}
            className="w-full rounded-md p-2 px-3 bg-white"
          />
        </div>
        {errors.mail && (
          <span className="text-red-500">{errors.mail.message}</span>
        )}

        <div className="mb-2 flex flex-col items-center gap-4 sm:mb-0 sm:flex-row">
          <p className="flex w-full items-center gap-2 font-semibold text-white sm:w-52">
            <i className="block h-2 w-2 rounded-full bg-red-700"></i>
            <span>電話番号</span>
          </p>
          <input
            {...register("phone_number", {
              required: "電話番号は必須項目です",
            })}
            className="w-full rounded-md p-2 px-3 bg-white"
          />
        </div>
        {errors.phone_number && (
          <span className="text-red-500">{errors.phone_number.message}</span>
        )}

        <div className="mb-2 flex flex-col items-center gap-4 sm:mb-0 sm:flex-row">
          <p className="flex w-full items-center gap-2 font-semibold text-white sm:w-52">
            <i className="block h-2 w-2 rounded-full bg-red-700"></i>
            <span>ご予算</span>
          </p>
          <input
            {...register("budget", { required: "ご予算は必須項目です" })}
            className="w-full rounded-md p-2 px-3 bg-white"
          />
        </div>
        {errors.budget && (
          <span className="text-red-500">{errors.budget.message}</span>
        )}

        <div className="mb-2 flex flex-col items-center gap-4 sm:mb-0 sm:flex-row">
          <p className="flex w-full items-center gap-2 font-semibold text-white sm:w-52">
            <i className="block h-2 w-2 rounded-full bg-red-700"></i>
            <span>お問い合わせ内容</span>
          </p>
          <textarea
            {...register("message", {
              required: "お問い合わせ内容は必須項目です",
            })}
            className="w-full rounded-md p-2 px-3 bg-white"
            rows={4}
          ></textarea>
        </div>
        {errors.message && (
          <span className="text-red-500">{errors.message.message}</span>
        )}

        <p className="flex justify-center">
          <input
            type="submit"
            className="mx-auto mt-5 w-32 rounded-full bg-cyan-600 px-5 py-3 text-center text-white hover:cursor-pointer hover:bg-cyan-400"
          />
        </p>
      </form>
    </div>
  );
};

export default ContactForm;
