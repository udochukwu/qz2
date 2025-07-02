#import "AppDelegate.h"
#import "Orientation.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import <RNBranch/RNBranch.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
   self.moduleName = @"AIHomework";
  // You can add your custom initial   props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  [RNBranch.branch checkPasteboardOnInstall];
  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];
  NSURL *jsCodeLocation;

  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];

}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
    [RNBranch application:app openURL:url options:options];
    return YES;
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
   [RNBranch continueUserActivity:userActivity];
   return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}
 
- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

@end
