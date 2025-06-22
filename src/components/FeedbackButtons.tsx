import React, { useState } from "react";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase/browser";

type Props = { pageId: string };

export default function FeedbackButtons({ pageId }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [selected, setSelected] = useState<
    "like" | "dislike" | "neutral" | null
  >(null);

  const handleClick = async (type: "like" | "dislike" | "neutral") => {
    if (loading) return;
    setLoading(type);

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

    const { error } = await supabase.functions.invoke("submit-feedback", {
      body: {
        page_id: pageId,
        feedback_type: type,
        user_id: userId,
        anonymous_user_id: anonymousUserId,
      },
    });

    if (!error) setSelected(type);
    setLoading(null);
  };

  const btnStyle = (t: string) =>
    `px-4 py-2 rounded border ${selected === t ? "bg-gray-900 text-white" : "bg-white"} ${
      loading === t ? "opacity-50 pointer-events-none" : ""
    }`;

  return (
    <div className="flex gap-4">
      <button className={btnStyle("like")} onClick={() => handleClick("like")}>
        👍 Like
      </button>
      <button
        className={btnStyle("dislike")}
        onClick={() => handleClick("dislike")}
      >
        👎 Dislike
      </button>
      <button
        className={btnStyle("neutral")}
        onClick={() => handleClick("neutral")}
      >
        🤔 Neutral
      </button>
    </div>
  );
}
