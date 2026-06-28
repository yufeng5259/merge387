import SdkManager from './SdkManager';
import ADWrap from './ADWrap';
import PaymentWrap from './PaymentWrap';
import ShareWrap from './ShareWrap';
import UserWrap from './UserWrap';
import LogEventWrap from './LogEventWrap';
import LeaderBoardWrap from './LeaderBoardWrap';
import NativeWrap from './NativeWrap';
import NotificationWrap from './NotificationWrap';

type AppKitRegistry = Record<string, unknown>;
type AppKitWindow = Window & { AppKit?: AppKitRegistry };

let AppKit: AppKitRegistry = {};

AppKit.SdkManager = SdkManager;
AppKit.ADWrap = ADWrap;
AppKit.PaymentWrap = PaymentWrap;
AppKit.ShareWrap = ShareWrap;
AppKit.UserWrap = UserWrap;
AppKit.LogEventWrap = LogEventWrap;
AppKit.LeaderBoardWrap = LeaderBoardWrap;
AppKit.NativeWrap = NativeWrap;
AppKit.NotificationWrap = NotificationWrap;

(window as AppKitWindow).AppKit = AppKit;

export default AppKit;
