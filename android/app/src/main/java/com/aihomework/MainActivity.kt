package com.aihomework
import io.branch.rnbranch.*
import android.content.Intent
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.os.Bundle
import android.content.Intent
import android.content.res.Configuration

class MainActivity : ReactActivity() {

    //react-native-screens override
    override fun onCreate(savedInstanceState: Bundle?) {
      super.onCreate(null);
    }
        // Override onStart:
    override fun onStart() {
        super.onStart()
        RNBranchModule.initSession(getIntent().getData(), this)
    }
    
    // Override onNewIntent:
    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        setIntent(intent)
        RNBranchModule.reInitSession(this)
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
       super.onConfigurationChanged(newConfig)
       Intent intent = new Intent("onConfigurationChanged")
       intent.putExtra("newConfig", newConfig)
       this.sendBroadcast(intent)
    }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
    override fun getMainComponentName(): String = "AIHomework"

 /* Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */	  
  override fun createReactActivityDelegate(): ReactActivityDelegate =  DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
