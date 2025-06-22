-- フィードバックテーブル
CREATE TABLE feed_backs (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  anonymous_user_id UUID,
  anonymous_ip_hash VARCHAR(255),
  page_id VARCHAR(255) NOT NULL,
  feedback_type feedback_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TYPE feedback_type AS ENUM ('like', 'dislike', 'neutral');