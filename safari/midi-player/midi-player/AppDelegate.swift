import Cocoa
import SafariServices.SFSafariApplication

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
    func applicationDidFinishLaunching(_ aNotification: Notification) {
        SFSafariApplication.showPreferencesForExtension(
            withIdentifier: "Jazz-Soft.midi-player.extension",
            completionHandler: { (_: Error?) -> Void in  sleep(1); NSApp.terminate(nil); });
    }
}
