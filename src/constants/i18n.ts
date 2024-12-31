export type Language = 'ja' | 'en';

interface TranslationStrings {
  ja: string;
  en: string;
  [key: string]: string;  // インデックスシグネチャを追加
}

const createTranslation = (ja: string, en: string): TranslationStrings => ({
  ja,
  en
});

export const COMMON = {
  CLOSE: createTranslation('閉じる', 'Close'),
  LOADING: createTranslation('読み込み中...', 'Loading...'),
  RETURN_TO_TOP: createTranslation('TOPに戻る', 'Return to TOP'),
  ERROR: {
    GENERAL: createTranslation('エラーが発生しました', 'An error occurred'),
    INVALID_DATA: createTranslation('データの形式が不正です', 'Invalid data format'),
    LOAD_FAILED: createTranslation('データの読み込みに失敗しました', 'Failed to load data'),
    CANCEL_FAILED: createTranslation('キャンセルに失敗しました', 'Failed to cancel matching')
  }
} as const;

export const MAP = {
  SELECT_MARKER: createTranslation('マーカーを選択してください', 'Please select a marker'),
  MAPBOX_TOKEN_REQUIRED: createTranslation('Mapboxのアクセストークンが必要です', 'Mapbox access token is required')
} as const;

export const TOILET = {
  BATTLE: {
    BUTTON: createTranslation('このトイレで戦闘する', 'Battle using this toilet'),
    MATCHED: createTranslation('マッチングしました！', 'Matched!'),
    BATTLE_STARTS: createTranslation('対戦開始まで...', 'Battle starts in...'),
    YOUR_LOCATION: createTranslation('あなたの場所', 'Your Location'),
    OPPONENT_LOCATION: createTranslation('対戦相手の場所', 'Opponent Location'),
    SEARCHING: createTranslation('対戦相手を探しています... しばらくお待ちください...', 'Looking for an opponent... Please wait for seconds'),
    VICTORY: createTranslation('勝利！', 'Victory!'),
    DEFEAT: createTranslation('敗北...', 'Defeat...'),
    CONGRATULATIONS: createTranslation('おめでとうございます！あなたの勝利です！', 'Congratulations! You are the winner!'),
    TRY_AGAIN: createTranslation('残念...次は勝利を掴みましょう！', 'Too bad... Better luck next time!')
  },
  STATS: {
    ATTACK: createTranslation('攻撃力', 'Attack'),
    DEFENSE: createTranslation('防御力', 'Defense'),
    CLEANLINESS: createTranslation('清潔レベル', 'Cleanliness Level'),
    LOCATION: createTranslation('立地レベル', 'Location Level'),
    CROWDING: createTranslation('混雑レベル', 'Crowding Level'),
    TOILET_COUNT: createTranslation('便器数レベル', 'Toilet Count Level'),
    UNIQUENESS: createTranslation('ユニークレベル', 'Uniqueness Level'),
    DETAILS: createTranslation('詳細情報', 'Details')
  }
} as const;

export const PWA = {
  INSTALL: {
    TITLE: createTranslation('アプリをインストール', 'Install App'),
    DESCRIPTION: createTranslation('ホーム画面に追加して、より快適にご利用いただけます。', 'Add to home screen for a better experience.'),
    BUTTON: createTranslation('インストール', 'Install'),
    LATER: createTranslation('後で', 'Later'),
    STEPS: {
      TITLE: createTranslation('インストール手順', 'Installation Steps'),
      SHARE: createTranslation('ブラウザのメニューボタン（共有ボタン）をタップ', 'Tap the browser menu (share) button'),
      ADD: createTranslation('下にスクロールして「ホーム画面に追加」をタップ', 'Scroll down and tap "Add to Home Screen"'),
      CONFIRM: createTranslation('右上の「追加」をタップ', 'Tap "Add" in the top right'),
      GOT_IT: createTranslation('了解', 'Got it')
    }
  }
} as const;

export const PC = {
  TITLE: createTranslation('トイレスマッシュはスマートフォン専用です', 'Toilet Smash is a Mobile-Only Application'),
  DESCRIPTION: createTranslation('より良い体験のため、スマートフォンからアクセスしてください。', 'Please access from your smartphone for the best experience.'),
  QR_CODE: createTranslation('アクセス用QRコード', 'Access QR Code'),
  HOW_TO_ACCESS: createTranslation('アクセス方法', 'How to Access'),
  STEP_CAMERA: createTranslation('スマートフォンのカメラを起動', 'Open your smartphone camera'),
  STEP_SCAN: createTranslation('QRコードを読み取り', 'Scan the QR code'),
  STEP_ACCESS: createTranslation('表示されたリンクをタップしてアプリにアクセス', 'Tap the link that appears to access the app'),
  QR_TITLE: createTranslation('アクセス用QRコード', 'Access QR Code')
} as const;