const dotenv = require('dotenv');
dotenv.config();

// 환경 변수 처리 함수
const processEnvValue = (value) => {
  if (!value) return '';
  // 값이 존재하는지 확인하고 로그 출력
  console.log(`환경 변수 로드: ${value.substring(0, 3)}... (값 일부만 표시)`);
  return value;
};

module.exports = {
  "expo": {
    "name": "PragChat",
    "slug": "PragChat",
    "version": "1.0.0",
    "owner": "onceart",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.pragchat.app",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      // 환경 변수를 안전하게 저장
      "SUPABASE_URL": processEnvValue(process.env.SUPABASE_URL),
      "SUPABASE_ANON_KEY": processEnvValue(process.env.SUPABASE_ANON_KEY),
      "REQUESTY_LLM_API_KEY": processEnvValue(process.env.REQUESTY_LLM_API_KEY),
      "REQUESTY_BASE_URL": processEnvValue(process.env.REQUESTY_BASE_URL),
      "REQUESTY_MODEL": processEnvValue(process.env.REQUESTY_MODEL),
      "APP_ENV": process.env.APP_ENV || "development",
      "DEBUG_MODE": process.env.DEBUG_MODE || "true",
      // EAS 프로젝트 ID
      "eas": {
        "projectId": "7584fb54-a32c-4826-86fb-02fff6ae6ed1"
      }
    }
  }
};