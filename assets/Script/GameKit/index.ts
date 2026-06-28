import '../LegacyGlobals';
import NetRequest from './../Web/NetRequest';
import ServerRequest from './../Web/ServerRequest';
import BatchRequest from './../Web/BatchRequest';
import WebEvent from './../Web/WebEvent';
import DownloadRequest from './../Web/DownloadRequest';
import DataCache from './DataCache';
import TimeUtil from './TimeUtil';
import StringUtil from './StringUtil';
import FuncTools from './FuncTools';
import PlayerPrefs from './PlayerPrefs';
import GameEvent from './GameEvent';
import ClockUtil from './ClockUtil';
import MergeUtil from '../game/merge/MergeUtil';
import BackKeyManager from './BackKeyManager';
import SoundManager from './SoundManager';
import ControllerTable from './ui/ControllerTable';
import ChildWindowChain from './ui/ChildWindowChain';
import AutoWindowQueue from './ui/AutoWindowQueue';

const existingGameKit = typeof global !== 'undefined' && global.GameKit ? global.GameKit : {};
const GameKit: any = existingGameKit;

GameKit.NetRequest = NetRequest;
GameKit.ServerRequest = ServerRequest;
GameKit.BatchRequest = BatchRequest;
GameKit.WebEvent = WebEvent;
GameKit.DownloadRequest = DownloadRequest;

GameKit.i18n = GameKit.i18n || {};
GameKit.DataCache = DataCache;
GameKit.TimeUtil = TimeUtil;
GameKit.StringUtil = StringUtil;
GameKit.FuncTools = FuncTools;
GameKit.PlayerPrefs = PlayerPrefs;
GameKit.GameEvent = GameEvent;
GameKit.ClockUtil = ClockUtil;
GameKit.MergeUtil = MergeUtil;
GameKit.BackKeyManager = BackKeyManager;

GameKit.SoundManager = SoundManager;

GameKit.ControllerTable = ControllerTable;
GameKit.ChildWindowChain = ChildWindowChain;
GameKit.AutoWindowQueue = AutoWindowQueue;

global.GameKit = GameKit;
export default GameKit;
