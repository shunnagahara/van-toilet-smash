from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from geoalchemy2.functions import ST_MakePoint

# モデルをインポート
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from app.database import Base
from app.models.database import DBLocation, DBImage, DBLocalizedInfo

# データベース接続設定
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/toiletsmash")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    # テーブルの作成
    Base.metadata.create_all(bind=engine)
    
    # セッションの作成
    db = SessionLocal()
    
    try:
        # 既存データの確認
        if db.query(DBLocation).first():
            print("Database already contains data. Skipping initialization.")
            return

        # 初期データ
        initial_data = [
            {
                "latitude": 49.2827,
                "longitude": -123.1067,
                "rating": 4.2,
                "is_open": True,
                "images": [
                    {
                        "id": "1",
                        "url": "https://tgoysscvgojhzejawwpj.supabase.co/storage/v1/object/public/toilet-images/images.jpeg",
                        "created_at": datetime.now()
                    },
                    {
                        "id": "2",
                        "url": "https://tgoysscvgojhzejawwpj.supabase.co/storage/v1/object/public/toilet-images/8f3e39adc40efd3b6234a7b3ce7c21977447f8e2.jpg",
                        "created_at": datetime.now()
                    }
                ],
                "ja": {
                    "name": "ガスタウン公共トイレ",
                    "description": "Historic Gastown地区の公衆トイレ。24時間利用可能。"
                },
                "en": {
                    "name": "Gastown Public Toilet",
                    "description": "Public restrooms in the Historic Gastown area, available 24 hours a day."
                }
            },
            {
                "latitude": 49.2754,
                "longitude": -123.1216,
                "rating": 4.5,
                "is_open": True,
                "images": [],
                "ja": {
                    "name": "イエールタウン・コミュニティセンター",
                    "description": "コミュニティセンター内の清潔なトイレ施設。センター開館時間内であれば誰でも利用可能です。"
                },
                "en": {
                    "name": "Yaletown Community Center",
                    "description": "Clean restroom facilities inside the community center. Open to public during center hours."
                }
            },
            {
                "latitude": 49.2897,
                "longitude": -123.1226,
                "rating": 3.8,
                "is_open": True,
                "images": [],
                "ja": {
                    "name": "コールハーバー休憩所",
                    "description": "シーウォール沿いの公共トイレ。観光スポット周辺の便利な場所にあり、きれいに管理されています。"
                },
                "en": {
                    "name": "Coal Harbour Rest Area",
                    "description": "Public restroom along the seawall. Conveniently located near tourist attractions and well-maintained."
                }
            }
        ]

        # データの挿入
        for data in initial_data:
            # ロケーションの作成
            location = DBLocation(
                latitude=data["latitude"],
                longitude=data["longitude"],
                rating=data["rating"],
                is_open=data["is_open"],
                position=ST_MakePoint(data["longitude"], data["latitude"])
            )
            db.add(location)
            db.flush()  # IDを取得するためにflush

            # 画像の追加
            for img in data["images"]:
                db_image = DBImage(
                    id=img["id"],
                    url=img["url"],
                    created_at=img["created_at"],
                    location_id=location.id
                )
                db.add(db_image)

            # 多言語情報の追加
            ja_info = DBLocalizedInfo(
                location_id=location.id,
                language="ja",
                name=data["ja"]["name"],
                description=data["ja"]["description"]
            )
            en_info = DBLocalizedInfo(
                location_id=location.id,
                language="en",
                name=data["en"]["name"],
                description=data["en"]["description"]
            )
            db.add(ja_info)
            db.add(en_info)

        # コミット
        db.commit()
        print("Database initialized successfully!")

    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("Starting database initialization...")
    init_db()