-- テーブル自体は既にある前提なので、不要カラム削除
ALTER TABLE feed_backs DROP COLUMN IF EXISTS anonymous_ip_hash;

-- 一意インデックス追加
CREATE UNIQUE INDEX IF NOT EXISTS uniq_feedback_user
  ON feed_backs (user_id, page_id)
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uniq_feedback_anon
  ON feed_backs (anonymous_user_id, page_id)
  WHERE anonymous_user_id IS NOT NULL;

-- updated_at自動更新トリガ定義
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_updated_at ON feed_backs;

CREATE TRIGGER trg_set_updated_at
  BEFORE UPDATE ON feed_backs
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
