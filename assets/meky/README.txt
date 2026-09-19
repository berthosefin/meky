Meky — Expo/RN visual assets
================================

Generated from the supplied visual identity board.

Files:
- icon.png                    1024x1024  standard Expo app icon
- splash-icon.png             1024x1024  transparent splash mark
- android-icon-foreground.png 432x432    Android adaptive foreground
- android-icon-background.png 432x432    Android adaptive background
- android-icon-monochrome.png 432x432    Android themed/monochrome icon
- favicon.png                  48x48     web favicon

Suggested Expo app.json/app.config.js paths:

{
  "expo": {
    "icon": "./assets/icon.png",
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/android-icon-foreground.png",
        "backgroundImage": "./assets/android-icon-background.png",
        "monochromeImage": "./assets/android-icon-monochrome.png"
      }
    },
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#0C1113"
    }
  }
}

Note: the exact Expo SDK/version can affect which adaptive-icon fields are supported.
