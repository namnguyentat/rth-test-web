const config = {
  development: {
    environment: 'development',
    apiUrl:
      process.env.TEST === 1 ? 'http://api:33666' : 'http://localhost:3001',
    facebook: {
      appId: '318259078653854'
    },
    google: {
      appId:
        '965079709107-me02b25bmsnr7aras385vn7l2snef6c0.apps.googleusercontent.com'
    },
    firebase: {
      apiKey: "AIzaSyDIv-u7mdbv2VQ-h663w5Y7qDr18ZWuRCQ",
      authDomain: "rth-development.firebaseapp.com",
      databaseURL: "https://rth-development.firebaseio.com",
      projectId: "rth-development",
      storageBucket: "rth-development.appspot.com",
      messagingSenderId: "965079709107"
    }
  },
  test: {
    environment: 'test',
    apiUrl: 'http://localhost:3001',
    facebook: {
      appId: '318259078653854'
    },
    google: {
      appId:
        '965079709107-me02b25bmsnr7aras385vn7l2snef6c0.apps.googleusercontent.com'
    },
    firebase: {
      apiKey: "AIzaSyDIv-u7mdbv2VQ-h663w5Y7qDr18ZWuRCQ",
      authDomain: "rth-development.firebaseapp.com",
      databaseURL: "https://rth-development.firebaseio.com",
      projectId: "rth-development",
      storageBucket: "rth-development.appspot.com",
      messagingSenderId: "965079709107"
    }
  },
  staging: {
    environment: 'staging',
    apiUrl: 'https://rth-api-staging.japankai.com',
    facebook: {
      appId: '318259078653854'
    },
    google: {
      appId:
        '965079709107-me02b25bmsnr7aras385vn7l2snef6c0.apps.googleusercontent.com'
    },
    firebase: {
      apiKey: "AIzaSyDIv-u7mdbv2VQ-h663w5Y7qDr18ZWuRCQ",
      authDomain: "rth-development.firebaseapp.com",
      databaseURL: "https://rth-development.firebaseio.com",
      projectId: "rth-development",
      storageBucket: "rth-development.appspot.com",
      messagingSenderId: "965079709107"
    }
  },
  production: {
    environment: 'production',
    apiUrl: 'https://rth-api.japankai.com',
    facebook: {
      appId: '145368629438336'
    },
    google: {
      appId:
        '462749523037-jp06g78vr2es8odub0i25l91tf67mif2.apps.googleusercontent.com'
    },
    firebase: {
      apiKey: "AIzaSyApka6qjYuKXATCAhAQZZ5FFm5XVQknF2E",
      authDomain: "rth-production.firebaseapp.com",
      databaseURL: "https://rth-production.firebaseio.com",
      projectId: "rth-production",
      storageBucket: "rth-production.appspot.com",
      messagingSenderId: "462749523037"
    }
  }
}

export default config[process.env.NODE_ENV || 'development']
