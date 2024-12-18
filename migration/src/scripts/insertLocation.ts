import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { dirname } from 'path';

// ESMでの__dirnameの代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数の読み込み
config();

// 型定義
interface LocalizedInfo {
  language: 'ja' | 'en';
  name: string;
  description: string;
  address: string;
}

interface LocationImage {
  url: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  attack_power: number;
  defense_power: number;
  cleanliness_level: number;
  location_level: number;
  crowding_level: number;
  toilet_count_level: number;
  uniqueness_level: number;
  fighter_pic: string;
  localized_info: LocalizedInfo[];
  images: LocationImage[];
}

interface LocationsFile {
  locations: LocationData[];
}

// Supabaseクライアントの初期化（サービスロールを使用）
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // サービスロールキーを使用
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function insertLocation() {
  try {
    // JSONファイルからデータを読み込む
    const dataPath = path.join(process.cwd(), 'data', 'locations.json');
    const rawData = await fs.readFile(dataPath, 'utf8');
    const data = JSON.parse(rawData) as LocationsFile;
    
    if (!data.locations || !Array.isArray(data.locations)) {
      throw new Error('Invalid locations data format');
    }

    console.log(`${data.locations.length}件のロケーションが見つかりました`);

    for (const [index, location] of data.locations.entries()) {
      try {
        console.log(`ロケーション ${index + 1}/${data.locations.length} を処理中...`);

        // 1. ロケーションデータの挿入
        const { data: locationData, error: locationError } = await supabase
          .from('locations')
          .insert([
            {
              latitude: location.latitude,
              longitude: location.longitude,
              attack_power: location.attack_power,
              defense_power: location.defense_power,
              cleanliness_level: location.cleanliness_level,
              location_level: location.location_level,
              crowding_level: location.crowding_level,
              toilet_count_level: location.toilet_count_level,
              uniqueness_level: location.uniqueness_level,
              fighter_pic: location.fighter_pic,
            }
          ])
          .select()
          .single();

        if (locationError) {
          throw new Error(`ロケーションの挿入エラー: ${locationError.message}`);
        }

        // 2. ローカライズ情報の挿入
        console.log(`ロケーション ${locationData.id} のローカライズ情報を挿入中...`);
        const localizedInfoPromises = location.localized_info.map(info =>
          supabase
            .from('localized_info')
            .insert([
              {
                location_id: locationData.id,
                language: info.language,
                name: info.name,
                description: info.description,
                address: info.address,
              }
            ])
        );

        await Promise.all(localizedInfoPromises);

        // 3. 画像の挿入
        console.log(`ロケーション ${locationData.id} の画像 ${location.images.length} 件を挿入中...`);
        const imagePromises = location.images.map(image =>
          supabase
            .from('images')
            .insert([
              {
                location_id: locationData.id,
                url: image.url,
              }
            ])
        );

        await Promise.all(imagePromises);

        console.log(`ロケーション ${index + 1} をID: ${locationData.id} で正常に挿入しました`);
      } catch (error) {
        console.error(`ロケーション ${index + 1} の処理中にエラーが発生:`, error);
        // プロセス全体を停止せず、次のロケーションの処理を継続
        continue;
      }
    }

    console.log('全てのロケーションの処理が完了しました');
  } catch (error) {
    console.error('ロケーションファイルの読み込みまたは解析エラー:', error);
    process.exit(1);
  }
}

// スクリプトの実行
insertLocation();