import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser";

type Feedback = {
  id: string;
  page_id: string;
  feedback_type: string;
  created_at: string;
  anonymous_user_id?: string;
  user_id?: string;
};

const GetPostFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("feed_backs")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Fetch error:", error);
          setError(error.message);
        } else {
          setFeedbacks(data ?? []);
        }
      } catch (err: any) {
        console.error("Unexpected error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;

  const trimTxt = (txt: string | undefined) => (txt ? txt.slice(0, 10) : "");

  return (
    <div>
      <h2>Feedback 全件一覧</h2>
      <div style={{ overflowX: "auto" }}>
        <table cellPadding="8" style={{ minWidth: "600px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Page ID</th>
              <th>Feedback Type</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((fb) => (
              <tr key={fb.id}>
                <td>{fb.id}</td>
                <td>
                  {fb.anonymous_user_id
                    ? trimTxt(fb.anonymous_user_id)
                    : fb.user_id}
                </td>
                <td>{fb.page_id}</td>
                <td>{renderEmoji(fb.feedback_type)}</td>
                <td>{new Date(fb.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const renderEmoji = (type: string) => {
  switch (type) {
    case "like":
      return "👍 良かった";
    case "dislike":
      return "👎 悪かった";
    case "neutral":
      return "🤔 ふつう";
    default:
      return type;
  }
};

export default GetPostFeedback;
