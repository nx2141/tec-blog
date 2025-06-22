import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase/browser";

type Props = { pageId: string };

export default function FeedbackButtons({ pageId }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [selected, setSelected] = useState<
    "like" | "dislike" | "neutral" | null
  >(null);
  const [disabled, setDisabled] = useState<boolean>(false);

  const getIdentifiers = async () => {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id || null;

    let anonymousUserId: string | null = null;
    if (!userId) {
      anonymousUserId = Cookies.get("anonymous_user_id") || null;
      if (!anonymousUserId) {
        anonymousUserId = uuidv4();
        Cookies.set("anonymous_user_id", anonymousUserId, { expires: 365 });
      }
    }

    return { userId, anonymousUserId };
  };

  useEffect(() => {
    (async () => {
      const { userId, anonymousUserId } = await getIdentifiers();

      let query = supabase
        .from("feed_backs")
        .select("feedback_type")
        .eq("page_id", pageId);
      if (userId) query = query.eq("user_id", userId);
      else if (anonymousUserId)
        query = query.eq("anonymous_user_id", anonymousUserId);

      const { data, error } = await query.maybeSingle();
      if (data?.feedback_type) {
        setSelected(data.feedback_type);
        setDisabled(true);
      }
    })();
  }, [pageId]);

  const handleClick = async (type: "like" | "dislike" | "neutral") => {
    if (loading || disabled) return;
    setLoading(type);

    const { userId, anonymousUserId } = await getIdentifiers();

    const payload: Record<string, any> = {
      page_id: pageId,
      feedback_type: type,
    };
    if (userId) payload.user_id = userId;
    if (anonymousUserId) payload.anonymous_user_id = anonymousUserId;

    const { error } = await supabase.from("feed_backs").insert(payload);
    if (!error) {
      setSelected(type);
      setDisabled(true);
    }
    setLoading(null);
  };

  const btnStyle = (t: string) =>
    `px-4 py-2 rounded border border-slate-600 hover:cursor-pointer transition-colors ${
      selected === t ? "bg-white text-black" : "bg-slate-700 text-white"
    } ${loading || disabled ? "opacity-50 pointer-events-none" : "hover:opacity-80"}`;

  return (
    <>
      <p className="my-8 border-t text-sm border-slate-600 pt-8">
        この記事の内容を評価していただけますと幸いです。
      </p>
      <div className="flex gap-4">
        <button
          className={btnStyle("like")}
          onClick={() => handleClick("like")}
        >
          👍 良かった
        </button>
        <button
          className={btnStyle("dislike")}
          onClick={() => handleClick("dislike")}
        >
          👎 悪かった
        </button>
        <button
          className={btnStyle("neutral")}
          onClick={() => handleClick("neutral")}
        >
          🤔 ふつう
        </button>
      </div>
      {selected && (
        <p className="text-sm mt-2">
          フィードバック送信済み：ありがとうございます！
        </p>
      )}
    </>
  );
}
